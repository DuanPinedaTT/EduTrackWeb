using System.ComponentModel.DataAnnotations;
using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using edutrack_academy_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class TutoresController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPortalCredentialService _credentialService;

        public TutoresController(AppDbContext context, IPortalCredentialService credentialService)
        {
            _context = context;
            _credentialService = credentialService;
        }

        public class TutorEstudianteRequestDTO
        {
            [Required]
            public int EstudianteId { get; set; }
            public string Relacion { get; set; } = "Tutor";
            public bool EsPrincipal { get; set; } = false;
        }

        public class TutorRequestDTO
        {
            [Required]
            public string Nombre { get; set; } = string.Empty;
            [Required]
            public string Apellido { get; set; } = string.Empty;
            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;
            public string? User { get; set; }
            public string? Password { get; set; }
            [MinLength(1, ErrorMessage = "Debes seleccionar al menos un estudiante")]
            public List<TutorEstudianteRequestDTO> Hijos { get; set; } = new();
        }

        public class TutorEstudianteResponseDTO
        {
            public int EstudianteId { get; set; }
            public string Nombre { get; set; } = string.Empty;
            public string Documento { get; set; } = string.Empty;
            public string Relacion { get; set; } = string.Empty;
            public bool EsPrincipal { get; set; }
        }

        public class TutorResponseDTO
        {
            public int Id { get; set; }
            public string User { get; set; } = string.Empty;
            public string Nombre { get; set; } = string.Empty;
            public string Apellido { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public IEnumerable<TutorEstudianteResponseDTO> Estudiantes { get; set; } = new List<TutorEstudianteResponseDTO>();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tutores = await _context.Usuarios
                .Where(u => u.Rol == "tutor")
                .Include(u => u.TutorEstudiantes)
                    .ThenInclude(te => te.Estudiante)
                .OrderBy(u => u.Nombre)
                .ThenBy(u => u.Apellido)
                .Select(u => new TutorResponseDTO
                {
                    Id = u.Id,
                    User = u.User,
                    Nombre = u.Nombre,
                    Apellido = u.Apellido,
                    Email = u.Email,
                    Estudiantes = u.TutorEstudiantes.Select(te => new TutorEstudianteResponseDTO
                    {
                        EstudianteId = te.EstudianteId,
                        Nombre = te.Estudiante != null ? te.Estudiante.Nombre : string.Empty,
                        Documento = te.Estudiante != null ? te.Estudiante.Documento : string.Empty,
                        Relacion = te.Relacion,
                        EsPrincipal = te.EsPrincipal
                    }).ToList()
                })
                .ToListAsync();

            return Ok(tutores);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TutorRequestDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            dto.Hijos ??= new List<TutorEstudianteRequestDTO>();

            var hijos = NormalizeHijos(dto.Hijos);
            if (hijos.Count == 0)
            {
                return BadRequest("Debes vincular al menos un estudiante");
            }

            var estudiantesValidos = await _context.Estudiantes
                .Where(e => hijos.Select(h => h.EstudianteId).Contains(e.Id))
                .Select(e => e.Id)
                .ToListAsync();

            if (estudiantesValidos.Count != hijos.Count)
            {
                return BadRequest("Uno o más estudiantes no existen");
            }

            var usuario = new Usuario
            {
                User = (dto.User ?? string.Empty).Trim(),
                Nombre = dto.Nombre.Trim(),
                Apellido = dto.Apellido.Trim(),
                Email = dto.Email.Trim(),
                Rol = "tutor"
            };

            var credenciales = await _credentialService.CreateTutorAccountAsync(usuario, dto.Password);

            foreach (var hijo in hijos)
            {
                _context.TutorEstudiantes.Add(new TutorEstudiante
                {
                    TutorId = credenciales.UsuarioId,
                    EstudianteId = hijo.EstudianteId,
                    Relacion = string.IsNullOrWhiteSpace(hijo.Relacion) ? "Tutor" : hijo.Relacion.Trim(),
                    EsPrincipal = hijo.EsPrincipal
                });
            }

            await _context.SaveChangesAsync();

            var response = await BuildTutorResponseAsync(credenciales.UsuarioId);
            return Ok(new
            {
                tutor = response,
                credenciales = credenciales.PasswordTemporal != null
                    ? new
                    {
                        usuario = credenciales.Usuario,
                        passwordTemporal = credenciales.PasswordTemporal
                    }
                    : null
            });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] TutorRequestDTO dto)
        {
            var tutor = await _context.Usuarios.Include(u => u.TutorEstudiantes)
                .FirstOrDefaultAsync(u => u.Id == id && u.Rol == "tutor");
            if (tutor == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            dto.Hijos ??= new List<TutorEstudianteRequestDTO>();

            var hijos = NormalizeHijos(dto.Hijos);
            if (hijos.Count == 0)
            {
                return BadRequest("Debes vincular al menos un estudiante");
            }

            var estudiantesValidos = await _context.Estudiantes
                .Where(e => hijos.Select(h => h.EstudianteId).Contains(e.Id))
                .Select(e => e.Id)
                .ToListAsync();

            if (estudiantesValidos.Count != hijos.Count)
            {
                return BadRequest("Uno o más estudiantes no existen");
            }

            var newUser = (dto.User ?? tutor.User).Trim();
            if (!string.Equals(newUser, tutor.User, StringComparison.OrdinalIgnoreCase))
            {
                var exists = await _context.Usuarios.AnyAsync(u => u.User == newUser && u.Id != tutor.Id);
                if (exists)
                {
                    return BadRequest("El usuario especificado ya existe");
                }
                tutor.User = newUser;
            }

            tutor.Nombre = dto.Nombre.Trim();
            tutor.Apellido = dto.Apellido.Trim();
            tutor.Email = dto.Email.Trim();

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                tutor.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password.Trim());
            }

            _context.TutorEstudiantes.RemoveRange(tutor.TutorEstudiantes);
            foreach (var hijo in hijos)
            {
                _context.TutorEstudiantes.Add(new TutorEstudiante
                {
                    TutorId = tutor.Id,
                    EstudianteId = hijo.EstudianteId,
                    Relacion = string.IsNullOrWhiteSpace(hijo.Relacion) ? "Tutor" : hijo.Relacion.Trim(),
                    EsPrincipal = hijo.EsPrincipal
                });
            }

            await _context.SaveChangesAsync();
            var response = await BuildTutorResponseAsync(tutor.Id);
            return Ok(response);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var tutor = await _context.Usuarios.FirstOrDefaultAsync(u => u.Id == id && u.Rol == "tutor");
            if (tutor == null)
            {
                return NotFound();
            }

            await _credentialService.DeleteAccountAsync(tutor.Id);
            return NoContent();
        }

        [HttpPost("{id:int}/reset-password")]
        public async Task<IActionResult> ResetPassword(int id)
        {
            var tutor = await _context.Usuarios.FirstOrDefaultAsync(u => u.Id == id && u.Rol == "tutor");
            if (tutor == null)
            {
                return NotFound();
            }

            var password = await _credentialService.ResetPasswordAsync(tutor.Id);
            return Ok(new
            {
                usuario = tutor.User,
                passwordTemporal = password
            });
        }

        private static List<TutorEstudianteRequestDTO> NormalizeHijos(IEnumerable<TutorEstudianteRequestDTO> hijos)
        {
            return hijos
                .Where(h => h != null && h.EstudianteId > 0)
                .GroupBy(h => h.EstudianteId)
                .Select(g => g.First())
                .ToList();
        }

        private async Task<TutorResponseDTO?> BuildTutorResponseAsync(int tutorId)
        {
            return await _context.Usuarios
                .Where(u => u.Id == tutorId)
                .Include(u => u.TutorEstudiantes)
                    .ThenInclude(te => te.Estudiante)
                .Select(u => new TutorResponseDTO
                {
                    Id = u.Id,
                    User = u.User,
                    Nombre = u.Nombre,
                    Apellido = u.Apellido,
                    Email = u.Email,
                    Estudiantes = u.TutorEstudiantes.Select(te => new TutorEstudianteResponseDTO
                    {
                        EstudianteId = te.EstudianteId,
                        Nombre = te.Estudiante != null ? te.Estudiante.Nombre : string.Empty,
                        Documento = te.Estudiante != null ? te.Estudiante.Documento : string.Empty,
                        Relacion = te.Relacion,
                        EsPrincipal = te.EsPrincipal
                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }
    }
}
