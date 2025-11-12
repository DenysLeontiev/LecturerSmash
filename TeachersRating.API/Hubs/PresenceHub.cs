using Microsoft.AspNetCore.SignalR;
using TeachersRating.API.Interfaces;

namespace TeachersRating.API.Hubs;

public class PresenceHub : Hub
{
    private readonly IPresenceTrackerService _presenceTracker;

    public PresenceHub(IPresenceTrackerService presenceTracker)
    {
        _presenceTracker = presenceTracker;
    }

    public override async Task OnConnectedAsync()
    {
        string connectionId = Context.ConnectionId;
        _presenceTracker.UserConnected(connectionId);

        int numberOfOnlineUsers = _presenceTracker.GetNumberOfOnlineUsers();
        await Clients.Group("AdminGroup").SendAsync("NumberOfOnlineUsersChanged", numberOfOnlineUsers);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        string connectionId = Context.ConnectionId;
        _presenceTracker.UserDisconnected(connectionId);

        int numberOfOnlineUsers = _presenceTracker.GetNumberOfOnlineUsers();
        await Clients.Group("AdminGroup").SendAsync("NumberOfOnlineUsersChanged", numberOfOnlineUsers);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinAdminGroup()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "AdminGroup");
        int numberOfOnlineUsers = _presenceTracker.GetNumberOfOnlineUsers();
        await Clients.Caller.SendAsync("NumberOfOnlineUsersChanged", numberOfOnlineUsers);
    }

    public async Task LeaveAdminGroup()
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "AdminGroup");
    }
}