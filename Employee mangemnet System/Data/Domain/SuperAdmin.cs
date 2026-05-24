using System.ComponentModel.DataAnnotations;

namespace Employee_mangemnet_System.Data.Domain
{
    public class SuperAdmin
    {
        public Guid Id { get; set; }
        [Required]
        [MaxLength(100)]
        public required string FullName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;




    }
}