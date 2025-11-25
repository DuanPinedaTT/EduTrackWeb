using System.ComponentModel.DataAnnotations;

namespace EduTrack.Api.Contracts.Academics;

public sealed record NotaConfigDto(int Id, int CursoId, string Nombre, int Orden, decimal Peso, int Periodo);

public sealed record UpsertNotaConfigRequest
{
    [Required]
    [StringLength(150)]
    public string Nombre { get; init; } = string.Empty;

    [Range(1, 100)]
    public int Orden { get; init; } = 1;

    [Range(0, 100)]
    public decimal Peso { get; init; }

    [Range(1, 4)]
    public int Periodo { get; init; } = 1;
};

public sealed record NotaEstudianteDto(int NotaConfigId, string Nombre, decimal Peso, decimal? Valor);

public sealed record EstudianteNotasDto(int Id, string Nombre, string Documento, IReadOnlyCollection<NotaEstudianteDto> Notas, decimal? Promedio);

public sealed record ActualizarNotaRequest
{
    [Required]
    public int EstudianteId { get; init; }

    [Required]
    public int NotaConfigId { get; init; }

    public decimal? Valor { get; init; }
};
