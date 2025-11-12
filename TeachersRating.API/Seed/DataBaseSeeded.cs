using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using TeachersRating.API.Data;
using TeachersRating.API.Entities;

namespace TeachersRating.API.Seed;

public class DataBaseSeeded
{
    public static async Task SeedDataAsync(AppDbContext context)
    {
        if (await context.Institutes.AnyAsync())
        {
            return;
        }

        var jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "../NulpScrapper/ouput.json");
        
        if (!File.Exists(jsonFilePath))
        {
            throw new FileNotFoundException($"JSON data file not found at: {jsonFilePath}");
        }

        var jsonData = await File.ReadAllTextAsync(jsonFilePath);
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        var teachersList = JsonSerializer.Deserialize<List<TeacherJsonModel>>(jsonData, options);

        if (teachersList == null || teachersList.Count == 0)
        {
            return;
        }

        var institutesByHref = new Dictionary<string, Institute>();
        
        var departmentsByHref = new Dictionary<string, Department>();
        
        foreach (var teacherJson in teachersList)
        {
            if (teacherJson == null || teacherJson.department?.institute == null)
                continue;

            var instituteHref = teacherJson.department.institute.href ?? "";
            if (string.IsNullOrEmpty(instituteHref))
                continue;

            if (!institutesByHref.TryGetValue(instituteHref, out var institute))
            {
                institute = new Institute
                {
                    Id = Guid.NewGuid(),
                    Name = teacherJson.department.institute.name ?? "Unknown Institute",
                    InstituteUrl = instituteHref
                };
                
                institutesByHref.Add(instituteHref, institute);
                context.Institutes.Add(institute);
            }

            var departmentHref = teacherJson.department.href ?? "";
            if (string.IsNullOrEmpty(departmentHref))
                continue;

            if (!departmentsByHref.TryGetValue(departmentHref, out var department))
            {
                department = new Department
                {
                    Id = Guid.NewGuid(),
                    InstituteId = institute.Id,
                    Institute = institute,
                    LongName = teacherJson.department.longName ?? "Unknown Department",
                    ShortName = teacherJson.department.shortName ?? "",
                    DepartmentUrl = departmentHref,
                    WorkersPageUrl = teacherJson.department.workersPageHref ?? ""
                };
                
                departmentsByHref.Add(departmentHref, department);
                context.Departments.Add(department);
            }

            if (string.IsNullOrEmpty(teacherJson.fullName))
                continue;

            var workerId = Guid.NewGuid();
            var photoId = Guid.NewGuid();
            
            var photo = new Photo
            {
                Id = photoId,
                WorkerId = workerId,
                Url = teacherJson.imageUrl ?? ""
            };
            
            var worker = new Worker
            {
                Id = workerId,
                FullName = teacherJson.fullName ?? "",
                Position = teacherJson.position ?? "",
                PersonalPageUrl = teacherJson.personalPageHref ?? "",
                PhotoId = photoId
            };
            
            context.Photos.Add(photo);
            context.Workers.Add(worker);

            department.Workers.Add(worker);
        }

        await context.SaveChangesAsync();
    }
}

public class TeacherJsonModel
{
    public string? imageUrl { get; set; }
    public string? fullName { get; set; }
    public string? position { get; set; }
    public string? personalPageHref { get; set; }
    public DepartmentJsonModel? department { get; set; }
}

public class DepartmentJsonModel
{
    public InstituteJsonModel? institute { get; set; }
    public string? href { get; set; }
    public string? longName { get; set; }
    public string? shortName { get; set; }
    public string? workersPageHref { get; set; }
}

public class InstituteJsonModel
{
    public string? name { get; set; }
    public string? href { get; set; }
}