using System.ComponentModel.DataAnnotations;

namespace EduTrack.Api.Contracts.Academics;

public sealed record EstudianteDto(int Id, string Nombre, string Documento);

public sealed record UpsertEstudianteRequest
{
    [Required]
    [StringLength(150)]
    public string Nombre { get; init; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Documento { get; init; } = string.Empty;
};
