namespace TeachersRating.API.Entities;

public class Photo : BaseEntity
{
    public Guid WorkerId { get; set; }
    public Worker? Worker { get; set; } = null;

    public string Url { get; set; } = string.Empty;
}