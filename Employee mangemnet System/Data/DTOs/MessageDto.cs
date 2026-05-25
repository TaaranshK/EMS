using System.ComponentModel.DataAnnotations;

public class SendmessageDto
{
    [Required]
    public Guid ReceiverId {get; set;}

    [Required]
    [MaxLength(1000)]
    public required string Content {get;set;}
}

public class MessageResponseDto
{
    public Guid Id {get; set;}
    public Guid SenderId {get; set;}

    public required string SenderName {get; set;}

    public Guid ReceiverId {get; set;}
    public required string? ReceiverName {get; set;}

    public required string Content {get; set;}

    public bool IsRead {get; set;}
    public DateTime SentAt {get; set;}
}