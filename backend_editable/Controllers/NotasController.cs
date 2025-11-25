using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
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

    public class PeriodoCursoDetalleDTO
    {
        public int Periodo { get; set; }
        public int Evaluaciones { get; set; }
        public decimal PesoTotal { get; set; }
        public List<string> Actividades { get; set; } = new();
    }

    public class CursoPeriodoResumenDTO
    {
        public int CursoId { get; set; }
        public string CursoNombre { get; set; } = string.Empty;
        public string? GradoNombre { get; set; }
        public string? DocenteNombre { get; set; }
        public bool EstaCompleto { get; set; }
        public int TotalEvaluaciones { get; set; }
        public List<PeriodoCursoDetalleDTO> Periodos { get; set; } = new();
    }

    public class PeriodosDashboardDTO
    {
        public int PeriodoActual { get; set; }
        public DateTime InicioPeriodoActual { get; set; }
        public DateTime FinPeriodoActual { get; set; }
        public int DiasRestantes { get; set; }
        public int TotalPeriodosConfigurados { get; set; }
        public int CursosConConfig { get; set; }
        public int EvaluacionesRegistradas { get; set; }
        public List<CursoPeriodoResumenDTO> Cursos { get; set; } = new();
    }

    [ApiController]
    [Route("api/[controller]")]
    public class NotasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotasController(AppDbContext context)
        {
            _context = context;
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

        // GET /api/Notas/periodos/resumen
        [HttpGet("periodos/resumen")]
        public async Task<IActionResult> GetPeriodosResumen()
        {
            var configs = await _context.NotaConfigs
                .Select(nc => new
                {
                    nc.Id,
                    nc.CursoId,
                    CursoNombre = nc.Curso != null ? nc.Curso.Nombre : string.Empty,
                    CursoGrupo = nc.Curso != null ? nc.Curso.Grupo : string.Empty,
                    DocenteNombre = nc.Curso != null && nc.Curso.Docente != null ? nc.Curso.Docente.Nombre : null,
                    GradoNombre = nc.Curso != null && nc.Curso.Grado != null ? nc.Curso.Grado.Nombre : null,
                    nc.Periodo,
                    nc.Nombre,
                    nc.Peso
                })
                .ToListAsync();

            var cursos = configs
                .GroupBy(c => new { c.CursoId, c.CursoNombre, c.CursoGrupo, c.DocenteNombre, c.GradoNombre })
                .Select(g =>
                {
                    var periodos = g
                        .GroupBy(x => x.Periodo)
                        .OrderBy(pg => pg.Key)
                        .Select(pg => new PeriodoCursoDetalleDTO
                        {
                            Periodo = pg.Key,
                            Evaluaciones = pg.Count(),
                            PesoTotal = pg.Sum(x => x.Peso),
                            Actividades = pg.Select(x => x.Nombre).ToList()
                        })
                        .ToList();

                    var cursoNombre = string.IsNullOrWhiteSpace(g.Key.CursoGrupo)
                        ? g.Key.CursoNombre
                        : $"{g.Key.CursoNombre} {g.Key.CursoGrupo}";

                    var estaCompleto = periodos.Count > 0 && periodos.All(p => p.PesoTotal >= 100);

                    return new CursoPeriodoResumenDTO
                    {
                        CursoId = g.Key.CursoId,
                        CursoNombre = cursoNombre,
                        GradoNombre = g.Key.GradoNombre,
                        DocenteNombre = g.Key.DocenteNombre,
                        EstaCompleto = estaCompleto,
                        TotalEvaluaciones = g.Count(),
                        Periodos = periodos
                    };
                })
                .OrderBy(c => c.CursoNombre)
                .ToList();

            var hoy = DateTime.Now.Date;
            var periodoActual = ((hoy.Month - 1) / 3) + 1;
            if (periodoActual < 1) periodoActual = 1;
            if (periodoActual > 4) periodoActual = 4;

            var (inicio, fin) = ObtenerRangoPeriodo(hoy.Year, periodoActual);
            var diasRestantes = Math.Max(0, (fin - hoy).Days);

            var dashboard = new PeriodosDashboardDTO
            {
                PeriodoActual = periodoActual,
                InicioPeriodoActual = inicio,
                FinPeriodoActual = fin,
                DiasRestantes = diasRestantes,
                TotalPeriodosConfigurados = configs.Select(c => c.Periodo).Distinct().Count(),
                CursosConConfig = cursos.Count,
                EvaluacionesRegistradas = configs.Count,
                Cursos = cursos
            };

            return Ok(dashboard);
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
            return Ok();
        }

        private static (DateTime inicio, DateTime fin) ObtenerRangoPeriodo(int anio, int periodo)
        {
            var periodoNormalizado = Math.Max(1, Math.Min(4, periodo));
            var mesInicio = (periodoNormalizado - 1) * 3 + 1;
            var inicio = new DateTime(anio, mesInicio, 1);
            var fin = inicio.AddMonths(3).AddDays(-1);
            return (inicio, fin);
        }
    }
}
