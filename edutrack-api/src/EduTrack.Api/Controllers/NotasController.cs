using EduTrack.Api.Contracts.Academics;
using EduTrack.Domain.Academics;
using EduTrack.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotasController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public NotasController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("curso/{cursoId:int}/config")]
    public async Task<ActionResult<IEnumerable<NotaConfigDto>>> GetConfig(int cursoId, CancellationToken cancellationToken)
    {
        var configs = await _dbContext.NotaConfigs
            .AsNoTracking()
            .Where(nc => nc.CursoId == cursoId)
            .OrderBy(nc => nc.Periodo)
            .ThenBy(nc => nc.Orden)
            .Select(nc => new NotaConfigDto(nc.Id, nc.CursoId, nc.Nombre, nc.Orden, nc.Peso, nc.Periodo))
            .ToListAsync(cancellationToken);

        return Ok(configs);
    }

    [HttpPost("curso/{cursoId:int}/config")]
    public async Task<ActionResult<NotaConfigDto>> CreateConfig(int cursoId, [FromBody] UpsertNotaConfigRequest request, CancellationToken cancellationToken)
    {
        if (await _dbContext.Cursos.FindAsync([cursoId], cancellationToken) is null)
        {
            return BadRequest("Curso no encontrado.");
        }

        var config = new NotaConfig
        {
            CursoId = cursoId,
            Nombre = request.Nombre,
            Orden = request.Orden,
            Peso = request.Peso,
            Periodo = request.Periodo
        };

        _dbContext.NotaConfigs.Add(config);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new NotaConfigDto(config.Id, config.CursoId, config.Nombre, config.Orden, config.Peso, config.Periodo));
    }

    [HttpPut("config/{id:int}")]
    public async Task<ActionResult<NotaConfigDto>> UpdateConfig(int id, [FromBody] UpsertNotaConfigRequest request, CancellationToken cancellationToken)
    {
        var config = await _dbContext.NotaConfigs.FindAsync([id], cancellationToken);
        if (config is null)
        {
            return NotFound("Configuración no encontrada.");
        }

        config.Nombre = request.Nombre;
        config.Orden = request.Orden;
        config.Peso = request.Peso;
        config.Periodo = request.Periodo;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new NotaConfigDto(config.Id, config.CursoId, config.Nombre, config.Orden, config.Peso, config.Periodo));
    }

    [HttpDelete("config/{id:int}")]
    public async Task<IActionResult> DeleteConfig(int id, CancellationToken cancellationToken)
    {
        var config = await _dbContext.NotaConfigs.FindAsync([id], cancellationToken);
        if (config is null)
        {
            return NotFound();
        }

        var notas = await _dbContext.Notas
            .Where(n => n.NotaConfigId == id)
            .ToListAsync(cancellationToken);
        _dbContext.Notas.RemoveRange(notas);

        _dbContext.NotaConfigs.Remove(config);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpGet("curso/{cursoId:int}")]
    public async Task<ActionResult<IEnumerable<EstudianteNotasDto>>> GetNotas(int cursoId, CancellationToken cancellationToken)
    {
        var estudiantes = await _dbContext.Inscripciones
            .Where(i => i.CursoId == cursoId)
            .Include(i => i.Estudiante)
            .Select(i => i.Estudiante!)
            .ToListAsync(cancellationToken);

        var configs = await _dbContext.NotaConfigs
            .Where(nc => nc.CursoId == cursoId)
            .OrderBy(nc => nc.Periodo)
            .ThenBy(nc => nc.Orden)
            .ToListAsync(cancellationToken);

        var estudianteIds = estudiantes.Select(e => e.Id).ToList();
        var notas = await _dbContext.Notas
            .Where(n => estudianteIds.Contains(n.EstudianteId))
            .ToListAsync(cancellationToken);

        var resultado = estudiantes.Select(estudiante =>
        {
            var notasEst = configs
                .Select(cfg =>
                {
                    var valor = notas.FirstOrDefault(n => n.EstudianteId == estudiante.Id && n.NotaConfigId == cfg.Id)?.Valor;
                    return new NotaEstudianteDto(cfg.Id, cfg.Nombre, cfg.Peso, valor);
                })
                .ToList();

            decimal? promedio = null;
            var notasConValor = notasEst.Where(n => n.Valor.HasValue).ToList();
            if (notasConValor.Any())
            {
                var sumaProductos = notasConValor.Sum(n => n.Valor!.Value * n.Peso);
                var sumaPesos = notasConValor.Sum(n => n.Peso);
                if (sumaPesos > 0)
                {
                    promedio = Math.Round(sumaProductos / sumaPesos, 2);
                }
            }

            return new EstudianteNotasDto(
                estudiante.Id,
                estudiante.Nombre,
                estudiante.Documento,
                notasEst,
                promedio);
        }).ToList();

        return Ok(resultado);
    }

    [HttpPut]
    public async Task<IActionResult> UpsertNota([FromBody] ActualizarNotaRequest request, CancellationToken cancellationToken)
    {
        var nota = await _dbContext.Notas
            .FirstOrDefaultAsync(n => n.EstudianteId == request.EstudianteId && n.NotaConfigId == request.NotaConfigId, cancellationToken);

        if (nota is null)
        {
            nota = new Nota
            {
                EstudianteId = request.EstudianteId,
                NotaConfigId = request.NotaConfigId,
                Valor = request.Valor
            };
            _dbContext.Notas.Add(nota);
        }
        else
        {
            nota.Valor = request.Valor;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok();
    }
}
