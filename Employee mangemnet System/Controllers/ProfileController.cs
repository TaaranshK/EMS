using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Employee_mangemnet_System.Data;
using Employee_mangemnet_System.Data.DTOs;

namespace Employee_mangemnet_System.Controllers
{
    [ApiController]
    [Route("api/profile")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public ProfileController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        //GET /api/profile/me
        //Employees Seees Their Own Profile
        [HttpGet("me")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetMyProfile()
        {
            var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (employeeId == null)
                return Unauthorized(new { error = "Invalid Token" });
            var employee = await _db.Employees
                .FirstOrDefaultAsync(e => e.Id == Guid.Parse(employeeId));
            if (employee == null)
                return NotFound(new { error = "Employee not Found" });

            var dto = new EmployeeDto
            {
                Id = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Email = employee.Email,
                Department = employee.Department,
                JobTitle = employee.JobTitle,
                PhoneNumber = employee.PhoneNumber,
                ProfilePhotoUrl = employee.ProfilePhotoUrl,
                Address = employee.Address,
                DateOfBirth = employee.DateOfBirth,
                Gender = employee.Gender,
                LinkedInUrl = employee.LinkedInUrl,
                Salary = employee.Salary,
                IsActive = employee.IsActive,
                IsPasswordChanged = employee.IsPasswordChanged,
                CreatedAt = employee.CreatedAt
            };

            return Ok(dto);
        }
        //PUT /api/profile/update
        [HttpPut("update")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (employeeId == null)
                return Unauthorized(new { error = "Invalid Token" });

            var employee = await _db.Employees
                .FirstOrDefaultAsync(e => e.Id == Guid.Parse(employeeId));

            if (employee == null)
                return NotFound(new { error = "Employee Not Found" });

            // Only Update Fields That Were Actually Sent
            if (dto.PhoneNumber != null) employee.PhoneNumber = dto.PhoneNumber;
            if (dto.ProfilePhotoUrl != null) employee.ProfilePhotoUrl = dto.ProfilePhotoUrl;
            if (dto.Address != null) employee.Address = dto.Address;
            if (dto.DateOfBirth != null) employee.DateOfBirth = dto.DateOfBirth;
            if (dto.Gender != null) employee.Gender = dto.Gender;
            if (dto.LinkedInUrl != null) employee.LinkedInUrl = dto.LinkedInUrl;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Profile updated successfully" });
        }
    }
}