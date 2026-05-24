using System.ComponentModel.DataAnnotations;

namespace Employee_mangemnet_System.Data.Domain
{
    public class Employee
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public required string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public required string LastName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        public string? TemporaryPassword { get; set; }

        public string? Department { get; set; }

        public string? JobTitle { get; set; }

        public string? PhoneNumber { get; set; }

        public string? ProfilePhotoUrl { get; set; }
        public string? Address { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? LinkedInUrl { get; set; }

        public bool IsPasswordChanged { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public decimal? Salary { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}