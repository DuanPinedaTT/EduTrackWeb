using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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
        public async Task<IActionResult> Get([FromQuery] int? profesorId, [FromQuery] int? estudianteId, [FromQuery] int? cursoAsignaturaId, [FromQuery] int? cursoId, [FromQuery] bool? leida)
        {
            var query = _context.Notificaciones.AsQueryable();

            if (profesorId.HasValue) query = query.Where(n => n.ProfesorId == profesorId.Value);
            if (estudianteId.HasValue) query = query.Where(n => n.EstudianteId == estudianteId.Value);
            if (cursoAsignaturaId.HasValue) query = query.Where(n => n.CursoAsignaturaId == cursoAsignaturaId.Value);
            if (cursoId.HasValue) query = query.Where(n => n.CursoAsignatura != null && n.CursoAsignatura.CursoId == cursoId.Value);
            if (leida.HasValue) query = query.Where(n => n.Leida == leida.Value);

            var resultado = await query
                .OrderByDescending(n => n.FechaEnvio)
                .Select(n => new
                {
                    n.Id,
                    n.ProfesorId,
                    n.CursoAsignaturaId,
                    CursoId = n.CursoAsignatura != null ? (int?)n.CursoAsignatura.CursoId : null,
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

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] Notificacion dto)
        {
            var notificacion = await _context.Notificaciones.FindAsync(id);
            if (notificacion == null) return NotFound();

            notificacion.Titulo = dto.Titulo;
            notificacion.Mensaje = dto.Mensaje;
            notificacion.Tipo = dto.Tipo;
            notificacion.CursoAsignaturaId = dto.CursoAsignaturaId;
            notificacion.EstudianteId = dto.EstudianteId;
            notificacion.ProfesorId = dto.ProfesorId;
            notificacion.Leida = dto.Leida;

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
