using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsistenciasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AsistenciasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? cursoAsignaturaId, [FromQuery] int? estudianteId, [FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
        {
            var query = _context.Asistencias
                .Include(a => a.Estudiante)
                .Include(a => a.CursoAsignatura)
                .AsQueryable();

            if (cursoAsignaturaId.HasValue)
            {
                query = query.Where(a => a.CursoAsignaturaId == cursoAsignaturaId.Value);
            }

            if (estudianteId.HasValue)
            {
                query = query.Where(a => a.EstudianteId == estudianteId.Value);
            }

            if (desde.HasValue)
            {
                query = query.Where(a => a.Fecha >= desde.Value);
            }

            if (hasta.HasValue)
            {
                query = query.Where(a => a.Fecha <= hasta.Value);
            }

            var asistencias = await query
                .OrderByDescending(a => a.Fecha)
                .Select(a => new
                {
                    a.Id,
                    a.EstudianteId,
                    Estudiante = a.Estudiante != null ? string.Concat(a.Estudiante.Nombre, " ", a.Estudiante.Apellido) : string.Empty,
                    a.CursoAsignaturaId,
                    a.Fecha,
                    a.Estado,
                    a.Observacion
                })
                .ToListAsync();

            return Ok(asistencias);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Asistencia asistencia)
        {
            var existe = await _context.Asistencias.AnyAsync(a => a.EstudianteId == asistencia.EstudianteId && a.CursoAsignaturaId == asistencia.CursoAsignaturaId && a.Fecha.Date == asistencia.Fecha.Date);
            if (existe) return Conflict("Ya existe un registro de asistencia para ese día");

            _context.Asistencias.Add(asistencia);
            await _context.SaveChangesAsync();
            return Ok(asistencia);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] Asistencia dto)
        {
            var asistencia = await _context.Asistencias.FindAsync(id);
            if (asistencia == null) return NotFound();

            asistencia.Estado = dto.Estado;
            asistencia.Observacion = dto.Observacion;
            asistencia.Fecha = dto.Fecha;

            await _context.SaveChangesAsync();
            return Ok(asistencia);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var asistencia = await _context.Asistencias.FindAsync(id);
            if (asistencia == null) return NotFound();

            _context.Asistencias.Remove(asistencia);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
