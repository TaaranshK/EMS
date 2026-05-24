using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Employee_mangemnet_System.Data;
using Employee_mangemnet_System.Data.Domain;
using Employee_mangemnet_System.Data.DTOs;
using Employee_mangemnet_System.Services;

namespace Employee_mangemnet_System.Controllers
{
    [ApiController]
    [Route("api/onboarding-tasks")]
    [Authorize]
    public class OnboardingTaskController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly EmailService _emailService;

        public OnboardingTaskController(AppDbContext db, EmailService emailService)
        {
            _db = db;
            _emailService = emailService;
        }

        // Employee gets their tasks in order
        // GET /api/onboarding-tasks/my-tasks
        [HttpGet("my-tasks")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetMyTasks()
        {
            var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (employeeId == null)
                return Unauthorized(new { error = "Invalid token" });

            var tasks = await _db.OnboardingTasks
                .Where(t => t.EmployeeId == Guid.Parse(employeeId))
                .OrderBy(t => t.ScheduledAt)
                .Select(t => new OnboardingTaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    ScheduledAt = t.ScheduledAt,
                    CompletedAt = t.CompletedAt
                })
                .ToListAsync();

            var total = tasks.Count;
            var completed = tasks.Count(t => t.Status == "Completed");
            var progress = total > 0 ? (int)Math.Round((double)completed / total * 100) : 0;

            return Ok(new
            {
                total,
                completed,
                progress,  // e.g 18%
                tasks
            });
        }

        // Employee updates task status
        // PATCH /api/onboarding-tasks/{id}/status
        [HttpPatch("{id:guid}/status")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateTaskStatusDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (employeeId == null)
                return Unauthorized(new { error = "Invalid token" });

            var task = await _db.OnboardingTasks
                .FirstOrDefaultAsync(t =>
                    t.Id == id &&
                    t.EmployeeId == Guid.Parse(employeeId));

            if (task == null)
                return NotFound(new { error = "Task not found" });

            task.Status = dto.Status;
            task.CompletedAt = dto.Status == "Completed" ? DateTime.UtcNow : null;

            await _db.SaveChangesAsync();

            return Ok(new { message = $"Task marked as {dto.Status}" });
        }

        // SuperAdmin sees all tasks for a specific employee
        // GET /api/onboarding-tasks/employee/{employeeId}
        [HttpGet("employee/{employeeId:guid}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> GetByEmployee(Guid employeeId)
        {
            var tasks = await _db.OnboardingTasks
                .Where(t => t.EmployeeId == employeeId)
                .OrderBy(t => t.ScheduledAt)
                .Select(t => new OnboardingTaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    ScheduledAt = t.ScheduledAt,
                    CompletedAt = t.CompletedAt
                })
                .ToListAsync();

            var total = tasks.Count;
            var completed = tasks.Count(t => t.Status == "Completed");
            var progress = total > 0 ? (int)Math.Round((double)completed / total * 100) : 0;

            return Ok(new { total, completed, progress, tasks });
        }

        // SuperAdmin schedules a meeting for one or more employees.
        // POST /api/onboarding-tasks/schedule-meeting
        // Stores meeting as an onboarding task with a well-known description prefix.
        [HttpPost("schedule-meeting")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> ScheduleMeeting([FromBody] ScheduleMeetingDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var title = string.IsNullOrWhiteSpace(dto.Title) ? "Meeting" : dto.Title.Trim();
            var mode = string.IsNullOrWhiteSpace(dto.Mode) ? null : dto.Mode.Trim();

            var employees = await _db.Employees
                .Where(e => dto.EmployeeIds.Contains(e.Id))
                .Select(e => new { e.Id, e.Email, e.FirstName, e.LastName })
                .ToListAsync();

            if (employees.Count == 0)
                return BadRequest(new { error = "No valid employees found for the provided ids." });

            // Convention to identify meeting tasks without DB schema changes.
            // Keep the first line stable for server-side filtering.
            var descriptionPrefix = $"MEETING_URL: {dto.MeetingUrl}";
            var descriptionMode = mode != null ? $"\nMODE: {mode}" : "";

            var tasks = employees.Select(e => new OnboardingTask
            {
                EmployeeId = e.Id,
                Title = title,
                Description = descriptionPrefix + descriptionMode,
                Status = "Pending",
                ScheduledAt = dto.ScheduledAt.ToUniversalTime(),
                CreatedAt = DateTime.UtcNow
            }).ToList();

            await _db.OnboardingTasks.AddRangeAsync(tasks);
            await _db.SaveChangesAsync();

            // Send emails (best-effort per recipient).
            var results = new List<string>();
            foreach (var e in employees)
            {
                try
                {
                    await _emailService.SendMeetingInviteEmailAsync(
                        e.Email,
                        e.FirstName,
                        title,
                        dto.MeetingUrl,
                        dto.ScheduledAt,
                        mode);
                    results.Add($"Sent to {e.Email}");
                }
                catch (Exception ex)
                {
                    results.Add($"Failed for {e.Email}: {ex.Message}");
                }
            }

            return Ok(new
            {
                message = "Meeting scheduled",
                scheduledAt = dto.ScheduledAt,
                invited = employees.Count,
                emailResults = results
            });
        }

        // SuperAdmin: list meeting tasks for a given day across employees.
        // GET /api/onboarding-tasks/meetings?date=YYYY-MM-DD
        [HttpGet("meetings")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> GetMeetings([FromQuery] string? date, [FromQuery] int take = 20)
        {
            if (take <= 0) take = 20;
            if (take > 200) take = 200;

            DateTime dayStartUtc;
            if (!string.IsNullOrWhiteSpace(date) && DateTime.TryParse(date, out var parsed))
            {
                dayStartUtc = parsed.Date.ToUniversalTime();
            }
            else
            {
                dayStartUtc = DateTime.UtcNow.Date;
            }
            var dayEndUtc = dayStartUtc.AddDays(1);

            var items = await _db.OnboardingTasks
                .Where(t => t.Description != null && t.Description.StartsWith("MEETING_URL:"))
                .Where(t => t.ScheduledAt >= dayStartUtc && t.ScheduledAt < dayEndUtc)
                .OrderBy(t => t.ScheduledAt)
                .Take(take)
                .Join(
                    _db.Employees,
                    t => t.EmployeeId,
                    e => e.Id,
                    (t, e) => new
                    {
                        t.Id,
                        t.Title,
                        t.Description,
                        t.Status,
                        t.ScheduledAt,
                        employee = new { e.Id, e.FirstName, e.LastName, e.Email }
                    })
                .ToListAsync();

            return Ok(new { date = dayStartUtc, count = items.Count, items });
        }

        // SuperAdmin: list most recent meeting tasks.
        // GET /api/onboarding-tasks/meetings/recent?take=10
        [HttpGet("meetings/recent")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> GetRecentMeetings([FromQuery] int take = 10)
        {
            if (take <= 0) take = 10;
            if (take > 100) take = 100;

            var items = await _db.OnboardingTasks
                .Where(t => t.Description != null && t.Description.StartsWith("MEETING_URL:"))
                .OrderByDescending(t => t.CreatedAt)
                .Take(take)
                .Join(
                    _db.Employees,
                    t => t.EmployeeId,
                    e => e.Id,
                    (t, e) => new
                    {
                        t.Id,
                        t.Title,
                        t.Description,
                        t.Status,
                        t.ScheduledAt,
                        t.CreatedAt,
                        employee = new { e.Id, e.FirstName, e.LastName, e.Email }
                    })
                .ToListAsync();

            return Ok(new { count = items.Count, items });
        }
    }
}
