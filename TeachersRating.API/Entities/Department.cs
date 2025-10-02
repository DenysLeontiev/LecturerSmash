namespace TeachersRating.API.Entities;

public class Department : BaseEntity
{
    public Guid InstituteId { get; set; }
    public Institute? Institute { get; set; } = null;

    public string LongName { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;

    public string DepartmentUrl { get; set; } = string.Empty;
    public string WorkersPageUrl { get; set; } = string.Empty;

    public ICollection<Worker> Workers { get; set; } = new List<Worker>();
}