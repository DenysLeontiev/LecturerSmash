namespace TeachersRating.API.Entities;

public class UsersOnlineStat : BaseEntity
{
    public int NumberOfOnlineUsers { get; set; }

    public UsersOnlineStat(int numberOfOnlineUsers)
    {
        NumberOfOnlineUsers = numberOfOnlineUsers;
    }
}