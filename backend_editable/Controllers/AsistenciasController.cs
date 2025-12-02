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
    [Authorize(Roles = "admin,docente")]
    public class AsistenciasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AsistenciasController(AppDbContext context)
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

        public class RegistrarAsistenciaDTO
        {
            [Required]
            public int CursoId { get; set; }
            [Required]
            public int? AsignaturaId { get; set; }
            public DateTime Fecha { get; set; } = DateTime.UtcNow.Date;
            public int Periodo { get; set; } = 1;
            [MinLength(1)]
            public List<AsistenciaDetalleDTO> Detalles { get; set; } = new();
        }

        public class AsistenciaDetalleDTO
        {
            [Required]
            public int EstudianteId { get; set; }
            [Required]
            public string Estado { get; set; } = "Presente";
            public string? Observacion { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarAsistencia([FromBody] RegistrarAsistenciaDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!dto.AsignaturaId.HasValue || dto.AsignaturaId.Value <= 0)
            {
                return BadRequest("La asignatura es obligatoria para el registro de asistencia");
            }

            var fecha = dto.Fecha.Date;
            var estudianteIds = dto.Detalles.Select(d => d.EstudianteId).Distinct().ToList();

            var inscritos = await _context.Inscripciones
                .Where(i => i.CursoId == dto.CursoId && estudianteIds.Contains(i.EstudianteId))
                .Select(i => i.EstudianteId)
                .ToListAsync();

            if (inscritos.Count != estudianteIds.Count)
            {
                return BadRequest("Uno o más estudiantes no pertenecen al curso indicado");
            }

            var existing = await _context.Asistencias
                .Where(a => a.CursoId == dto.CursoId
                            && a.Fecha == fecha
                            && a.Periodo == dto.Periodo
                            && a.AsignaturaId == dto.AsignaturaId
                            && estudianteIds.Contains(a.EstudianteId))
                .ToListAsync();

            var userId = GetUserId();

            foreach (var detalle in dto.Detalles)
            {
                var registro = existing.FirstOrDefault(a => a.EstudianteId == detalle.EstudianteId);
                if (registro == null)
                {
                    registro = new Asistencia
                    {
                        CursoId = dto.CursoId,
                        AsignaturaId = dto.AsignaturaId,
                        EstudianteId = detalle.EstudianteId,
                        Fecha = fecha,
                        Periodo = dto.Periodo,
                        Estado = detalle.Estado,
                        Observacion = detalle.Observacion,
                        RegistradoPorId = userId
                    };
                    _context.Asistencias.Add(registro);
                }
                else
                {
                    registro.Estado = detalle.Estado;
                    registro.Observacion = detalle.Observacion;
                    registro.Periodo = dto.Periodo;
                    registro.AsignaturaId = dto.AsignaturaId;
                    registro.RegistradoPorId = userId;
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("curso/{cursoId:int}")]
        public async Task<IActionResult> GetAsistenciasCurso(
            int cursoId,
            [FromQuery] DateTime? desde,
            [FromQuery] DateTime? hasta,
            [FromQuery] int? periodo,
            [FromQuery] int? asignaturaId)
        {
            IQueryable<Asistencia> query = _context.Asistencias
                .Where(a => a.CursoId == cursoId)
                .Include(a => a.Estudiante)
                .Include(a => a.Asignatura)
                .AsQueryable();

            if (desde.HasValue)
            {
                query = query.Where(a => a.Fecha >= desde.Value.Date);
            }

            if (hasta.HasValue)
            {
                query = query.Where(a => a.Fecha <= hasta.Value.Date);
            }

            if (periodo.HasValue)
            {
                query = query.Where(a => a.Periodo == periodo.Value);
            }

            if (asignaturaId.HasValue)
            {
                query = query.Where(a => a.AsignaturaId == asignaturaId.Value);
            }

            var registros = await query
                .OrderByDescending(a => a.Fecha)
                .ThenBy(a => a.Estudiante.Nombre)
                .Take(500)
                .Select(a => new
                {
                    a.Id,
                    a.Fecha,
                    a.Periodo,
                    a.Estado,
                    a.Observacion,
                    a.AsignaturaId,
                    Asignatura = a.Asignatura != null ? new
                    {
                        a.Asignatura.Id,
                        a.Asignatura.Nombre,
                        a.Asignatura.Codigo
                    } : null,
                    Estudiante = new
                    {
                        a.EstudianteId,
                        a.Estudiante!.Nombre,
                        a.Estudiante.Documento
                    }
                })
                .ToListAsync();

            return Ok(registros);
        }
    }
}
