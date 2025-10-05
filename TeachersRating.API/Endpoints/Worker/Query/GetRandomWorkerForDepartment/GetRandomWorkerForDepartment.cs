using Microsoft.EntityFrameworkCore;
using TeachersRating.API.Data;
using TeachersRating.API.Extensions;
using TeachersRating.API.Interfaces;

namespace TeachersRating.API.Endpoints.Worker.Query.GetRandomWorker;

public class GetRandomWorkerForDepartment : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("random-worker/{departmentId:guid}", async (Guid departmentId, AppDbContext context) =>
        {
            var workersRecordsCount = await context.Workers.Where(x => x.Departments.Any(x => x.Id.Equals(departmentId)))
                                                           .CountAsync();

            Random random = new Random();

            int offset = random.Next(0, workersRecordsCount);

            var randomWorker = await context.Workers.Include(p => p.Photo)
                                                    .Include(d => d.Departments)
                                                    .Where(x => x.Departments.Any(x => x.Id.Equals(departmentId)))
                                                    .Skip(offset)
                                                    .FirstAsync();

            return Results.Ok(randomWorker.ToDto());
        });
    }
}