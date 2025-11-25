using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsistenciasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private static readonly HashSet<string> EstadosValidos = new(StringComparer.OrdinalIgnoreCase)
        {
            "presente",
            "ausente",
            "tarde"
        };

        public AsistenciasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Asistencias/curso/5?fecha=2025-11-24
        [HttpGet("curso/{cursoId:int}")]
        public async Task<IActionResult> ObtenerPorCurso(int cursoId, [FromQuery] DateTime? fecha)
        {
            var fechaFiltro = (fecha ?? DateTime.UtcNow.Date).Date;

            var registros = await _context.Asistencias
                .Where(a => a.CursoId == cursoId && a.Fecha == fechaFiltro)
                .Select(a => new
                {
                    a.Id,
                    a.CursoId,
                    a.EstudianteId,
                    a.Estado,
                    a.Observacion,
                    Fecha = a.Fecha.ToString("yyyy-MM-dd")
                })
                .ToListAsync();

            return Ok(registros);
        }

        // GET: api/Asistencias/estudiante/10?mes=2025-11
        [HttpGet("estudiante/{estudianteId:int}")]
        public async Task<IActionResult> ObtenerPorEstudiante(int estudianteId, [FromQuery] string? mes = null)
        {
            var query = _context.Asistencias
                .Where(a => a.EstudianteId == estudianteId)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(mes) && DateTime.TryParse($"{mes}-01", out var fechaMes))
            {
                var inicio = new DateTime(fechaMes.Year, fechaMes.Month, 1);
                var fin = inicio.AddMonths(1);
                query = query.Where(a => a.Fecha >= inicio && a.Fecha < fin);
            }

            var registros = await query
                .OrderByDescending(a => a.Fecha)
                .Select(a => new
                {
                    a.Id,
                    a.CursoId,
                    CursoNombre = a.Curso != null ? a.Curso.Nombre : null,
                    a.Estado,
                    a.Observacion,
                    Fecha = a.Fecha.ToString("yyyy-MM-dd")
                })
                .ToListAsync();

            return Ok(registros);
        }

        // POST: api/Asistencias/curso/5
        [HttpPost("curso/{cursoId:int}")]
        public async Task<IActionResult> GuardarAsistencias(int cursoId, [FromBody] GuardarAsistenciasDTO dto)
        {
            if (dto.Registros == null || dto.Registros.Count == 0)
            {
                return BadRequest("Debe registrar al menos un estudiante");
            }

            var fecha = dto.Fecha.Date;

            var estudiantesCurso = await _context.Inscripciones
                .Where(i => i.CursoId == cursoId)
                .Select(i => i.EstudianteId)
                .ToListAsync();

            if (estudiantesCurso.Count == 0)
            {
                return BadRequest("El curso no tiene estudiantes inscritos");
            }

            var registrosAgrupados = dto.Registros
                .GroupBy(r => r.EstudianteId)
                .Select(g => g.Last())
                .ToList();

            foreach (var registro in registrosAgrupados)
            {
                if (!estudiantesCurso.Contains(registro.EstudianteId))
                {
                    return BadRequest($"El estudiante {registro.EstudianteId} no pertenece al curso");
                }

                if (!string.IsNullOrWhiteSpace(registro.Estado) && !EstadosValidos.Contains(registro.Estado.Trim().ToLowerInvariant()))
                {
                    return BadRequest("Estado inválido. Use presente, ausente o tarde");
                }
            }

            var existentes = await _context.Asistencias
                .Where(a => a.CursoId == cursoId && a.Fecha == fecha)
                .ToListAsync();

            foreach (var registro in registrosAgrupados)
            {
                var existente = existentes.FirstOrDefault(a => a.EstudianteId == registro.EstudianteId);
                if (string.IsNullOrWhiteSpace(registro.Estado))
                {
                    if (existente != null)
                    {
                        _context.Asistencias.Remove(existente);
                    }
                    continue;
                }

                if (existente == null)
                {
                    _context.Asistencias.Add(new Asistencia
                    {
                        CursoId = cursoId,
                        EstudianteId = registro.EstudianteId,
                        Fecha = fecha,
                        Estado = registro.Estado!.Trim().ToLowerInvariant(),
                        Observacion = registro.Observacion,
                        RegistradoPorId = dto.RegistradoPorId,
                        RegistradoEn = DateTime.UtcNow,
                        ActualizadoEn = DateTime.UtcNow
                    });
                }
                else
                {
                    existente.Estado = registro.Estado!.Trim().ToLowerInvariant();
                    existente.Observacion = registro.Observacion;
                    existente.RegistradoPorId = dto.RegistradoPorId;
                    existente.ActualizadoEn = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                CursoId = cursoId,
                Fecha = fecha.ToString("yyyy-MM-dd"),
                Registros = registrosAgrupados.Count
            });
        }
    }
}
