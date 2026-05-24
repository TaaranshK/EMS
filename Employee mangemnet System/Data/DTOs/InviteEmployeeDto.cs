namespace Employee_mangemnet_System.Data.DTOs;

using System.ComponentModel.DataAnnotations;

public class InviteEmployeeDto
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? Department { get; set; }
    public string? JobTitle { get; set; }

    public string? PhoneNumber { get; set; }

    public decimal? Salary { get; set; }

}