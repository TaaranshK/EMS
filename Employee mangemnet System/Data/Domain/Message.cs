using System.ComponentModel.DataAnnotations;
namespace Employee_mangemnet_System.Data.Domain
{
    public class Message
    {
        public Guid Id {get; set;}

        [Required]
        public Guid SenderId {get; set;}

        [Required]
        public Guid ReceiverId {get; set;}

        [Required]
        [MaxLength(1000)]
        public required string Content {get; set;}

        public bool IsRead {get; set;} = false;

        public DateTime SentAt {get; set;} = DateTime.UtcNow;

    }
}
