namespace TeachersRating.API.DTOs;

public class DepartmentDto
{
    public Guid Id { get; set; }
    public string LongName { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;
    public string DepartmentUrl { get; set; } = string.Empty;
    public string WorkersPageUrl { get; set; } = string.Empty;
    public InstituteSimpleDto Institute { get; set; } = new();
    public List<WorkerSimpleDto> Workers { get; set; } = new();
}

public class DepartmentSimpleDto
{
    public Guid Id { get; set; }
    public string LongName { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;
    public string DepartmentUrl { get; set; } = string.Empty;
}