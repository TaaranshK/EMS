namespace Employee_mangemnet_System.Data.DTOs;

using System.ComponentModel.DataAnnotations;


public class ChangePasswordDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string TemporaryPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}