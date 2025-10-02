namespace TeachersRating.API.Entities;

public class Worker : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string PersonalPageUrl { get; set; } = string.Empty;

    public Guid PhotoId { get; set; }
    public Photo? Photo { get; set; } = null;

    public ICollection<Department> Departments { get; set; } = new List<Department>();
}