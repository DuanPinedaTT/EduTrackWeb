using EduTrack.Api.Contracts.Academics;
using EduTrack.Domain.Academics;
using EduTrack.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InscripcionesController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public InscripcionesController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InscripcionDto>>> Get([FromQuery] int? cursoId, [FromQuery] int? estudianteId, CancellationToken cancellationToken)
    {
        var query = _dbContext.Inscripciones
            .AsNoTracking()
            .Include(i => i.Curso)
            .Include(i => i.Estudiante)
            .AsQueryable();

        if (cursoId.HasValue)
        {
            query = query.Where(i => i.CursoId == cursoId.Value);
        }

        if (estudianteId.HasValue)
        {
            query = query.Where(i => i.EstudianteId == estudianteId.Value);
        }

        var list = await query
            .Select(i => new InscripcionDto(
                i.Id,
                i.CursoId,
                i.Curso!.Nombre,
                i.EstudianteId,
                i.Estudiante!.Nombre))
            .ToListAsync(cancellationToken);

        return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<InscripcionDto>> Create([FromBody] CreateInscripcionRequest request, CancellationToken cancellationToken)
    {
        var curso = await _dbContext.Cursos.FindAsync([request.CursoId], cancellationToken);
        var estudiante = await _dbContext.Estudiantes.FindAsync([request.EstudianteId], cancellationToken);

        if (curso is null || estudiante is null)
        {
            return BadRequest("Curso o estudiante no válido.");
        }

        var exists = await _dbContext.Inscripciones
            .AnyAsync(i => i.CursoId == request.CursoId && i.EstudianteId == request.EstudianteId, cancellationToken);
        if (exists)
        {
            return Conflict("El estudiante ya está inscrito en este curso.");
        }

        var inscripcion = new Inscripcion
        {
            CursoId = request.CursoId,
            EstudianteId = request.EstudianteId
        };

        _dbContext.Inscripciones.Add(inscripcion);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new InscripcionDto(inscripcion.Id, curso.Id, curso.Nombre, estudiante.Id, estudiante.Nombre));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var inscripcion = await _dbContext.Inscripciones.FindAsync([id], cancellationToken);
        if (inscripcion is null)
        {
            return NotFound();
        }

        _dbContext.Inscripciones.Remove(inscripcion);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
