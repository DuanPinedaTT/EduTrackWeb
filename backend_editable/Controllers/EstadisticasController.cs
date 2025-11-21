using edutrack_academy_api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstadisticasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EstadisticasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetEstadisticas()
        {
            try
            {
                var totalDocentes = await _context.Usuarios
                    .Where(u => u.Rol == "docente")
                    .CountAsync();

                var totalCursos = await _context.Cursos.CountAsync();

                var totalEstudiantes = await _context.Estudiantes.CountAsync();

                return Ok(new
                {
                    totalDocentes,
                    totalCursos,
                    totalEstudiantes
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error obteniendo estadísticas: {ex.Message}");
            }
        }
    }
}
