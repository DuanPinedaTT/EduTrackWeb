using edutrack_academy_api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfesoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfesoresController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("perfil-usuario/{usuarioId:int}")]
        public async Task<IActionResult> GetByUsuario(int usuarioId)
        {
            var profesor = await _context.Profesores
                .Include(p => p.Usuario)
                .FirstOrDefaultAsync(p => p.UsuarioId == usuarioId);

            if (profesor == null)
            {
                return NotFound("Docente no encontrado");
            }

            return Ok(new
            {
                Id = profesor.Id,
                UsuarioId = profesor.UsuarioId,
                Nombre = profesor.Usuario?.Nombre ?? string.Empty,
                Apellido = profesor.Usuario?.Apellido ?? string.Empty,
                Email = profesor.Usuario?.Email ?? string.Empty,
                Especialidad = profesor.Especialidad,
                Telefono = profesor.Telefono,
                Direccion = profesor.Direccion,
                FechaIngreso = profesor.FechaIngreso
            });
        }

        [HttpGet("{id:int}/cursos")]
        public async Task<IActionResult> GetCursosTitulares(int id)
        {
            var cursos = await _context.Cursos
                .Where(c => c.ProfesorId == id)
                .Include(c => c.Grado)
                .Select(c => new
                {
                    c.Id,
                    c.Nombre,
                    c.Grupo,
                    GradoId = c.GradoId,
                    GradoNombre = c.Grado != null ? c.Grado.Nombre : null,
                    GradoCodigo = c.Grado != null ? c.Grado.Codigo : null,
                    c.ProfesorId
                })
                .ToListAsync();

            return Ok(cursos);
        }
    }
}
