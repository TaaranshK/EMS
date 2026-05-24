using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Employee_mangemnet_System.Data;

namespace Employee_mangemnet_System.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    [Authorize(Roles = "SuperAdmin")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _db;

        public DashboardController(AppDbContext db)
        {
            _db = db;
        }

        //GET /api/dashboard/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalEmployees = await _db.Employees.CountAsync();
            var activeEmployees = await _db.Employees.CountAsync(e => e.IsActive);
            var inactiveEmployees = await _db.Employees.CountAsync(e => !e.IsActive);

            //Employees Who havent Change Password yet
            var pendingOnboarding = await _db.Employees.CountAsync(e => !e.IsPasswordChanged);
            //Employees Who Completed Onboarding
            var onboardingComplete = await _db.Employees.CountAsync(e => e.IsPasswordChanged);

            //Department Breakdown
            var byDepartment = await _db.Employees
                                .Where(e => e.Department != null)
                                .GroupBy(e => e.Department)
                                .Select(g => new
                                {
                                    Department = g.Key,
                                    count = g.Count()
                                })
                                .ToListAsync();

            // Last 5 Recently Added Employees
            var recentEmployees = await _db.Employees
                .OrderByDescending(e => e.CreatedAt)
                .Take(5)
                .Select(e => new
                {
                    e.Id,
                    e.FirstName,
                    e.LastName,
                    e.Email,
                    e.Department,
                    e.JobTitle,
                    e.IsPasswordChanged,
                    e.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                totalEmployees,
                activeEmployees,
                inactiveEmployees,
                pendingOnboarding,
                onboardingComplete,
                byDepartment,
                recentEmployees
            });
        }
    }
}