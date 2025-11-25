using EduTrack.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstadisticasController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public EstadisticasController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var totalDocentesTask = _dbContext.Users.CountAsync(u => u.Role == "docente", cancellationToken);
        var totalCursosTask = _dbContext.Cursos.CountAsync(cancellationToken);
        var totalEstudiantesTask = _dbContext.Estudiantes.CountAsync(cancellationToken);

        await Task.WhenAll(totalDocentesTask, totalCursosTask, totalEstudiantesTask);

        return Ok(new
        {
            totalDocentes = totalDocentesTask.Result,
            totalCursos = totalCursosTask.Result,
            totalEstudiantes = totalEstudiantesTask.Result
        });
    }
}
