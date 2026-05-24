using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Employee_mangemnet_System.Data;
using DocumentFormat.OpenXml.Wordprocessing;
using Employee_mangemnet_System.Data.Domain;
using Employee_mangemnet_System.Data.DTOs;
using Employee_mangemnet_System.Services;
using System.ComponentModel.DataAnnotations;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "SuperAdmin")]

public class InviteController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly EmailService _emailService;
    private readonly OnboardingService _onboarding;

    public InviteController(AppDbContext dbContext, EmailService emailService, OnboardingService onboarding)
    {
        _dbContext = dbContext;
        _emailService = emailService;
        _onboarding = onboarding;
    }

    //POST api/invite/single
    [HttpPost("Single")]
    public async Task<IActionResult> InviteSingleEmployee([FromBody] InviteEmployeeDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check IF Employee Already Exists
        var existingEmployee = await _dbContext.Employees
            .FirstOrDefaultAsync(e => e.Email == dto.Email);

        if (existingEmployee != null)
            return BadRequest("Employee With This Email Already Exists");
        var temporaryPassword = GenerateTemporaryPassword();

        // Create Employye
        var employee = new Employee
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Department = dto.Department,
            JobTitle = dto.JobTitle,
            PhoneNumber = dto.PhoneNumber,
            Salary = dto.Salary,
            TemporaryPassword = temporaryPassword,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(temporaryPassword),
            IsPasswordChanged = false,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.Employees.AddAsync(employee);
        await _dbContext.SaveChangesAsync();

        // Auto create onboarding tasks
        await _onboarding.CreateDefaultTasksAsync(employee.Id);

        // Send Invite Email
        await _emailService.SendInviteEmailAsync(employee.Email, employee.FirstName, temporaryPassword, GetFrontendBaseUrlFromRequest());

        return Ok(new { Message = $"Invite sent successfully to {employee.Email}" });
    }


    // POST api/invite/bulk
    [HttpPost("bulk")]
    [ApiExplorerSettings(IgnoreApi = true)]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> InviteBulkEmployees([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Please upload a valid Excel file");

        var results = new List<string>(); // Track success/failure per row

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);

        using var workbook = new ClosedXML.Excel.XLWorkbook(stream);
        var worksheet = workbook.Worksheet(1); // Read first sheet
        var rows = worksheet.RowsUsed().Skip(1); // Skip header row

        foreach (var row in rows)
        {
            try
            {
                var email = row.Cell(3).GetString().Trim();

                // Check if Employee already exists
                var existingEmployee = await _dbContext.Employees
                    .FirstOrDefaultAsync(e => e.Email == email);

                if (existingEmployee != null)
                {
                    results.Add($"Skipped {email} - already exists");
                    continue;
                }

                // Generate Temporary Password
                var temporaryPassword = GenerateTemporaryPassword();

                // Read Salary safely from Excel Row (Column 7)
                decimal? salary = null;
                try
                {
                    if (!row.Cell(7).IsEmpty())
                        salary = row.Cell(7).GetValue<decimal>();
                }
                catch
                {
                    // If salary cannot be parsed, leave it as null
                }

                // Read from Excel Row
                var employee = new Employee
                {
                    FirstName = row.Cell(1).GetString().Trim(),
                    LastName = row.Cell(2).GetString().Trim(),
                    Email = email,
                    Department = row.Cell(4).GetString().Trim(),
                    JobTitle = row.Cell(5).GetString().Trim(),
                    PhoneNumber = row.Cell(6).GetString().Trim(),
                    Salary = salary,
                    TemporaryPassword = temporaryPassword,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(temporaryPassword),
                    IsPasswordChanged = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _dbContext.Employees.AddAsync(employee);
                await _dbContext.SaveChangesAsync();

                // Auto create onboarding tasks for each employee
                await _onboarding.CreateDefaultTasksAsync(employee.Id);

                // Send Invite Email
                await _emailService.SendInviteEmailAsync(employee.Email, employee.FirstName, temporaryPassword, GetFrontendBaseUrlFromRequest());

                results.Add($"Invited {email} successfully");
            }
            catch (Exception ex)
            {
                results.Add($"Failed for row {row.RowNumber()} - {ex.Message}");
            }
        }

        return Ok(new { Results = results });
    }

    // Helper to Generate Random Temporary Password
    private string GenerateTemporaryPassword()
    {
        return "Temp@" + Guid.NewGuid().ToString().Substring(0, 6);
    }

    private string? GetFrontendBaseUrlFromRequest()
    {
        // Prefer Origin (browser requests), fallback to Referer.
        var origin = Request.Headers.Origin.FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(origin))
            return origin;

        var referer = Request.Headers.Referer.FirstOrDefault();
        if (Uri.TryCreate(referer, UriKind.Absolute, out var parsed) &&
            (parsed.Scheme == Uri.UriSchemeHttp || parsed.Scheme == Uri.UriSchemeHttps))
        {
            return $"{parsed.Scheme}://{parsed.Authority}";
        }

        return null;
    }
}


