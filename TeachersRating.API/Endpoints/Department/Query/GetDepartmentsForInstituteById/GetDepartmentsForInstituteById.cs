using Microsoft.EntityFrameworkCore;
using TeachersRating.API.Data;
using TeachersRating.API.Extensions;
using TeachersRating.API.Interfaces;

namespace TeachersRating.API.Endpoints.Department.Query.GetDepartmentsForInstituteById;

public class GetDepartmentsForInstituteById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/departments/{intstituteId:guid}", async (Guid intstituteId, AppDbContext context) =>
        {
            var departments = await context.Departments.Where(x => x.InstituteId.Equals(intstituteId))
                .AsNoTracking()
                .ToListAsync();

            var mappedDepartments = departments.Select(d => d.ToDto()).ToList();

            return Results.Ok(mappedDepartments);
        }).WithName("GetDepartmentsForInstitute");
    }
}