using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.Json.Serialization;
using TeachersRating.API.Data;
using TeachersRating.API.Extensions;
using TeachersRating.API.Seed;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.RegisterDbContext(builder.Configuration);

builder.Services.AddEndpoints(typeof(Program).Assembly);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient",
        policy =>
        {
            policy.WithOrigins(builder.Configuration["ClientUrl"]!)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

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



app.UseCors("AllowAngularClient");

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

RouteGroupBuilder apiPrefixGroup = app.MapGroup("api");

app.MapEndpoints(apiPrefixGroup);

app.Run();