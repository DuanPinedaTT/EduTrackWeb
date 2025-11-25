using System.ComponentModel.DataAnnotations;

namespace EduTrack.Api.Contracts.Academics;

public sealed record CursoAsignaturaDto(int Id, int CursoId, int AsignaturaId, string AsignaturaNombre, Guid? DocenteId, string? DocenteNombre);

public sealed record UpsertCursoAsignaturaRequest
{
    [Required]
    public int CursoId { get; init; }

    [Required]
    public int AsignaturaId { get; init; }

    public Guid? DocenteId { get; init; }
};
