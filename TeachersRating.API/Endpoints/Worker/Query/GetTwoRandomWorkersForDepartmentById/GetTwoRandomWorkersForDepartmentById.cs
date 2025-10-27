using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeachersRating.API.Data;
using TeachersRating.API.Extensions;
using TeachersRating.API.Interfaces;

namespace TeachersRating.API.Endpoints.Worker.Query.GetTwoRandomWorkersForDepartment;

public class GetTwoRandomWorkersForDepartmentById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/two-random-workers/{departmentId:guid}", async (Guid departmentId, [FromServices] AppDbContext context) =>
        {
            var workersRecordsCount = await context.Workers.Where(x => x.Departments.Any(x => x.Id.Equals(departmentId)))
                                                           .CountAsync();

            Random random = new Random();

            int firstOffset = random.Next(0, workersRecordsCount);
            int secondOffset = random.Next(0, workersRecordsCount);

            while (firstOffset == secondOffset)
            {
                secondOffset = random.Next(0, workersRecordsCount);
            }

            var firstWorker = await context.Workers.Include(p => p.Photo)
                                                    .Include(d => d.Departments)
                                                    .Where(x => x.Departments.Any(x => x.Id.Equals(departmentId)))
                                                    .Skip(firstOffset)
                                                    .FirstAsync();

            var secondWorker = await context.Workers.Include(p => p.Photo)
                                        .Include(d => d.Departments)
                                        .Where(x => x.Departments.Any(x => x.Id.Equals(departmentId)))
                                        .Skip(secondOffset)
                                        .FirstAsync();

            var workersArray = new[] { firstWorker, secondWorker };

            var mappedWorkersArray = workersArray.Select(w => w.ToDto());

            return Results.Ok(mappedWorkersArray);
        });
    }
}