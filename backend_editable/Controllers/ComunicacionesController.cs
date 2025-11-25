using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComunicacionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ComunicacionesController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(raw))
            {
                throw new InvalidOperationException("El token no contiene identificador");
            }

            return int.Parse(raw);
        }

        public class CrearComunicacionDTO
        {
            [Required]
            public string Titulo { get; set; } = string.Empty;
            [Required]
            public string Mensaje { get; set; } = string.Empty;
            public string Tipo { get; set; } = "general";
            public int? CursoId { get; set; }
            public List<int> EstudianteIds { get; set; } = new();
            public bool IncluirTutores { get; set; } = true;
        }

        [HttpPost]
        [Authorize(Roles = "admin,docente")]
        public async Task<IActionResult> Crear([FromBody] CrearComunicacionDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto.CursoId == null && dto.EstudianteIds.Count == 0)
            {
                return BadRequest("Debes especificar un curso o una lista de estudiantes");
            }

            var remitenteId = GetUserId();

            var comunicacion = new Comunicacion
            {
                Titulo = dto.Titulo,
                Mensaje = dto.Mensaje,
                Tipo = dto.Tipo,
                CursoId = dto.CursoId,
                RemitenteId = remitenteId,
                CreadaEn = DateTime.UtcNow
            };

            _context.Comunicaciones.Add(comunicacion);
            await _context.SaveChangesAsync();

            var estudiantesDestino = new HashSet<int>();

            if (dto.CursoId.HasValue)
            {
                var inscritos = await _context.Inscripciones
                    .Where(i => i.CursoId == dto.CursoId.Value)
                    .Select(i => i.EstudianteId)
                    .ToListAsync();
                foreach (var id in inscritos)
                {
                    estudiantesDestino.Add(id);
                }
            }

            foreach (var id in dto.EstudianteIds)
            {
                estudiantesDestino.Add(id);
            }

            if (estudiantesDestino.Count == 0)
            {
                return BadRequest("No se encontraron estudiantes destino");
            }

            var destinos = new List<ComunicacionDestino>();
            Dictionary<int, List<int>> tutoresPorEstudiante = new();

            if (dto.IncluirTutores && estudiantesDestino.Count > 0)
            {
                tutoresPorEstudiante = await _context.TutorEstudiantes
                    .Where(te => estudiantesDestino.Contains(te.EstudianteId))
                    .GroupBy(te => te.EstudianteId)
                    .ToDictionaryAsync(
                        g => g.Key,
                        g => g.Select(te => te.TutorId).Distinct().ToList()
                    );
            }

            foreach (var estudianteId in estudiantesDestino)
            {
                destinos.Add(new ComunicacionDestino
                {
                    ComunicacionId = comunicacion.Id,
                    EstudianteId = estudianteId,
                    Canal = "portal"
                });

                if (dto.IncluirTutores && tutoresPorEstudiante.TryGetValue(estudianteId, out var tutores))
                {
                    foreach (var tutorId in tutores)
                    {
                        destinos.Add(new ComunicacionDestino
                        {
                            ComunicacionId = comunicacion.Id,
                            TutorId = tutorId,
                            Canal = "portal"
                        });
                    }
                }
            }

            _context.ComunicacionDestinos.AddRange(destinos);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                comunicacion.Id,
                destinatarios = destinos.Count
            });
        }

        [HttpGet("emitidas")]
        [Authorize(Roles = "admin,docente")]
        public async Task<IActionResult> GetEmitidas()
        {
            var remitenteId = GetUserId();
            var comunicaciones = await _context.Comunicaciones
                .Where(c => c.RemitenteId == remitenteId)
                .OrderByDescending(c => c.CreadaEn)
                .Take(100)
                .Select(c => new
                {
                    c.Id,
                    c.Titulo,
                    c.Tipo,
                    c.CreadaEn,
                    Destinatarios = c.Destinatarios.Count
                })
                .ToListAsync();

            return Ok(comunicaciones);
        }
    }
}
