using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObservacionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ObservacionesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? estudianteId, [FromQuery] int? profesorId)
        {
            var query = _context.Observaciones
                .Include(o => o.Estudiante)
                .Include(o => o.Profesor).ThenInclude(p => p!.Usuario)
                .AsQueryable();

            if (estudianteId.HasValue)
            {
                query = query.Where(o => o.EstudianteId == estudianteId.Value);
            }

            if (profesorId.HasValue)
            {
                query = query.Where(o => o.ProfesorId == profesorId.Value);
            }

            var observaciones = await query
                .OrderByDescending(o => o.Fecha)
                .Select(o => new
                {
                    o.Id,
                    o.EstudianteId,
                    Estudiante = o.Estudiante != null ? string.Concat(o.Estudiante.Nombre, " ", o.Estudiante.Apellido) : string.Empty,
                    o.ProfesorId,
                    Profesor = o.Profesor != null && o.Profesor.Usuario != null ? string.Concat(o.Profesor.Usuario.Nombre, " ", o.Profesor.Usuario.Apellido) : string.Empty,
                    o.CursoAsignaturaId,
                    o.Tipo,
                    o.Comentario,
                    o.Fecha
                })
                .ToListAsync();

            return Ok(observaciones);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Observacion observacion)
        {
            observacion.Fecha = DateTime.UtcNow;
            _context.Observaciones.Add(observacion);
            await _context.SaveChangesAsync();
            return Ok(observacion);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var observacion = await _context.Observaciones.FindAsync(id);
            if (observacion == null) return NotFound();

            _context.Observaciones.Remove(observacion);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
