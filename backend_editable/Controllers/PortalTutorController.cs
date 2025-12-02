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
        public async Task<IActionResult> GetNotas(int estudianteId, [FromQuery] int? periodo, [FromQuery] int? cursoId, [FromQuery] int? cursoAsignaturaId)
        {
            var tutorId = GetUserId();
            if (!await TutorPuedeVerEstudianteAsync(tutorId, estudianteId))
            {
                return Forbid();
            }

            var cursoIds = await _context.Inscripciones
                .Where(i => i.EstudianteId == estudianteId)
                .Select(i => i.CursoId)
                .Distinct()
                .ToListAsync();

            if (cursoIds.Count == 0)
            {
                return Ok(new
                {
                    materias = Array.Empty<object>(),
                    columnas = Array.Empty<object>(),
                    promedio = (decimal?)null,
                    cursoId = (int?)null
                });
            }

            var cursos = await _context.Cursos
                .Where(c => cursoIds.Contains(c.Id))
                .Include(c => c.Grado)
                .Include(c => c.CursoAsignaturas)
                    .ThenInclude(ca => ca.Asignatura)
                .ToListAsync();

            var materias = new List<MateriaItem>();

            foreach (var curso in cursos)
            {
                if (curso.CursoAsignaturas != null && curso.CursoAsignaturas.Count > 0)
                {
                    foreach (var asignacion in curso.CursoAsignaturas)
                    {
                        materias.Add(new MateriaItem
                        {
                            Id = asignacion.Id,
                            CursoId = curso.Id,
                            CursoAsignaturaId = asignacion.Id,
                            Nombre = asignacion.Asignatura?.Nombre ?? curso.Nombre,
                            Curso = curso.Nombre,
                            Grupo = curso.Grupo,
                            Grado = curso.Grado?.Nombre
                        });
                    }
                }
                else
                {
                    materias.Add(new MateriaItem
                    {
                        Id = curso.Id,
                        CursoId = curso.Id,
                        CursoAsignaturaId = null,
                        Nombre = curso.Nombre,
                        Curso = curso.Nombre,
                        Grupo = curso.Grupo,
                        Grado = curso.Grado?.Nombre
                    });
                }
            }

            materias = materias
                .OrderBy(m => m.Nombre)
                .ThenBy(m => m.Grupo)
                .ToList();

            if (materias.Count == 0)
            {
                return Ok(new
                {
                    materias = Array.Empty<object>(),
                    columnas = Array.Empty<object>(),
                    promedio = (decimal?)null,
                    cursoId = (int?)null,
                    cursoAsignaturaId = (int?)null
                });
            }

            MateriaItem? materiaSeleccionada = null;

            if (cursoAsignaturaId.HasValue)
            {
                materiaSeleccionada = materias.FirstOrDefault(m => m.CursoAsignaturaId == cursoAsignaturaId.Value);
            }

            if (materiaSeleccionada == null && cursoId.HasValue)
            {
                materiaSeleccionada = materias.FirstOrDefault(m => m.CursoId == cursoId.Value);
            }

            materiaSeleccionada ??= materias.First();

            if (materiaSeleccionada == null)
            {
                return BadRequest("No se encontraron materias disponibles");
            }

            var cursoSeleccionadoId = materiaSeleccionada.CursoId;
            var cursoAsignaturaSeleccionadaId = materiaSeleccionada.CursoAsignaturaId;
            var cursoTieneAsignaciones = materias.Any(m => m.CursoId == cursoSeleccionadoId && m.CursoAsignaturaId != null);

            var configsQuery = _context.NotaConfigs
                .Where(nc => nc.CursoId == cursoSeleccionadoId);

            if (periodo.HasValue)
            {
                configsQuery = configsQuery.Where(nc => nc.Periodo == periodo.Value);
            }

            if (cursoAsignaturaSeleccionadaId.HasValue)
            {
                configsQuery = configsQuery.Where(nc => nc.CursoAsignaturaId == cursoAsignaturaSeleccionadaId.Value);
            }
            else if (cursoTieneAsignaciones)
            {
                configsQuery = configsQuery.Where(nc => nc.CursoAsignaturaId == null);
            }

            var configs = await configsQuery
                .OrderBy(nc => nc.Periodo)
                .ThenBy(nc => nc.Orden)
                .ToListAsync();

            if (configs.Count == 0)
            {
                return Ok(new
                {
                    materias,
                    cursoId = cursoSeleccionadoId,
                    cursoAsignaturaId = cursoAsignaturaSeleccionadaId,
                    columnas = Array.Empty<object>(),
                    promedio = (decimal?)null
                });
            }

            var configIds = configs.Select(c => c.Id).ToList();
            var notasQuery = _context.Notas
                .Where(n => n.EstudianteId == estudianteId && configIds.Contains(n.NotaConfigId));

            if (cursoAsignaturaSeleccionadaId.HasValue)
            {
                notasQuery = notasQuery.Where(n => n.CursoAsignaturaId == cursoAsignaturaSeleccionadaId.Value);
            }
            else if (cursoTieneAsignaciones)
            {
                notasQuery = notasQuery.Where(n => n.CursoAsignaturaId == null);
            }

            var notas = await notasQuery.ToListAsync();

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
                cursoId = cursoSeleccionadoId,
                cursoAsignaturaId = cursoAsignaturaSeleccionadaId,
                periodo,
                materias,
                columnas,
                promedio
            });
        }

        private sealed class MateriaItem
        {
            public required int Id { get; init; }
            public required int CursoId { get; init; }
            public int? CursoAsignaturaId { get; init; }
            public required string Nombre { get; init; }
            public string? Curso { get; init; }
            public string? Grado { get; init; }
            public string? Grupo { get; init; }
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
                    Remitente = cd.Comunicacion.Remitente.Nombre,
                    RemitenteNombre = cd.Comunicacion.Remitente.Nombre,
                    DocenteNombre = cd.Comunicacion.Remitente.Nombre
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
