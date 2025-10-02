namespace TeachersRating.API.Entities;

public class Institute : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string InstituteUrl { get; set; } = string.Empty;

    public ICollection<Department> Departments { get; set; } = new List<Department>();
}