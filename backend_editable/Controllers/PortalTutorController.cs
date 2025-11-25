using System.Security.Claims;
using edutrack_academy_api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "tutor")]
    public class PortalTutorController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PortalTutorController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(raw))
            {
                throw new InvalidOperationException("El token no contiene identificador de usuario");
            }

            return int.Parse(raw);
        }

        private async Task<bool> TutorPuedeVerEstudianteAsync(int tutorId, int estudianteId)
        {
            return await _context.TutorEstudiantes.AnyAsync(te => te.TutorId == tutorId && te.EstudianteId == estudianteId);
        }

        [HttpGet("hijos")]
        public async Task<IActionResult> GetHijos()
        {
            var tutorId = GetUserId();
            var hijos = await _context.TutorEstudiantes
                .Where(te => te.TutorId == tutorId)
                .Include(te => te.Estudiante)
                    .ThenInclude(e => e!.Grado)
                .Select(te => new
                {
                    te.EstudianteId,
                    te.Estudiante!.Nombre,
                    te.Estudiante.Documento,
                    te.Estudiante.Grupo,
                    Grado = te.Estudiante.Grado != null ? te.Estudiante.Grado.Nombre : null,
                    te.Relacion,
                    te.EsPrincipal
                })
                .ToListAsync();

            return Ok(hijos);
        }

        [HttpGet("notas/{estudianteId:int}")]
        public async Task<IActionResult> GetNotas(int estudianteId, [FromQuery] int? periodo)
        {
            var tutorId = GetUserId();
            if (!await TutorPuedeVerEstudianteAsync(tutorId, estudianteId))
            {
                return Forbid();
            }

            var inscripcion = await _context.Inscripciones
                .Where(i => i.EstudianteId == estudianteId)
                .OrderByDescending(i => i.Id)
                .FirstOrDefaultAsync();

            if (inscripcion == null)
            {
                return Ok(new { columnas = Array.Empty<object>(), promedio = (decimal?)null });
            }

            var configsQuery = _context.NotaConfigs
                .Where(nc => nc.CursoId == inscripcion.CursoId);

            if (periodo.HasValue)
            {
                configsQuery = configsQuery.Where(nc => nc.Periodo == periodo.Value);
            }

            var configs = await configsQuery
                .OrderBy(nc => nc.Periodo)
                .ThenBy(nc => nc.Orden)
                .ToListAsync();

            var configIds = configs.Select(c => c.Id).ToList();
            var notas = await _context.Notas
                .Where(n => n.EstudianteId == estudianteId && configIds.Contains(n.NotaConfigId))
                .ToListAsync();

            var columnas = configs.Select(cfg => new
            {
                cfg.Id,
                cfg.Nombre,
                cfg.Peso,
                cfg.Periodo,
                Valor = notas.FirstOrDefault(n => n.NotaConfigId == cfg.Id)?.Valor
            }).ToList();

            var sumaPesos = 0m;
            var sumaProductos = 0m;
            foreach (var columna in columnas)
            {
                if (columna.Valor != null)
                {
                    sumaPesos += columna.Peso;
                    sumaProductos += columna.Valor.Value * columna.Peso;
                }
            }

            var promedio = sumaPesos > 0 ? Math.Round(sumaProductos / sumaPesos, 2) : (decimal?)null;

            return Ok(new
            {
                columnas,
                promedio
            });
        }

        [HttpGet("asistencias/{estudianteId:int}")]
        public async Task<IActionResult> GetAsistencias(int estudianteId, [FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
        {
            var tutorId = GetUserId();
            if (!await TutorPuedeVerEstudianteAsync(tutorId, estudianteId))
            {
                return Forbid();
            }

            var query = _context.Asistencias
                .Where(a => a.EstudianteId == estudianteId);

            if (desde.HasValue)
            {
                query = query.Where(a => a.Fecha >= desde.Value.Date);
            }

            if (hasta.HasValue)
            {
                query = query.Where(a => a.Fecha <= hasta.Value.Date);
            }

            var asistencias = await query
                .OrderByDescending(a => a.Fecha)
                .Take(200)
                .Select(a => new
                {
                    a.Id,
                    a.Fecha,
                    a.Periodo,
                    a.Estado,
                    a.Observacion,
                    Curso = a.Curso.Nombre
                })
                .ToListAsync();

            return Ok(asistencias);
        }

        [HttpGet("comunicaciones")]
        public async Task<IActionResult> GetComunicaciones()
        {
            var tutorId = GetUserId();
            var comunicaciones = await _context.ComunicacionDestinos
                .Where(cd => cd.TutorId == tutorId)
                .OrderByDescending(cd => cd.Comunicacion.CreadaEn)
                .Select(cd => new
                {
                    cd.Id,
                    cd.Leido,
                    cd.LeidoEn,
                    cd.Canal,
                    cd.Comunicacion.Titulo,
                    cd.Comunicacion.Mensaje,
                    cd.Comunicacion.Tipo,
                    cd.Comunicacion.CreadaEn,
                    Remitente = cd.Comunicacion.Remitente.Nombre
                })
                .ToListAsync();

            return Ok(comunicaciones);
        }

        [HttpPost("comunicaciones/{destinoId:int}/leido")]
        public async Task<IActionResult> MarcarComunicacionLeida(int destinoId)
        {
            var tutorId = GetUserId();
            var destino = await _context.ComunicacionDestinos
                .FirstOrDefaultAsync(cd => cd.Id == destinoId && cd.TutorId == tutorId);

            if (destino == null)
            {
                return NotFound();
            }

            if (!destino.Leido)
            {
                destino.Leido = true;
                destino.LeidoEn = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}
