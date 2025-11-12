namespace TeachersRating.API.Interfaces;

public interface IPresenceTrackerService
{
    void UserConnected(string connectionId);
    void UserDisconnected(string connectionId);

    int GetNumberOfOnlineUsers();
}