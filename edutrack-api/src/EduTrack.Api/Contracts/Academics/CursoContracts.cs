using System.ComponentModel.DataAnnotations;

namespace EduTrack.Api.Contracts.Academics;

public sealed record CursoDto(
    int Id,
    string Nombre,
    string Grupo,
    int? GradoId,
    string? GradoNombre,
    string? GradoCodigo,
    Guid? DocenteId,
    string? DocenteNombre);

public sealed record UpsertCursoRequest
{
    [Required]
    [StringLength(150)]
    public string Nombre { get; init; } = string.Empty;

    [StringLength(50)]
    public string? Grupo { get; init; }

    public int? GradoId { get; init; }

    public Guid? DocenteId { get; init; }
};
