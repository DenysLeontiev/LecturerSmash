namespace TeachersRating.API.DTOs;

public class UsersOnlineStatDto
{
    public Guid Id { get; set; }
    public int NumberOfOnlineUsers { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateModified { get; set; }
    public bool IsDeleted { get; set; }
}