
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TeachersRating.API.Data;

namespace TeachersRating.API.Extensions;

public static class ServicesExtentions
{
    public static IServiceCollection RegisterDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>((options) =>
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException("DataBase Connection String is null");

            options.UseSqlite(connectionString);
        });

        return services;
    }
}