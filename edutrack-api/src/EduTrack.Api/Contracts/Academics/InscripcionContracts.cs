using System.ComponentModel.DataAnnotations;

namespace EduTrack.Api.Contracts.Academics;

public sealed record InscripcionDto(int Id, int CursoId, string CursoNombre, int EstudianteId, string EstudianteNombre);

public sealed record CreateInscripcionRequest
{
    [Required]
    public int CursoId { get; init; }

    [Required]
    public int EstudianteId { get; init; }
};
