using Microsoft.EntityFrameworkCore;
using TeachersRating.API.Entities;

namespace TeachersRating.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Department> Departments { get; set; }
    public DbSet<Institute> Institutes { get; set; }
    public DbSet<Worker> Workers { get; set; }
    public DbSet<Photo> Photos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Worker>()
            .HasOne(w => w.Photo)
            .WithOne(p => p.Worker)
            .HasForeignKey<Worker>(w => w.PhotoId);

        base.OnModelCreating(modelBuilder);
    }

    public override int SaveChanges()
    {
        UpdateBaseEntityCommonDateTimeFields();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateBaseEntityCommonDateTimeFields();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateBaseEntityCommonDateTimeFields()
    {
        DateTime now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.DateCreated = now;
                entry.Entity.DateModified = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.DateModified = now;
            }
        }
    }
}