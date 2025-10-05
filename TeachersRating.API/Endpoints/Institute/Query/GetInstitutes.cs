using Microsoft.EntityFrameworkCore;
using TeachersRating.API.Data;
using TeachersRating.API.Extensions;
using TeachersRating.API.Interfaces;

namespace TeachersRating.API.Endpoints.Institute.Query;

public class GetInstitutes : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/institutes", async (AppDbContext context) =>
        {
            var institutes = await context.Institutes.AsNoTracking()
                .ToListAsync();

            var mappedInstitutes = institutes.Select(i => i.ToDto()).ToList();

            return Results.Ok(mappedInstitutes);
        }).WithName("GetInstitutes");
    }
}