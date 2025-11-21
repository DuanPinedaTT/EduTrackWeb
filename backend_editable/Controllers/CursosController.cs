using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CursosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CursosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Cursos
        //[Authorize] // admin o docente
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetCursos()
        {
            var cursos = await _context.Cursos
                .Include(c => c.Profesor)
                .Include(c => c.Grado)
                .Select(c => new
                {
                    c.Id,
                    c.Nombre,
                    c.Grupo,
                    GradoId = c.GradoId,
                    GradoNombre = c.Grado != null ? c.Grado.Nombre : null,
                    GradoCodigo = c.Grado != null ? c.Grado.Codigo : null,
                    ProfesorId = c.ProfesorId,
                    ProfesorNombre = c.Profesor != null
                        ? (c.Profesor.Usuario != null
                            ? string.Concat(c.Profesor.Usuario.Nombre, " ", c.Profesor.Usuario.Apellido)
                            : c.Profesor.Especialidad)
                        : null
                })
                .ToListAsync();

            return Ok(cursos);
        }

        // POST: api/Cursos
        //[Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CrearCurso(CursoDTO dto)
        {
            var curso = new Curso
            {
                Nombre = dto.Nombre,
                GradoId = dto.GradoId,
                Grupo = dto.Grupo ?? string.Empty,
                ProfesorId = dto.ProfesorId
            };

            _context.Cursos.Add(curso);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                curso.Id,
                curso.Nombre,
                curso.Grupo,
                GradoId = curso.GradoId,
                curso.ProfesorId
            });
        }

        // PUT: api/Cursos/5
        //[Authorize(Roles = "admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> ActualizarCurso(int id, CursoDTO dto)
        {
            var curso = await _context.Cursos.FindAsync(id);
            if (curso == null)
                return NotFound("Curso no encontrado");

            curso.Nombre = dto.Nombre;
            curso.GradoId = dto.GradoId;
            curso.Grupo = dto.Grupo ?? string.Empty;
            curso.ProfesorId = dto.ProfesorId;

            await _context.SaveChangesAsync();
            return Ok(new
            {
                curso.Id,
                curso.Nombre,
                GradoId = curso.GradoId,
                curso.ProfesorId
            });
        }

        // DELETE: api/Cursos/5
        //[Authorize(Roles = "admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> EliminarCurso(int id)
        {
            var curso = await _context.Cursos.FindAsync(id);
            if (curso == null)
                return NotFound("Curso no encontrado");

            _context.Cursos.Remove(curso);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Cursos/5/students
        //[Authorize] // admin o docente
        [HttpGet("{id:int}/students")]
        public async Task<IActionResult> GetEstudiantesCurso(int id)
        {
            var estudiantes = await _context.Inscripciones
                .Where(i => i.CursoId == id)
                .Include(i => i.Estudiante)
                .Select(i => new { i.Estudiante!.Id, i.Estudiante!.Nombre, i.Estudiante!.Documento })
                .ToListAsync();

            return Ok(estudiantes);
        }
    }
}
