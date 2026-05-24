using System.ComponentModel.DataAnnotations;

// Employees Can Update Their Profile 
namespace Employee_mangemnet_System.Data.DTOs
{
    public class UpdateProfileDto
    {
        [Phone]
        public string? PhoneNumber { get; set; }

        public string? ProfilePhotoUrl { get; set; }

        public string? Address { get; set; }

        public string? DateOfBirth { get; set; }

        [RegularExpression("^(Male|Female|Other)$",
            ErrorMessage = "Gender must be Male, Female or Other")]
        public string? Gender { get; set; }

        [Url]
        public string? LinkedInUrl { get; set; }
    }
}