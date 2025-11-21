using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CursoAsignaturasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CursoAsignaturasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? cursoId, [FromQuery] int? profesorId)
        {
            var query = _context.CursoAsignaturas.AsQueryable();
            if (cursoId.HasValue) query = query.Where(ca => ca.CursoId == cursoId.Value);
            if (profesorId.HasValue) query = query.Where(ca => ca.ProfesorId == profesorId.Value);

            var entities = await query
                .Include(ca => ca.Curso).ThenInclude(c => c.Grado)
                .Include(ca => ca.Asignatura)
                .Include(ca => ca.Profesor).ThenInclude(p => p!.Usuario)
                .ToListAsync();

            var list = entities
                .Select(ca => new
                {
                    ca.Id,
                    ca.CursoId,
                    CursoNombre = ca.Curso != null ? ca.Curso.Nombre : string.Empty,
                    GradoId = ca.Curso?.GradoId,
                    GradoNombre = ca.Curso?.Grado != null ? ca.Curso.Grado.Nombre : null,
                    ca.AsignaturaId,
                    AsignaturaNombre = ca.Asignatura != null ? ca.Asignatura.Nombre : string.Empty,
                    ca.ProfesorId,
                    ProfesorNombre = ca.Profesor != null && ca.Profesor.Usuario != null
                        ? string.Concat(ca.Profesor.Usuario.Nombre, " ", ca.Profesor.Usuario.Apellido)
                        : null
                })
                .ToList();

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CursoAsignatura dto)
        {
            // Validations
            var curso = await _context.Cursos.FindAsync(dto.CursoId);
            var asign = await _context.Asignaturas.FindAsync(dto.AsignaturaId);
            if (curso == null || asign == null) return BadRequest("Curso o asignatura inválida");

            if (dto.ProfesorId.HasValue)
            {
                var profesorExiste = await _context.Profesores.AnyAsync(p => p.Id == dto.ProfesorId.Value);
                if (!profesorExiste) return BadRequest("Profesor no encontrado");
            }

            var exists = await _context.CursoAsignaturas.AnyAsync(ca => ca.CursoId == dto.CursoId && ca.AsignaturaId == dto.AsignaturaId);
            if (exists) return Conflict("Asignatura ya asignada al curso");

            var ca = new CursoAsignatura { CursoId = dto.CursoId, AsignaturaId = dto.AsignaturaId, ProfesorId = dto.ProfesorId };
            _context.CursoAsignaturas.Add(ca);
            await _context.SaveChangesAsync();
            return Ok(new { ca.Id, ca.CursoId, ca.AsignaturaId, ca.ProfesorId });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ca = await _context.CursoAsignaturas.FindAsync(id);
            if (ca == null) return NotFound();
            _context.CursoAsignaturas.Remove(ca);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
