using System.ComponentModel.DataAnnotations;

namespace TeachersRating.API.Entities;

public class BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime DateCreated { get; set; }
    public DateTime DateModified { get; set; }
    public bool IsDeleted { get; set; } = false;
}