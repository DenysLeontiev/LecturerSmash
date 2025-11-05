using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeachersRating.API.Data;
using TeachersRating.API.Extensions;
using TeachersRating.API.Interfaces;

namespace TeachersRating.API.Endpoints.Worker.Query.GetTopWorkersForDepartmentById;

public class GetTopWorkersForDepartmentById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("{departmentId:guid}/top", async (Guid departmentId, [FromServices] AppDbContext context) =>
        {
            var topWorkers = await context.Workers.OrderByDescending(x => x.NumberOfLikes)
                                                  .Where(x => x.Departments.Any(x => x.Equals(departmentId)))
                                                  .AsNoTracking()
                                                  .ToListAsync();

            var mappedTopWorkers = topWorkers.Select(x => x.ToDto());

            return Results.Ok(topWorkers);
        }).WithName("TopWorkersForDepartment");
    }
}