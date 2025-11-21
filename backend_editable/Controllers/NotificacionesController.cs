using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificacionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificacionesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? profesorId, [FromQuery] int? estudianteId, [FromQuery] int? cursoAsignaturaId, [FromQuery] bool? leida)
        {
            var query = _context.Notificaciones.AsQueryable();

            if (profesorId.HasValue) query = query.Where(n => n.ProfesorId == profesorId.Value);
            if (estudianteId.HasValue) query = query.Where(n => n.EstudianteId == estudianteId.Value);
            if (cursoAsignaturaId.HasValue) query = query.Where(n => n.CursoAsignaturaId == cursoAsignaturaId.Value);
            if (leida.HasValue) query = query.Where(n => n.Leida == leida.Value);

            var resultado = await query
                .OrderByDescending(n => n.FechaEnvio)
                .Select(n => new
                {
                    n.Id,
                    n.ProfesorId,
                    n.CursoAsignaturaId,
                    n.EstudianteId,
                    n.Titulo,
                    n.Mensaje,
                    n.Tipo,
                    n.FechaEnvio,
                    n.Leida
                })
                .ToListAsync();

            return Ok(resultado);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Notificacion notificacion)
        {
            notificacion.FechaEnvio = DateTime.UtcNow;
            _context.Notificaciones.Add(notificacion);
            await _context.SaveChangesAsync();
            return Ok(notificacion);
        }

        [HttpPut("{id:int}/leer")]
        public async Task<IActionResult> MarcarComoLeida(int id)
        {
            var notificacion = await _context.Notificaciones.FindAsync(id);
            if (notificacion == null) return NotFound();

            notificacion.Leida = true;
            await _context.SaveChangesAsync();
            return Ok(notificacion);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var notificacion = await _context.Notificaciones.FindAsync(id);
            if (notificacion == null) return NotFound();

            _context.Notificaciones.Remove(notificacion);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
