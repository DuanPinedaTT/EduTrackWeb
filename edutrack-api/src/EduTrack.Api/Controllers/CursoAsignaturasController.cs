using EduTrack.Api.Contracts.Academics;
using EduTrack.Domain.Academics;
using EduTrack.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CursoAsignaturasController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public CursoAsignaturasController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CursoAsignaturaDto>>> Get([FromQuery] int? cursoId, CancellationToken cancellationToken)
    {
        var query = _dbContext.CursoAsignaturas
            .AsNoTracking()
            .Include(ca => ca.Asignatura)
            .Include(ca => ca.Docente)
            .AsQueryable();

        if (cursoId.HasValue)
        {
            query = query.Where(ca => ca.CursoId == cursoId.Value);
        }

        var list = await query
            .Select(ca => new CursoAsignaturaDto(
                ca.Id,
                ca.CursoId,
                ca.AsignaturaId,
                ca.Asignatura!.Nombre,
                ca.DocenteId,
                ca.Docente != null ? ca.Docente.FullName : null))
            .ToListAsync(cancellationToken);

        return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<CursoAsignaturaDto>> Create([FromBody] UpsertCursoAsignaturaRequest request, CancellationToken cancellationToken)
    {
        var curso = await _dbContext.Cursos.FindAsync([request.CursoId], cancellationToken);
        var asignatura = await _dbContext.Asignaturas.FindAsync([request.AsignaturaId], cancellationToken);
        if (curso is null || asignatura is null)
        {
            return BadRequest("Curso o asignatura inválida.");
        }

        var exists = await _dbContext.CursoAsignaturas
            .AnyAsync(ca => ca.CursoId == request.CursoId && ca.AsignaturaId == request.AsignaturaId, cancellationToken);
        if (exists)
        {
            return Conflict("La asignatura ya está vinculada al curso.");
        }

        var cursoAsignatura = new CursoAsignatura
        {
            CursoId = request.CursoId,
            AsignaturaId = request.AsignaturaId,
            DocenteId = request.DocenteId
        };

        _dbContext.CursoAsignaturas.Add(cursoAsignatura);
        await _dbContext.SaveChangesAsync(cancellationToken);

        await _dbContext.Entry(cursoAsignatura).Reference(ca => ca.Docente).LoadAsync(cancellationToken);

        return Ok(new CursoAsignaturaDto(
            cursoAsignatura.Id,
            cursoAsignatura.CursoId,
            cursoAsignatura.AsignaturaId,
            asignatura.Nombre,
            cursoAsignatura.DocenteId,
            cursoAsignatura.Docente?.FullName));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var cursoAsignatura = await _dbContext.CursoAsignaturas.FindAsync([id], cancellationToken);
        if (cursoAsignatura is null)
        {
            return NotFound();
        }

        _dbContext.CursoAsignaturas.Remove(cursoAsignatura);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
