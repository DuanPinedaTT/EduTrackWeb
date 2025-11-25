using EduTrack.Api.Contracts.Academics;
using EduTrack.Domain.Academics;
using EduTrack.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GradosController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public GradosController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GradoDto>>> GetAll(CancellationToken cancellationToken)
    {
        var grados = await _dbContext.Grados
            .AsNoTracking()
            .Select(g => MapToDto(g))
            .ToListAsync(cancellationToken);

        return Ok(grados);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GradoDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var grado = await _dbContext.Grados
            .AsNoTracking()
            .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);

        if (grado is null)
        {
            return NotFound();
        }

        return Ok(MapToDto(grado));
    }

    [HttpPost]
    public async Task<ActionResult<GradoDto>> Create([FromBody] UpsertGradoRequest request, CancellationToken cancellationToken)
    {
        var grado = new Grado
        {
            Nombre = request.Nombre,
            Codigo = request.Codigo,
            Grupos = SerializeGroups(request.Grupos)
        };

        _dbContext.Grados.Add(grado);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(MapToDto(grado));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<GradoDto>> Update(int id, [FromBody] UpsertGradoRequest request, CancellationToken cancellationToken)
    {
        var grado = await _dbContext.Grados.FindAsync([id], cancellationToken);
        if (grado is null)
        {
            return NotFound();
        }

        grado.Nombre = request.Nombre;
        grado.Codigo = request.Codigo;
        grado.Grupos = SerializeGroups(request.Grupos);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(MapToDto(grado));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var grado = await _dbContext.Grados.FindAsync([id], cancellationToken);
        if (grado is null)
        {
            return NotFound();
        }

        _dbContext.Grados.Remove(grado);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private static GradoDto MapToDto(Grado grado)
    {
        var grupos = string.IsNullOrWhiteSpace(grado.Grupos)
            ? Array.Empty<string>()
            : grado.Grupos
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        return new GradoDto(grado.Id, grado.Nombre, grado.Codigo, grupos);
    }

    private static string SerializeGroups(IReadOnlyCollection<string>? grupos)
    {
        if (grupos is null || grupos.Count == 0)
        {
            return string.Empty;
        }

        return string.Join(',', grupos.Where(g => !string.IsNullOrWhiteSpace(g)).Select(g => g.Trim()));
    }
}
