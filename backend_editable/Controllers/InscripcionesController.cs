using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class InscripcionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InscripcionesController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Inscripciones
        // Body: { cursoId, estudianteId }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Inscripcion dto)
        {
            // Validar existencia
            var curso = await _context.Cursos.FindAsync(dto.CursoId);
            var estudiante = await _context.Estudiantes.FindAsync(dto.EstudianteId);
            if (curso == null || estudiante == null) return BadRequest("Curso o estudiante no válido");

            // Evitar duplicados
            var exists = await _context.Inscripciones.AnyAsync(i => i.CursoId == dto.CursoId && i.EstudianteId == dto.EstudianteId);
            if (exists) return Conflict("El estudiante ya está inscrito en este curso.");

            var ins = new Inscripcion { CursoId = dto.CursoId, EstudianteId = dto.EstudianteId };
            _context.Inscripciones.Add(ins);
            await _context.SaveChangesAsync();

            return Ok(new { ins.Id, ins.CursoId, ins.EstudianteId });
        }

        // DELETE: api/Inscripciones/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ins = await _context.Inscripciones.FindAsync(id);
            if (ins == null) return NotFound();

            _context.Inscripciones.Remove(ins);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/Inscripciones?cursoId=1
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? cursoId, [FromQuery] int? estudianteId)
        {
            var query = _context.Inscripciones.AsQueryable();
            if (cursoId.HasValue) query = query.Where(i => i.CursoId == cursoId.Value);
            if (estudianteId.HasValue) query = query.Where(i => i.EstudianteId == estudianteId.Value);

            var list = await query.Include(i => i.Estudiante).Include(i => i.Curso)
                .Select(i => new { i.Id, i.CursoId, CursoNombre = i.Curso!.Nombre, i.EstudianteId, EstudianteNombre = i.Estudiante!.Nombre })
                .ToListAsync();

            return Ok(list);
        }
    }
}
