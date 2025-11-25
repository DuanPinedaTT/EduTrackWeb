using EduTrack.Api.Contracts.Academics;
using EduTrack.Domain.Academics;
using EduTrack.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstudiantesController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public EstudiantesController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EstudianteDto>>> GetAll(CancellationToken cancellationToken)
    {
        var estudiantes = await _dbContext.Estudiantes
            .AsNoTracking()
            .Select(e => new EstudianteDto(e.Id, e.Nombre, e.Documento))
            .ToListAsync(cancellationToken);

        return Ok(estudiantes);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EstudianteDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var estudiante = await _dbContext.Estudiantes
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

        if (estudiante is null)
        {
            return NotFound();
        }

        return Ok(new EstudianteDto(estudiante.Id, estudiante.Nombre, estudiante.Documento));
    }

    [HttpPost]
    public async Task<ActionResult<EstudianteDto>> Create([FromBody] UpsertEstudianteRequest request, CancellationToken cancellationToken)
    {
        if (await _dbContext.Estudiantes.AnyAsync(e => e.Documento == request.Documento, cancellationToken))
        {
            return Conflict("Ya existe un estudiante con este documento.");
        }

        var estudiante = new Estudiante
        {
            Nombre = request.Nombre,
            Documento = request.Documento
        };

        _dbContext.Estudiantes.Add(estudiante);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new EstudianteDto(estudiante.Id, estudiante.Nombre, estudiante.Documento));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<EstudianteDto>> Update(int id, [FromBody] UpsertEstudianteRequest request, CancellationToken cancellationToken)
    {
        var estudiante = await _dbContext.Estudiantes.FindAsync([id], cancellationToken);
        if (estudiante is null)
        {
            return NotFound();
        }

        var documentoEnUso = await _dbContext.Estudiantes
            .AnyAsync(e => e.Id != id && e.Documento == request.Documento, cancellationToken);
        if (documentoEnUso)
        {
            return Conflict("Ya existe un estudiante con este documento.");
        }

        estudiante.Nombre = request.Nombre;
        estudiante.Documento = request.Documento;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new EstudianteDto(estudiante.Id, estudiante.Nombre, estudiante.Documento));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var estudiante = await _dbContext.Estudiantes.FindAsync([id], cancellationToken);
        if (estudiante is null)
        {
            return NotFound();
        }

        _dbContext.Estudiantes.Remove(estudiante);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
