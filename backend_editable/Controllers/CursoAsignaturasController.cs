using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> Get([FromQuery] int? cursoId)
        {
            var query = _context.CursoAsignaturas.AsQueryable();
            if (cursoId.HasValue) query = query.Where(ca => ca.CursoId == cursoId.Value);

            var list = await query.Include(ca => ca.Asignatura).Include(ca => ca.Docente)
                .Select(ca => new { ca.Id, ca.CursoId, ca.AsignaturaId, AsignaturaNombre = ca.Asignatura!.Nombre, ca.DocenteId, DocenteNombre = ca.Docente != null ? ca.Docente.Nombre : null })
                .ToListAsync();

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CursoAsignatura dto)
        {
            // Validations
            var curso = await _context.Cursos.FindAsync(dto.CursoId);
            var asign = await _context.Asignaturas.FindAsync(dto.AsignaturaId);
            if (curso == null || asign == null) return BadRequest("Curso o asignatura inválida");

            var exists = await _context.CursoAsignaturas.AnyAsync(ca => ca.CursoId == dto.CursoId && ca.AsignaturaId == dto.AsignaturaId);
            if (exists) return Conflict("Asignatura ya asignada al curso");

            var ca = new CursoAsignatura { CursoId = dto.CursoId, AsignaturaId = dto.AsignaturaId, DocenteId = dto.DocenteId };
            _context.CursoAsignaturas.Add(ca);
            await _context.SaveChangesAsync();
            return Ok(new { ca.Id, ca.CursoId, ca.AsignaturaId, ca.DocenteId });
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
