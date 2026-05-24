namespace Employee_mangemnet_System.Data.DTOs
{
    public class EmployeeDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ProfilePhotoUrl { get; set; }
        public string? Address { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? LinkedInUrl { get; set; }
        public bool IsActive { get; set; }
        public bool IsPasswordChanged { get; set; }
        public DateTime CreatedAt { get; set; }

        public decimal? Salary { get; set; }
    }
}