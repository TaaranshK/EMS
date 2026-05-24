namespace Employee_mangemnet_System.Data.Domain
{
    public class OnboardingTask
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid EmployeeId { get; set; }

        public Employee Employee { get; set; } = null!;

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        // Pending, InProgress, Completed
        public string Status { get; set; } = "Pending";

        public DateTime ScheduledAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

    }
}