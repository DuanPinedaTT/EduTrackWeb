using System.ComponentModel.DataAnnotations;

namespace EduTrack.Api.Contracts.Academics;

public sealed record GradoDto(int Id, string Nombre, string Codigo, IReadOnlyCollection<string> Grupos);

public sealed record UpsertGradoRequest
{
    [Required]
    [StringLength(150)]
    public string Nombre { get; init; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Codigo { get; init; } = string.Empty;

    public IReadOnlyCollection<string>? Grupos { get; init; }
};
