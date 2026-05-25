using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

[Authorize]
public class ChatHub : Hub
{
    // Each User Joins Their Own Respective Groups which are named By Their Respective USER ID
    // So we Can Send Messages Directly To the Specific user
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
        }
        await base.OnDisconnectedAsync(exception);
    }
}