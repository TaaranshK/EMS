namespace Employee_mangemnet_System.Data.DTOs;

using System.ComponentModel.DataAnnotations;

public class SuperAdminLoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}