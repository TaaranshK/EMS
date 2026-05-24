using System.ComponentModel.DataAnnotations;

namespace Employee_mangemnet_System.Data.DTOs
{
    public class OnboardingTaskDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime ScheduledAt { get; set; }
        public DateTime? CompletedAt { get; set; }

        // Is task overdue?
        public bool IsOverdue => Status != "Completed" && ScheduledAt < DateTime.UtcNow;
    }

    public class UpdateTaskStatusDto
    {
        [Required]
        // Only allow these 3 values
        [RegularExpression("^(Pending|InProgress|Completed)$",
            ErrorMessage = "Status must be Pending, InProgress or Completed")]
        public string Status { get; set; } = string.Empty;
    }
}