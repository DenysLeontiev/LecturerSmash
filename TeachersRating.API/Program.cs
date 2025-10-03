using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using TeachersRating.API.Data;
using TeachersRating.API.Extensions;
using TeachersRating.API.Seed;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.RegisterDbContext(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
        // DataBaseSeeded.SeedDataAsync(context).Wait();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during migration or seeding.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.MapGet("api/institutes", async (AppDbContext context) =>
{
    var institutes = await context.Institutes.AsNoTracking()
        .ToListAsync();

    var mappedInstitutes = institutes.Select(i => i.ToDto()).ToList();

    return Results.Ok(mappedInstitutes);
}).WithName("GetInstitutes");

app.MapGet("api/departments/{intstituteId:guid}", async (Guid intstituteId, AppDbContext context) =>
{
    var departments = await context.Departments.Where(x => x.InstituteId.Equals(intstituteId))
        .AsNoTracking()
        .ToListAsync();

    var mappedDepartments = departments.Select(d => d.ToDto()).ToList();

    return Results.Ok(mappedDepartments);
}).WithName("GetDepartmentsForInstitute");

app.MapGet("api/workers/{departmentId:guid}", async (Guid departmentId, AppDbContext context) =>
{
    var workers = await context.Workers.Where(w => w.Departments.Any(d => d.Id == departmentId))
        .Include(w => w.Photo)
        .AsNoTracking()
        .ToListAsync();

    var mappedWorkers = workers.Select(w => w.ToDto()).ToList();

    return Results.Ok(mappedWorkers);
}).WithName("GetWorkersForDepartment");

app.Run();