using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using edutrack_academy_api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComunicacionesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationDispatcher _notificationDispatcher;

        public ComunicacionesController(AppDbContext context, INotificationDispatcher notificationDispatcher)
        {
            _context = context;
            _notificationDispatcher = notificationDispatcher;
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
            public bool IncluirTutores { get; set; } = false;
        }

        [HttpPost]
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

            if (dto.EstudianteIds.Count > 0)
            {
                var estudiantesValidos = await _context.Estudiantes
                    .Where(e => dto.EstudianteIds.Contains(e.Id))
                    .Select(e => e.Id)
                    .ToListAsync();

                if (estudiantesValidos.Count != dto.EstudianteIds.Count)
                {
                    return BadRequest("Uno o más estudiantes seleccionados no existen");
                }

                foreach (var id in estudiantesValidos)
                {
                    estudiantesDestino.Add(id);
                }
            }
            else if (dto.CursoId.HasValue)
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

            await NotifyDestinatariosAsync(comunicacion, destinos, remitenteId);

            return Ok(new
            {
                comunicacion.Id,
                destinatarios = destinos.Count
            });
        }

        private async Task NotifyDestinatariosAsync(Comunicacion comunicacion, IEnumerable<ComunicacionDestino> destinos, int remitenteId)
        {
            var remitente = await _context.Usuarios
                .Where(u => u.Id == remitenteId)
                .Select(u => new { u.Id, u.Nombre })
                .FirstOrDefaultAsync();

            string? cursoNombre = null;
            string? asignaturaNombre = null;
            if (comunicacion.CursoId.HasValue)
            {
                var cursoInfo = await _context.Cursos
                    .Where(c => c.Id == comunicacion.CursoId.Value)
                    .Select(c => new
                    {
                        c.Nombre,
                        DocenteAsignatura = c.CursoAsignaturas
                            .Where(ca => ca.DocenteId == remitenteId && ca.Asignatura != null)
                            .OrderBy(ca => ca.Id)
                            .Select(ca => ca.Asignatura!.Nombre)
                            .FirstOrDefault(),
                        AnyAsignatura = c.CursoAsignaturas
                            .Where(ca => ca.Asignatura != null)
                            .OrderBy(ca => ca.Id)
                            .Select(ca => ca.Asignatura!.Nombre)
                            .FirstOrDefault()
                    })
                    .FirstOrDefaultAsync();

                cursoNombre = cursoInfo?.Nombre;
                asignaturaNombre = cursoInfo?.DocenteAsignatura ?? cursoInfo?.AnyAsignatura;
            }

            var timestamp = comunicacion.CreadaEn;

            var estudianteIds = destinos
                .Where(d => d.EstudianteId.HasValue)
                .Select(d => d.EstudianteId!.Value)
                .Distinct()
                .ToList();

            var estudiantesMap = estudianteIds.Count == 0
                ? new Dictionary<int, string>()
                : await _context.Estudiantes
                    .Where(e => estudianteIds.Contains(e.Id))
                    .Select(e => new { e.Id, e.Nombre })
                    .ToDictionaryAsync(e => e.Id, e => e.Nombre);

            var tutorIds = destinos
                .Where(d => d.TutorId.HasValue)
                .Select(d => d.TutorId!.Value)
                .Distinct()
                .ToList();

            var tutoresMap = tutorIds.Count == 0
                ? new Dictionary<int, string>()
                : await _context.Usuarios
                    .Where(u => tutorIds.Contains(u.Id))
                    .Select(u => new { u.Id, u.Nombre })
                    .ToDictionaryAsync(u => u.Id, u => u.Nombre);

            foreach (var destino in destinos)
            {
                var preview = comunicacion.Mensaje.Length > 140
                    ? string.Concat(comunicacion.Mensaje.AsSpan(0, 140), "...")
                    : comunicacion.Mensaje;

                string? estudianteNombre = null;
                if (destino.EstudianteId.HasValue && estudiantesMap.TryGetValue(destino.EstudianteId.Value, out var estNombre))
                {
                    estudianteNombre = estNombre;
                }

                string? tutorNombre = null;
                if (destino.TutorId.HasValue && tutoresMap.TryGetValue(destino.TutorId.Value, out var tutNombre))
                {
                    tutorNombre = tutNombre;
                }

                var payload = new NotificationPayload(
                    Type: "comunicacion",
                    Title: comunicacion.Titulo,
                    Message: preview,
                    Data: new
                    {
                        comunicacionId = comunicacion.Id,
                        destinoId = destino.Id,
                        estudianteId = destino.EstudianteId,
                        tutorId = destino.TutorId,
                        estudianteNombre,
                        tutorNombre,
                        titulo = comunicacion.Titulo,
                        mensaje = comunicacion.Mensaje,
                        tipo = comunicacion.Tipo,
                        cursoId = comunicacion.CursoId,
                        cursoNombre,
                        asignaturaNombre,
                        remitenteId = remitente?.Id ?? remitenteId,
                        remitenteNombre = remitente?.Nombre
                    },
                    Timestamp: timestamp
                );

                if (destino.EstudianteId.HasValue)
                {
                    await _notificationDispatcher.SendToStudentsAsync(new[] { destino.EstudianteId.Value }, payload);
                }
                else if (destino.TutorId.HasValue)
                {
                    await _notificationDispatcher.SendToTutorsAsync(new[] { destino.TutorId.Value }, payload);
                }
            }
        }

        [HttpGet("emitidas")]
        public async Task<IActionResult> GetEmitidas()
        {
            var remitenteId = GetUserId();
            var comunicaciones = await _context.Comunicaciones
                .Where(c => c.RemitenteId == remitenteId)
                .Include(c => c.Curso)
                    .ThenInclude(curso => curso!.Grado)
                .OrderByDescending(c => c.CreadaEn)
                .Take(100)
                .Select(c => new
                {
                    c.Id,
                    c.Titulo,
                    c.Tipo,
                    c.CreadaEn,
                    c.Mensaje,
                    Curso = c.Curso != null ? new
                    {
                        c.Curso.Id,
                        c.Curso.Nombre,
                        c.Curso.Grupo,
                        Grado = c.Curso.Grado != null ? c.Curso.Grado.Nombre : null
                    } : null,
                    Destinatarios = c.Destinatarios.Count,
                    EstudiantesDestinatarios = c.Destinatarios.Count(d => d.EstudianteId != null),
                    TutoresDestinatarios = c.Destinatarios.Count(d => d.TutorId != null)
                })
                .ToListAsync();

            return Ok(comunicaciones);
        }
    }
}
