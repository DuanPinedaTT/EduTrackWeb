using EduTrack.Api.Contracts.Academics;
using EduTrack.Domain.Academics;
using EduTrack.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CursosController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public CursosController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CursoDto>>> GetAll(CancellationToken cancellationToken)
    {
        var cursos = await _dbContext.Cursos
            .AsNoTracking()
            .Include(c => c.Grado)
            .Include(c => c.Docente)
            .Select(c => MapToDto(c))
            .ToListAsync(cancellationToken);

        return Ok(cursos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CursoDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var curso = await _dbContext.Cursos
            .AsNoTracking()
            .Include(c => c.Grado)
            .Include(c => c.Docente)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        if (curso is null)
        {
            return NotFound();
        }

        return Ok(MapToDto(curso));
    }

    [HttpPost]
    public async Task<ActionResult<CursoDto>> Create([FromBody] UpsertCursoRequest request, CancellationToken cancellationToken)
    {
        var curso = new Curso
        {
            Nombre = request.Nombre,
            Grupo = request.Grupo?.Trim() ?? string.Empty,
            GradoId = request.GradoId,
            DocenteId = request.DocenteId
        };

        _dbContext.Cursos.Add(curso);
        await _dbContext.SaveChangesAsync(cancellationToken);

        await _dbContext.Entry(curso).Reference(c => c.Grado).LoadAsync(cancellationToken);
        await _dbContext.Entry(curso).Reference(c => c.Docente).LoadAsync(cancellationToken);

        return Ok(MapToDto(curso));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CursoDto>> Update(int id, [FromBody] UpsertCursoRequest request, CancellationToken cancellationToken)
    {
        var curso = await _dbContext.Cursos.FindAsync([id], cancellationToken);
        if (curso is null)
        {
            return NotFound();
        }

        curso.Nombre = request.Nombre;
        curso.Grupo = request.Grupo?.Trim() ?? string.Empty;
        curso.GradoId = request.GradoId;
        curso.DocenteId = request.DocenteId;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _dbContext.Entry(curso).Reference(c => c.Grado).LoadAsync(cancellationToken);
        await _dbContext.Entry(curso).Reference(c => c.Docente).LoadAsync(cancellationToken);

        return Ok(MapToDto(curso));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var curso = await _dbContext.Cursos.FindAsync([id], cancellationToken);
        if (curso is null)
        {
            return NotFound();
        }

        _dbContext.Cursos.Remove(curso);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpGet("{id:int}/students")]
    public async Task<ActionResult<IEnumerable<EstudianteDto>>> GetStudents(int id, CancellationToken cancellationToken)
    {
        var estudiantes = await _dbContext.Inscripciones
            .AsNoTracking()
            .Where(i => i.CursoId == id)
            .Include(i => i.Estudiante)
            .Select(i => i.Estudiante!)
            .Select(e => new EstudianteDto(e.Id, e.Nombre, e.Documento))
            .ToListAsync(cancellationToken);

        return Ok(estudiantes);
    }

    private static CursoDto MapToDto(Curso curso)
    {
        var docenteNombre = curso.Docente is null ? null : curso.Docente.FullName;
        return new CursoDto(
            curso.Id,
            curso.Nombre,
            curso.Grupo,
            curso.GradoId,
            curso.Grado?.Nombre,
            curso.Grado?.Codigo,
            curso.DocenteId,
            docenteNombre);
    }
}
