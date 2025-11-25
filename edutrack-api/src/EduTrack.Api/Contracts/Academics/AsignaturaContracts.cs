using System.ComponentModel.DataAnnotations;

namespace EduTrack.Api.Contracts.Academics;

public sealed record AsignaturaDto(int Id, string Nombre, string Codigo);

public sealed record UpsertAsignaturaRequest
{
    [Required]
    [StringLength(150)]
    public string Nombre { get; init; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Codigo { get; init; } = string.Empty;
};
