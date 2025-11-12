
using System.Reflection;
using System.Reflection.Metadata;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection.Extensions;
using TeachersRating.API.Data;
using TeachersRating.API.Interfaces;
using TeachersRating.API.Services;

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

    public static IServiceCollection AddEndpoints(this IServiceCollection services, Assembly assembly)
    {
        ServiceDescriptor[] serviceDescriptors = assembly
            .DefinedTypes
            .Where(type => type is { IsAbstract: false, IsInterface: false } &&
                           type.IsAssignableTo(typeof(IEndpoint)))
            .Select(type => ServiceDescriptor.Transient(typeof(IEndpoint), type))
            .ToArray();

        services.TryAddEnumerable(serviceDescriptors);

        return services;
    }

    public static IServiceCollection RegisterServices(this IServiceCollection services)
    {
        services.AddSingleton<IPresenceTrackerService, PresenceTrackerService>();

        return services;
    }
}