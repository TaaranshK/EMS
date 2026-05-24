using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Employee_mangemnet_System.Data;
using Employee_mangemnet_System.Data.Domain;
using Employee_mangemnet_System.Data.DTOs;

[Route("api/[controller]")]
[ApiController]

public class AuthController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    // Creating The Supeadmin Login Different Endpoint 
    // POST api/auth/superadmin-login
    [HttpPost("superadmin-login")]
    public async Task<IActionResult> SuperAdminLogin([FromBody] SuperAdminLoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);


        // Find SuperAdmin By Email
        var superAdmin = await _dbContext.SuperAdmins
            .FirstOrDefaultAsync(s => s.Email == dto.Email);


        if (superAdmin == null)
            return Unauthorized("Invalid Email Or Password");

        // Verify The Password
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, superAdmin.PasswordHash);

        if (!isPasswordValid)
            return Unauthorized("Invalid email or Password");

        // Generate The JWT Token 
        var token = GenerateJwtToken(superAdmin.Id.ToString(), superAdmin.Email, "SuperAdmin");

        return Ok(new { Token = token });
    }

    // POST api/auth/employee-login 
    [HttpPost("employee-login")]
    public async Task<IActionResult> EmployeeLogin([FromBody] EmployeeLoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Find The Employee By The Email
        var employee = await _dbContext.Employees
            .FirstOrDefaultAsync(e => e.Email == dto.Email);

        if (employee == null)
            return Unauthorized("Invalid Email Or Password");

        if (!employee.IsActive)
            return Unauthorized("Your Account Is inactive");

        //Verify The Password
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, employee.PasswordHash);

        if (!isPasswordValid)
            return Unauthorized("Invalid Email Or Password");


        // IF The First Login Tell Frontend To Redirect To Change PassWord page
        if (!employee.IsPasswordChanged)
        {
            return Ok(new
            {
                RequiresPasswordChange = true,
                Message = "Please Change Your Temporary Password"
            });


        }
        // Generate The JWT TOken
        var token = GenerateJwtToken(employee.Id.ToString(), employee.Email, "Employee");


        return Ok(new { Token = token });
    }


    //POST api/auth/change-password
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { Message = "Invalid request", Errors = ModelState });


        // Find Employee by Email
        var employee = await _dbContext.Employees
            .FirstOrDefaultAsync(e => e.Email == dto.Email);

        if (employee == null)
            return NotFound(new { Message = "Employee not found" });


        if (employee.IsPasswordChanged)
            return BadRequest(new { Message = "Password already changed" });

        // Verify The Temporary Password
        // Preferred: compare against stored temporary password (invites)
        // Fallback: if TemporaryPassword was not stored (older seed data), verify against current hash
        var tempOk = employee.TemporaryPassword != null
            ? employee.TemporaryPassword == dto.TemporaryPassword
            : BCrypt.Net.BCrypt.Verify(dto.TemporaryPassword, employee.PasswordHash);

        if (!tempOk)
            return BadRequest(new { Message = "Invalid temporary password" });

        //hash New Password and Save 
        employee.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        employee.TemporaryPassword = null;
        employee.IsPasswordChanged = true;

        await _dbContext.SaveChangesAsync();


        // Generate JWT Token after password change
        var token = GenerateJwtToken(employee.Id.ToString(), employee.Email, "Employee");

        return Ok(new { Token = token, Message = "Password changed successfully" });
    }

    // Helper Method To Generate The JWT Tokens
    private string GenerateJwtToken(string id, string email, string role)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, id),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "YourSuperSecretKeyHereMakeItLong123!"));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

