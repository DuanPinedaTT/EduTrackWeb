using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    // DTOs
    public class EstudianteDTO
    {
        public int? Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Documento { get; set; } = string.Empty;
        public int? CursoId { get; set; }
        public string Telefono { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Nivel { get; set; } = string.Empty;
        public int? UsuarioId { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class EstudiantesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EstudiantesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var estudiantes = await _context.Estudiantes
                .Select(e => new EstudianteDTO
                {
                    Id = e.Id,
                    Nombre = e.Nombre,
                    Apellido = e.Apellido,
                    Documento = e.Documento,
                    CursoId = null,
                    Telefono = e.Telefono,
                    Direccion = e.Direccion,
                    Nivel = e.Nivel,
                    UsuarioId = e.UsuarioId
                })
                .ToListAsync();
            return Ok(estudiantes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var estudiante = await _context.Estudiantes.FindAsync(id);
            if (estudiante == null) return NotFound();

            return Ok(new EstudianteDTO
            {
                Id = estudiante.Id,
                Nombre = estudiante.Nombre,
                Apellido = estudiante.Apellido,
                Documento = estudiante.Documento,
                CursoId = null,
                Telefono = estudiante.Telefono,
                Direccion = estudiante.Direccion,
                Nivel = estudiante.Nivel,
                UsuarioId = estudiante.UsuarioId
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EstudianteDTO dto)
        {
            var estudiante = new Estudiante
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Documento = dto.Documento,
                Telefono = dto.Telefono,
                Direccion = dto.Direccion,
                Nivel = dto.Nivel,
                UsuarioId = dto.UsuarioId
            };
            _context.Estudiantes.Add(estudiante);
            await _context.SaveChangesAsync();

            dto.Id = estudiante.Id;
            dto.CursoId = null;
            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EstudianteDTO dto)
        {
            var estudiante = await _context.Estudiantes.FindAsync(id);
            if (estudiante == null) return NotFound();

            estudiante.Nombre = dto.Nombre;
            estudiante.Apellido = dto.Apellido;
            estudiante.Documento = dto.Documento;
            estudiante.Telefono = dto.Telefono;
            estudiante.Direccion = dto.Direccion;
            estudiante.Nivel = dto.Nivel;
            // No cambiar CursoId desde aquí; use Inscripciones para relacionar estudiantes y cursos.
            await _context.SaveChangesAsync();
            dto.CursoId = null;
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var estudiante = await _context.Estudiantes.FindAsync(id);
            if (estudiante == null) return NotFound();

            _context.Estudiantes.Remove(estudiante);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
