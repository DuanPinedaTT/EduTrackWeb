using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using edutrack_academy_api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    // DTOs
    public class NotaConfigDTO
    {
        public int? Id { get; set; }
        public int CursoId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int Orden { get; set; }
        public decimal Peso { get; set; }
        public int Periodo { get; set; } = 1;
    }

    public class ActualizarNotaDTO
    {
        public int EstudianteId { get; set; }
        public int NotaConfigId { get; set; }
        public decimal? Valor { get; set; }
    }

    public class NotaEstudianteDTO
    {
        public int NotaConfigId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal Peso { get; set; }
        public decimal? Valor { get; set; }
    }

    public class EstudianteConNotasDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Documento { get; set; } = string.Empty;
        public List<NotaEstudianteDTO> Notas { get; set; } = new();
        public decimal? Promedio { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class NotasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationDispatcher _notificationDispatcher;

        public NotasController(AppDbContext context, INotificationDispatcher notificationDispatcher)
        {
            _context = context;
            _notificationDispatcher = notificationDispatcher;
        }

        // GET /api/Notas/curso/{cursoId}/config
        [HttpGet("curso/{cursoId}/config")]
        public async Task<IActionResult> GetConfig(int cursoId)
        {
            var configs = await _context.NotaConfigs
                .Where(nc => nc.CursoId == cursoId)
                .OrderBy(nc => nc.Periodo)
                .ThenBy(nc => nc.Orden)
                .Select(nc => new NotaConfigDTO
                {
                    Id = nc.Id,
                    CursoId = nc.CursoId,
                    Nombre = nc.Nombre,
                    Orden = nc.Orden,
                    Peso = nc.Peso,
                    Periodo = nc.Periodo
                })
                .ToListAsync();

            return Ok(configs);
        }

        // POST /api/Notas/curso/{cursoId}/config
        [HttpPost("curso/{cursoId}/config")]
        public async Task<IActionResult> CreateConfig(int cursoId, [FromBody] NotaConfigDTO dto)
        {
            var config = new NotaConfig
            {
                CursoId = cursoId,
                Nombre = dto.Nombre,
                Orden = dto.Orden,
                Peso = dto.Peso,
                Periodo = dto.Periodo
            };

            _context.NotaConfigs.Add(config);
            await _context.SaveChangesAsync();

            return Ok(new NotaConfigDTO
            {
                Id = config.Id,
                CursoId = config.CursoId,
                Nombre = config.Nombre,
                Orden = config.Orden,
                Peso = config.Peso,
                Periodo = config.Periodo
            });
        }

        // PUT /api/Notas/config/{id}  <-- NUEVO ENDPOINT
        [HttpPut("config/{id}")]
        public async Task<IActionResult> UpdateConfig(int id, [FromBody] NotaConfigDTO dto)
        {
            var config = await _context.NotaConfigs.FindAsync(id);
            if (config == null) return NotFound("Configuración de nota no encontrada");

            config.Nombre = dto.Nombre;
            config.Peso = dto.Peso;
            config.Orden = dto.Orden;
            config.Periodo = dto.Periodo;

            await _context.SaveChangesAsync();

            return Ok(new NotaConfigDTO
            {
                Id = config.Id,
                CursoId = config.CursoId,
                Nombre = config.Nombre,
                Orden = config.Orden,
                Peso = config.Peso,
                Periodo = config.Periodo
            });
        }

        // DELETE /api/Notas/config/{id}
        [HttpDelete("config/{id}")]
        public async Task<IActionResult> DeleteConfig(int id)
        {
            var config = await _context.NotaConfigs.FindAsync(id);
            if (config == null) return NotFound("Configuración de nota no encontrada");

            // Eliminar todas las notas asociadas
            var notasAsociadas = await _context.Notas
                .Where(n => n.NotaConfigId == id)
                .ToListAsync();
            _context.Notas.RemoveRange(notasAsociadas);

            _context.NotaConfigs.Remove(config);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // GET /api/Notas/curso/{cursoId}
        [HttpGet("curso/{cursoId}")]
        public async Task<IActionResult> GetNotas(int cursoId)
        {
            var estudiantes = await _context.Inscripciones
                .Where(i => i.CursoId == cursoId)
                .Include(i => i.Estudiante)
                .Select(i => i.Estudiante!)
                .ToListAsync();

            var configs = await _context.NotaConfigs
                .Where(nc => nc.CursoId == cursoId)
                .OrderBy(nc => nc.Periodo)
                .ThenBy(nc => nc.Orden)
                .ToListAsync();

            var estudianteIds = estudiantes.Select(e => e.Id).ToList();
            var notas = await _context.Notas
                .Where(n => estudianteIds.Contains(n.EstudianteId))
                .ToListAsync();

            var result = estudiantes.Select(est =>
            {
                var notasEst = configs.Select(cfg => new NotaEstudianteDTO
                {
                    NotaConfigId = cfg.Id,
                    Nombre = cfg.Nombre,
                    Peso = cfg.Peso,
                    Valor = notas.FirstOrDefault(n => n.EstudianteId == est.Id && n.NotaConfigId == cfg.Id)?.Valor
                }).ToList();

                // Calcular promedio ponderado
                decimal? promedio = null;
                var notasConValor = notasEst.Where(n => n.Valor.HasValue).ToList();
                if (notasConValor.Any())
                {
                    decimal sumaProductos = notasConValor.Sum(n => n.Valor!.Value * n.Peso);
                    decimal sumaPesos = notasConValor.Sum(n => n.Peso);
                    if (sumaPesos > 0)
                    {
                        promedio = Math.Round(sumaProductos / sumaPesos, 2);
                    }
                }

                return new EstudianteConNotasDTO
                {
                    Id = est.Id,
                    Nombre = est.Nombre,
                    Documento = est.Documento,
                    Notas = notasEst,
                    Promedio = promedio
                };
            }).ToList();

            return Ok(result);
        }

        // PUT /api/Notas
        [HttpPut]
        public async Task<IActionResult> UpdateNota([FromBody] ActualizarNotaDTO dto)
        {
            var notaConfig = await _context.NotaConfigs
                .Include(nc => nc.Curso)
                .FirstOrDefaultAsync(nc => nc.Id == dto.NotaConfigId);

            if (notaConfig == null)
            {
                return NotFound("Configuración de nota no encontrada");
            }

            var estudiante = await _context.Estudiantes
                .FirstOrDefaultAsync(e => e.Id == dto.EstudianteId);

            if (estudiante == null)
            {
                return NotFound("Estudiante no encontrado");
            }

            var existing = await _context.Notas
                .FirstOrDefaultAsync(n => n.EstudianteId == dto.EstudianteId && n.NotaConfigId == dto.NotaConfigId);

            if (existing == null)
            {
                var nuevaNota = new Nota
                {
                    EstudianteId = dto.EstudianteId,
                    NotaConfigId = dto.NotaConfigId,
                    Valor = dto.Valor
                };
                _context.Notas.Add(nuevaNota);
            }
            else
            {
                existing.Valor = dto.Valor;
            }

            await _context.SaveChangesAsync();

            var tutorIds = await _context.TutorEstudiantes
                .Where(te => te.EstudianteId == estudiante.Id)
                .Select(te => te.TutorId)
                .Distinct()
                .ToListAsync();

            decimal? promedio = null;
            if (notaConfig.CursoId != 0)
            {
                var configsCurso = await _context.NotaConfigs
                    .Where(nc => nc.CursoId == notaConfig.CursoId)
                    .Select(nc => new { nc.Id, nc.Peso })
                    .ToListAsync();

                var configIds = configsCurso.Select(c => c.Id).ToList();

                var notasEstudiante = await _context.Notas
                    .Where(n => n.EstudianteId == estudiante.Id && configIds.Contains(n.NotaConfigId))
                    .Select(n => new { n.NotaConfigId, n.Valor })
                    .ToListAsync();

                decimal sumaPesos = 0m;
                decimal sumaProductos = 0m;

                foreach (var cfg in configsCurso)
                {
                    var notaValor = notasEstudiante.FirstOrDefault(n => n.NotaConfigId == cfg.Id)?.Valor;
                    if (notaValor.HasValue)
                    {
                        sumaPesos += cfg.Peso;
                        sumaProductos += cfg.Peso * notaValor.Value;
                    }
                }

                if (sumaPesos > 0)
                {
                    promedio = Math.Round(sumaProductos / sumaPesos, 2);
                }
            }

            var studentPayload = new NotificationPayload(
                Type: "nota",
                Title: $"{notaConfig.Nombre} actualizada",
                Message: "Tu calificación se actualizó.",
                Data: new
                {
                    estudianteId = estudiante.Id,
                    estudianteNombre = estudiante.Nombre,
                    cursoId = notaConfig.CursoId,
                    curso = notaConfig.Curso?.Nombre,
                    notaConfigId = notaConfig.Id,
                    columna = notaConfig.Nombre,
                    periodo = notaConfig.Periodo,
                    valor = dto.Valor,
                    promedio
                },
                Timestamp: DateTime.UtcNow
            );

            await _notificationDispatcher.SendToStudentsAsync(new[] { estudiante.Id }, studentPayload);

            if (tutorIds.Count > 0)
            {
                var tutorPayload = new NotificationPayload(
                    Type: studentPayload.Type,
                    Title: studentPayload.Title,
                    Message: $"{estudiante.Nombre} tiene una nueva nota en {notaConfig.Nombre}.",
                    Data: studentPayload.Data,
                    Timestamp: studentPayload.Timestamp
                );

                await _notificationDispatcher.SendToTutorsAsync(tutorIds, tutorPayload);
            }

            if (notaConfig.CursoId != 0)
            {
                var cursoPayload = new NotificationPayload(
                    Type: "nota-curso",
                    Title: $"Nueva calificación en {notaConfig.Curso?.Nombre ?? "Curso"}",
                    Message: $"Periodo {notaConfig.Periodo}: {notaConfig.Nombre}",
                    Data: new
                    {
                        cursoId = notaConfig.CursoId,
                        notaConfigId = notaConfig.Id,
                        periodo = notaConfig.Periodo,
                        estudianteId = estudiante.Id,
                        estudianteNombre = estudiante.Nombre,
                        valor = dto.Valor,
                        promedio,
                        timestamp = DateTime.UtcNow
                    },
                    Timestamp: DateTime.UtcNow
                );

                await _notificationDispatcher.SendToCoursesAsync(new[] { notaConfig.CursoId }, cursoPayload);
            }

            return Ok();
        }
    }
}
