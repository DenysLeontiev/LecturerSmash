namespace TeachersRating.API.DTOs;

public class InstituteDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string InstituteUrl { get; set; } = string.Empty;
    public List<DepartmentDto> Departments { get; set; } = new();
}

public class InstituteSimpleDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string InstituteUrl { get; set; } = string.Empty;
}