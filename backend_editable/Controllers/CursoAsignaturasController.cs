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

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var assignment = await _context.CursoAsignaturas
                .Include(ca => ca.Curso)
                    .ThenInclude(c => c.Grado)
                .Include(ca => ca.Docente)
                .Include(ca => ca.Asignatura)
                .FirstOrDefaultAsync(ca => ca.Id == id);

            if (assignment == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                assignment.Id,
                assignment.CursoId,
                CursoNombre = assignment.Curso?.Nombre,
                assignment.Curso?.Grupo,
                GradoId = assignment.Curso?.GradoId,
                GradoNombre = assignment.Curso?.Grado?.Nombre,
                assignment.AsignaturaId,
                AsignaturaNombre = assignment.Asignatura?.Nombre,
                AsignaturaCodigo = assignment.Asignatura?.Codigo,
                assignment.DocenteId,
                DocenteNombre = assignment.Docente != null ? $"{assignment.Docente.Nombre} {assignment.Docente.Apellido}".Trim() : null
            });
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? cursoId)
        {
            var query = _context.CursoAsignaturas.AsQueryable();
            if (cursoId.HasValue)
                query = query.Where(ca => ca.CursoId == cursoId.Value);

            var list = await query
                .Include(ca => ca.Asignatura)
                .Include(ca => ca.Docente)
                .Select(ca => new
                {
                    ca.Id,
                    ca.CursoId,
                    ca.AsignaturaId,
                    AsignaturaNombre = ca.Asignatura!.Nombre,
                    ca.DocenteId,
                    DocenteNombre = ca.Docente != null ? ca.Docente.Nombre : null
                })
                .ToListAsync();

            return Ok(list);
        }

        [HttpGet("docente/{docenteId:int}")]
        public async Task<IActionResult> GetByDocente(int docenteId)
        {
            var list = await _context.CursoAsignaturas
                .Where(ca => ca.DocenteId == docenteId)
                .Include(ca => ca.Asignatura)
                .Include(ca => ca.Curso).ThenInclude(c => c.Grado)
                .Select(ca => new
                {
                    ca.Id,
                    ca.CursoId,
                    ca.AsignaturaId,
                    AsignaturaNombre = ca.Asignatura != null ? ca.Asignatura.Nombre : string.Empty,
                    AsignaturaCodigo = ca.Asignatura != null ? ca.Asignatura.Codigo : null,
                    ca.DocenteId,
                    GradoId = ca.Curso != null ? ca.Curso.GradoId : (int?)null,
                    GradoNombre = ca.Curso != null && ca.Curso.Grado != null ? ca.Curso.Grado.Nombre : null,
                    Grupo = ca.Curso != null ? ca.Curso.Grupo : null,
                    CursoNombre = ca.Curso != null ? ca.Curso.Nombre : null
                })
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
