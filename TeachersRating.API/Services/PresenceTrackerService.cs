using TeachersRating.API.Interfaces;

namespace TeachersRating.API.Services;

public class PresenceTrackerService : IPresenceTrackerService
{
    public static List<string> OnlineUsers = new List<string>();

    public int GetNumberOfOnlineUsers()
    {
        lock(OnlineUsers)
        {
            return OnlineUsers.Count;
        }
    }

    public void UserConnected(string connectionId)
    {
        lock(OnlineUsers)
        {
            OnlineUsers.Add(connectionId);
        }
    }

    public void UserDisconnected(string connectionId)
    {
        lock(OnlineUsers)
        {
            OnlineUsers.Remove(connectionId);
        }
    }
}