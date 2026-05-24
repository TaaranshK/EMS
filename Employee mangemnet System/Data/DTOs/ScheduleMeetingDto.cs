using System.ComponentModel.DataAnnotations;

namespace Employee_mangemnet_System.Data.DTOs
{
    public class ScheduleMeetingDto
    {
        [Required]
        [Url]
        public string MeetingUrl { get; set; } = string.Empty;

        public string? Title { get; set; }

        // ISO string from frontend is accepted by System.Text.Json into DateTime
        [Required]
        public DateTime ScheduledAt { get; set; }

        // "Online" | "In-person" etc (free-form)
        public string? Mode { get; set; }

        [Required]
        [MinLength(1)]
        public Guid[] EmployeeIds { get; set; } = Array.Empty<Guid>();
    }
}

