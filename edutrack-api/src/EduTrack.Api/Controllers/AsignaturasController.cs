using EduTrack.Api.Contracts.Academics;
using EduTrack.Domain.Academics;
using EduTrack.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AsignaturasController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public AsignaturasController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AsignaturaDto>>> GetAll(CancellationToken cancellationToken)
    {
        var asignaturas = await _dbContext.Asignaturas
            .AsNoTracking()
            .Select(a => new AsignaturaDto(a.Id, a.Nombre, a.Codigo))
            .ToListAsync(cancellationToken);

        return Ok(asignaturas);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AsignaturaDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var asignatura = await _dbContext.Asignaturas
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

        if (asignatura is null)
        {
            return NotFound();
        }

        return Ok(new AsignaturaDto(asignatura.Id, asignatura.Nombre, asignatura.Codigo));
    }

    [HttpPost]
    public async Task<ActionResult<AsignaturaDto>> Create([FromBody] UpsertAsignaturaRequest request, CancellationToken cancellationToken)
    {
        var asignatura = new Asignatura
        {
            Nombre = request.Nombre,
            Codigo = request.Codigo
        };

        _dbContext.Asignaturas.Add(asignatura);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new AsignaturaDto(asignatura.Id, asignatura.Nombre, asignatura.Codigo));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AsignaturaDto>> Update(int id, [FromBody] UpsertAsignaturaRequest request, CancellationToken cancellationToken)
    {
        var asignatura = await _dbContext.Asignaturas.FindAsync([id], cancellationToken);
        if (asignatura is null)
        {
            return NotFound();
        }

        asignatura.Nombre = request.Nombre;
        asignatura.Codigo = request.Codigo;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new AsignaturaDto(asignatura.Id, asignatura.Nombre, asignatura.Codigo));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var asignatura = await _dbContext.Asignaturas.FindAsync([id], cancellationToken);
        if (asignatura is null)
        {
            return NotFound();
        }

        _dbContext.Asignaturas.Remove(asignatura);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
