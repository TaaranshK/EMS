using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Employee_mangemnet_System.Data;
using Employee_mangemnet_System.Data.Domain;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class MessageController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<ChatHub> _hubContext;

    public MessageController(AppDbContext dbContext, IHubContext<ChatHub> hubContext)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    private static string[] SplitFullName(string fullName)
    {
        var parts = fullName.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
        return parts.Length == 1 ? [parts[0], ""] : parts;
    }

    private async Task<UserSummary?> GetUserSummary(Guid userId)
    {
        var employee = await _dbContext.Employees
            .Where(e => e.Id == userId)
            .Select(e => new UserSummary(
                e.Id,
                e.FirstName,
                e.LastName,
                e.Email,
                e.JobTitle ?? "Employee",
                e.Department ?? "General",
                e.PhoneNumber,
                e.CreatedAt))
            .FirstOrDefaultAsync();

        if (employee != null)
            return employee;

        var admin = await _dbContext.SuperAdmins
            .Where(s => s.Id == userId)
            .Select(s => new { s.Id, s.FullName, s.Email, s.CreatedAt })
            .FirstOrDefaultAsync();

        if (admin == null)
            return null;

        var name = SplitFullName(admin.FullName);
        return new UserSummary(
            admin.Id,
            name[0],
            name.Length > 1 ? name[1] : "",
            admin.Email,
            "Super Admin",
            "Administration",
            null,
            admin.CreatedAt);
    }

    private async Task<Dictionary<Guid, UserSummary>> GetUserLookup(IEnumerable<Guid> userIds)
    {
        var ids = userIds.Distinct().ToList();

        var employees = await _dbContext.Employees
            .Where(e => ids.Contains(e.Id))
            .Select(e => new UserSummary(
                e.Id,
                e.FirstName,
                e.LastName,
                e.Email,
                e.JobTitle ?? "Employee",
                e.Department ?? "General",
                e.PhoneNumber,
                e.CreatedAt))
            .ToListAsync();

        var admins = await _dbContext.SuperAdmins
            .Where(s => ids.Contains(s.Id))
            .Select(s => new { s.Id, s.FullName, s.Email, s.CreatedAt })
            .ToListAsync();

        var lookup = employees.ToDictionary(e => e.Id);
        foreach (var admin in admins)
        {
            var name = SplitFullName(admin.FullName);
            lookup[admin.Id] = new UserSummary(
                admin.Id,
                name[0],
                name.Length > 1 ? name[1] : "",
                admin.Email,
                "Super Admin",
                "Administration",
                null,
                admin.CreatedAt);
        }

        return lookup;
    }

    [HttpGet("conversation/{otherUserId}")]
    public async Task<IActionResult> GetConversation(Guid otherUserId)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == Guid.Empty)
            return Unauthorized("Invalid token");

        var messages = await _dbContext.Messages
            .Where(m =>
                (m.SenderId == currentUserId && m.ReceiverId == otherUserId) ||
                (m.SenderId == otherUserId && m.ReceiverId == currentUserId))
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        var userLookup = await GetUserLookup(messages.SelectMany(m => new[] { m.SenderId, m.ReceiverId }));

        var unread = messages
            .Where(m => m.SenderId == otherUserId && m.ReceiverId == currentUserId && !m.IsRead)
            .ToList();

        unread.ForEach(m => m.IsRead = true);
        await _dbContext.SaveChangesAsync();

        var response = messages.Select(m => new MessageResponseDto
        {
            Id = m.Id,
            SenderId = m.SenderId,
            SenderName = userLookup.TryGetValue(m.SenderId, out var sender) ? sender.FullName : "Unknown User",
            ReceiverId = m.ReceiverId,
            ReceiverName = userLookup.TryGetValue(m.ReceiverId, out var receiver) ? receiver.FullName : "Unknown User",
            Content = m.Content,
            IsRead = m.IsRead,
            SentAt = m.SentAt,
        });

        return Ok(response);
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] SendmessageDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var currentUserId = GetCurrentUserId();
        if (currentUserId == Guid.Empty)
            return Unauthorized("Invalid token");

        var sender = await GetUserSummary(currentUserId);
        if (sender == null)
            return NotFound("Sender Not Found");

        var receiver = await GetUserSummary(dto.ReceiverId);
        if (receiver == null)
            return NotFound("Receiver Not Found");

        var message = new Message
        {
            SenderId = currentUserId,
            ReceiverId = dto.ReceiverId,
            Content = dto.Content,
            IsRead = false,
            SentAt = DateTime.UtcNow,
        };

        await _dbContext.Messages.AddAsync(message);
        await _dbContext.SaveChangesAsync();

        var responseDto = new MessageResponseDto
        {
            Id = message.Id,
            SenderId = message.SenderId,
            SenderName = sender.FullName,
            ReceiverId = message.ReceiverId,
            ReceiverName = receiver.FullName,
            Content = message.Content,
            IsRead = message.IsRead,
            SentAt = message.SentAt,
        };

        await _hubContext.Clients
            .Group(dto.ReceiverId.ToString())
            .SendAsync("ReceiveMessage", responseDto);

        return Ok(responseDto);
    }

    [HttpGet("contacts")]
    public async Task<IActionResult> GetContacts()
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == Guid.Empty)
            return Unauthorized("Invalid token");

        var employeeContacts = await _dbContext.Employees
            .Where(e => e.Id != currentUserId)
            .Select(e => new UserSummary(
                e.Id,
                e.FirstName,
                e.LastName,
                e.Email,
                e.JobTitle ?? "Employee",
                e.Department ?? "General",
                e.PhoneNumber,
                e.CreatedAt))
            .ToListAsync();

        var adminContacts = await _dbContext.SuperAdmins
            .Where(s => s.Id != currentUserId)
            .Select(s => new { s.Id, s.FullName, s.Email, s.CreatedAt })
            .ToListAsync();

        var contacts = employeeContacts
            .Concat(adminContacts.Select(admin =>
            {
                var name = SplitFullName(admin.FullName);
                return new UserSummary(
                    admin.Id,
                    name[0],
                    name.Length > 1 ? name[1] : "",
                    admin.Email,
                    "Super Admin",
                    "Administration",
                    null,
                    admin.CreatedAt);
            }))
            .Select(user =>
            {
                var lastMessage = _dbContext.Messages
                    .Where(m =>
                        (m.SenderId == user.Id && m.ReceiverId == currentUserId) ||
                        (m.SenderId == currentUserId && m.ReceiverId == user.Id))
                    .OrderByDescending(m => m.SentAt)
                    .Select(m => new { m.Content, m.SentAt })
                    .FirstOrDefault();

                return new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.JobTitle,
                    user.Department,
                    user.PhoneNumber,
                    user.CreatedAt,
                    UnreadCount = _dbContext.Messages
                        .Count(m => m.SenderId == user.Id && m.ReceiverId == currentUserId && !m.IsRead),
                    LastMessage = lastMessage != null ? lastMessage.Content : null,
                    LastMessageAt = lastMessage != null ? lastMessage.SentAt : (DateTime?)null
                };
            })
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .ToList();

        return Ok(contacts);
    }

    private sealed record UserSummary(
        Guid Id,
        string FirstName,
        string LastName,
        string Email,
        string JobTitle,
        string Department,
        string? PhoneNumber,
        DateTime CreatedAt)
    {
        public string FullName => $"{FirstName} {LastName}".Trim();
    }
}
