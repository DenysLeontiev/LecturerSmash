using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeachersRating.API.Data;
using TeachersRating.API.Entities;
using TeachersRating.API.Extensions;
using TeachersRating.API.Interfaces;

namespace TeachersRating.API.Endpoints.Worker.Command.LikeWorker;

public class LikeWorker : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("worker/{workerId:guid}/like", async (Guid workerId, [FromServices] AppDbContext context) =>
        {
            var worker = await context.Workers.Include(x => x.Photo)
                .FirstOrDefaultAsync(x => x.Id.Equals(workerId));

            worker!.NumberOfLikes++;

            await context.SaveChangesAsync();

            var mappedWorker = worker.ToDto();

            return Results.Ok(mappedWorker);
        });
    }
}