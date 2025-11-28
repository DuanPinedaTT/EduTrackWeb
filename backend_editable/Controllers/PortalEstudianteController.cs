using System.Security.Claims;
using edutrack_academy_api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortalEstudianteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PortalEstudianteController(AppDbContext context)
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

        private async Task<Models.Estudiante?> GetCurrentStudentAsync()
        {
            var userId = GetUserId();
            return await _context.Estudiantes
                .Include(e => e.Grado)
                .FirstOrDefaultAsync(e => e.UsuarioId == userId);
        }

        [HttpGet("resumen")]
        public async Task<IActionResult> GetResumen()
        {
            var estudiante = await GetCurrentStudentAsync();
            if (estudiante == null)
            {
                return NotFound("No se encontró el estudiante asociado a este usuario");
            }

            var inscripcion = await _context.Inscripciones
                .Where(i => i.EstudianteId == estudiante.Id)
                .Include(i => i.Curso)
                    .ThenInclude(c => c!.Grado)
                .OrderByDescending(i => i.Id)
                .FirstOrDefaultAsync();

            decimal? promedioGeneral = null;
            int? cursoId = inscripcion?.CursoId;

            if (cursoId.HasValue)
            {
                var configs = await _context.NotaConfigs
                    .Where(nc => nc.CursoId == cursoId)
                    .ToListAsync();

                var configIds = configs.Select(c => c.Id).ToList();
                var notas = await _context.Notas
                    .Where(n => n.EstudianteId == estudiante.Id && configIds.Contains(n.NotaConfigId))
                    .ToListAsync();

                var sumaPesos = 0m;
                var sumaProductos = 0m;

                foreach (var cfg in configs)
                {
                    var nota = notas.FirstOrDefault(n => n.NotaConfigId == cfg.Id);
                    if (nota?.Valor != null)
                    {
                        sumaPesos += cfg.Peso;
                        sumaProductos += nota.Valor.Value * cfg.Peso;
                    }
                }

                if (sumaPesos > 0)
                {
                    promedioGeneral = Math.Round(sumaProductos / sumaPesos, 2);
                }
            }

            var ultimasAsistencias = await _context.Asistencias
                .Where(a => a.EstudianteId == estudiante.Id)
                .OrderByDescending(a => a.Fecha)
                .Take(5)
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

            var ultimasComunicaciones = await _context.ComunicacionDestinos
                .Where(cd => cd.EstudianteId == estudiante.Id)
                .OrderByDescending(cd => cd.Comunicacion.CreadaEn)
                .Take(5)
                .Select(cd => new
                {
                    cd.Id,
                    cd.Leido,
                    cd.Canal,
                    cd.Comunicacion.Titulo,
                    cd.Comunicacion.Tipo,
                    cd.Comunicacion.CreadaEn,
                    Remitente = cd.Comunicacion.Remitente.Nombre,
                    RemitenteNombre = cd.Comunicacion.Remitente.Nombre,
                    DocenteNombre = cd.Comunicacion.Remitente.Nombre,
                    Curso = cd.Comunicacion.Curso != null ? new
                    {
                        cd.Comunicacion.Curso.Id,
                        cd.Comunicacion.Curso.Nombre
                    } : null
                })
                .ToListAsync();

            return Ok(new
            {
                estudiante = new
                {
                    estudiante.Id,
                    estudiante.Nombre,
                    estudiante.Documento,
                    Grado = estudiante.Grado?.Nombre,
                    estudiante.Grupo
                },
                curso = inscripcion?.Curso != null ? new
                {
                    inscripcion.Curso.Id,
                    inscripcion.Curso.Nombre,
                    inscripcion.Curso.Grupo,
                    Grado = inscripcion.Curso.Grado?.Nombre
                } : null,
                promedioGeneral,
                ultimasAsistencias,
                ultimasComunicaciones
            });
        }

        [HttpGet("notas")]
        public async Task<IActionResult> GetNotas([FromQuery] int? periodo, [FromQuery] int? cursoId, [FromQuery] int? cursoAsignaturaId)
        {
            var estudiante = await GetCurrentStudentAsync();
            if (estudiante == null)
            {
                return NotFound("No se encontró el estudiante asociado a este usuario");
            }

            var cursoIds = await _context.Inscripciones
                .Where(i => i.EstudianteId == estudiante.Id)
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
                    cursoId = (int?)null,
                    cursoAsignaturaId = (int?)null
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
                return BadRequest("No se encontraron materias disponibles para mostrar notas");
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
                .Where(n => n.EstudianteId == estudiante.Id && configIds.Contains(n.NotaConfigId));

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
                periodo = periodo,
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

        [HttpGet("asistencias")]
        public async Task<IActionResult> GetAsistencias([FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
        {
            var estudiante = await GetCurrentStudentAsync();
            if (estudiante == null)
            {
                return NotFound("No se encontró el estudiante asociado a este usuario");
            }

            var query = _context.Asistencias
                .Where(a => a.EstudianteId == estudiante.Id);

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
            var estudiante = await GetCurrentStudentAsync();
            if (estudiante == null)
            {
                return NotFound("No se encontró el estudiante asociado a este usuario");
            }

            var comunicaciones = await _context.ComunicacionDestinos
                .Where(cd => cd.EstudianteId == estudiante.Id)
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
            var estudiante = await GetCurrentStudentAsync();
            if (estudiante == null)
            {
                return NotFound("No se encontró el estudiante asociado a este usuario");
            }

            var destino = await _context.ComunicacionDestinos
                .FirstOrDefaultAsync(cd => cd.Id == destinoId && cd.EstudianteId == estudiante.Id);

            if (destino == null)
            {
                return NotFound("No se encontró la comunicación");
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
