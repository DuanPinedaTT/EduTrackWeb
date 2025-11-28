using System.Globalization;
using edutrack_academy_api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstadisticasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private const decimal PassingScore = 3.5m; // Mantener sincronizado con PASSING_SCORE del dashboard

        public EstadisticasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetEstadisticas()
        {
            try
            {
                var totalDocentes = await _context.Usuarios
                    .Where(u => u.Rol == "docente")
                    .CountAsync();

                var totalCursos = await _context.Cursos.CountAsync();

                var totalEstudiantes = await _context.Estudiantes.CountAsync();

                var cursosSinDocente = await _context.Cursos
                    .CountAsync(c => c.DocenteId == null);

                var estudiantesPorGrado = await _context.Estudiantes
                    .Include(e => e.Grado)
                    .AsNoTracking()
                    .GroupBy(e => new
                    {
                        e.GradoId,
                        Grado = e.Grado != null ? e.Grado.Nombre : "Sin grado"
                    })
                    .Select(g => new
                    {
                        GradoId = g.Key.GradoId,
                        g.Key.Grado,
                        Estudiantes = g.Count()
                    })
                    .OrderByDescending(x => x.Estudiantes)
                    .ToListAsync();

                var cursosPorGrado = await _context.Cursos
                    .Include(c => c.Grado)
                    .AsNoTracking()
                    .GroupBy(c => new
                    {
                        c.GradoId,
                        Grado = c.Grado != null ? c.Grado.Nombre : "Sin grado"
                    })
                    .Select(g => new
                    {
                        GradoId = g.Key.GradoId,
                        g.Key.Grado,
                        Cursos = g.Count()
                    })
                    .OrderByDescending(x => x.Cursos)
                    .ToListAsync();

                var docentesConMayorCarga = await _context.CursoAsignaturas
                    .Include(ca => ca.Docente)
                    .AsNoTracking()
                    .Where(ca => ca.DocenteId != null)
                    .GroupBy(ca => new { ca.DocenteId, Nombre = ca.Docente != null ? ca.Docente.Nombre : "Sin asignar" })
                    .Select(g => new
                    {
                        DocenteId = g.Key.DocenteId!.Value,
                        Docente = g.Key.Nombre,
                        Cursos = g.Select(x => x.CursoId).Distinct().Count(),
                        Asignaturas = g.Count()
                    })
                    .OrderByDescending(x => x.Asignaturas)
                    .ThenByDescending(x => x.Cursos)
                    .Take(6)
                    .ToListAsync();

                var notaData = await _context.Notas
                    .Where(n => n.NotaConfig != null && n.Valor != null)
                    .Select(n => new
                    {
                        n.EstudianteId,
                        CursoId = n.NotaConfig!.CursoId,
                        CursoNombre = n.NotaConfig!.Curso != null ? n.NotaConfig!.Curso.Nombre : "Curso",
                        GradoNombre = n.NotaConfig!.Curso != null && n.NotaConfig!.Curso.Grado != null
                            ? n.NotaConfig!.Curso.Grado.Nombre
                            : null,
                        n.NotaConfig!.Peso,
                        Valor = n.Valor!.Value
                    })
                    .ToListAsync();

                var cursoPromedios = notaData
                    .GroupBy(x => new { x.CursoId, x.CursoNombre, x.GradoNombre })
                    .Select(g =>
                    {
                        var studentAverages = g
                            .GroupBy(n => n.EstudianteId)
                            .Select(studentGroup =>
                            {
                                var totalPeso = studentGroup.Sum(item => item.Peso);
                                if (totalPeso <= 0)
                                {
                                    return (decimal?)null;
                                }

                                var average = studentGroup.Sum(item => item.Valor * item.Peso) / totalPeso;
                                return Math.Round(average, 2, MidpointRounding.AwayFromZero);
                            })
                            .Where(avg => avg.HasValue)
                            .Select(avg => avg!.Value)
                            .ToList();

                        var promedio = studentAverages.Count > 0
                            ? Math.Round(studentAverages.Average(), 2, MidpointRounding.AwayFromZero)
                            : (decimal?)null;

                        return new CursoRendimiento
                        {
                            CursoId = g.Key.CursoId,
                            Curso = g.Key.CursoNombre,
                            Grado = g.Key.GradoNombre,
                            Promedio = promedio,
                            EstudiantesEvaluados = studentAverages.Count,
                            EstudiantesEnRiesgo = studentAverages.Count(score => score < PassingScore)
                        };
                    })
                    .Where(x => x.Promedio.HasValue)
                    .ToList();

                var promedioGeneral = cursoPromedios.Count > 0
                    ? Math.Round(cursoPromedios.Average(x => x.Promedio!.Value), 2, MidpointRounding.AwayFromZero)
                    : (decimal?)null;

                var estudiantesEnRiesgo = cursoPromedios.Sum(x => x.EstudiantesEnRiesgo);

                var cursosConMejorPromedio = cursoPromedios
                    .OrderByDescending(x => x.Promedio)
                    .ThenBy(x => x.Curso)
                    .Take(5)
                    .ToList();

                var cursosConPeorPromedio = cursoPromedios
                    .OrderBy(x => x.Promedio)
                    .ThenBy(x => x.Curso)
                    .Take(5)
                    .ToList();

                return Ok(new
                {
                    totalDocentes,
                    totalCursos,
                    totalEstudiantes,
                    resumenAcademico = new
                    {
                        PromedioGeneral = promedioGeneral,
                        EstudiantesEnRiesgo = estudiantesEnRiesgo,
                        CursosSinDocente = cursosSinDocente
                    },
                    estudiantesPorGrado,
                    cursosPorGrado,
                    docentesConMayorCarga,
                    cursosConMejorPromedio,
                    cursosConPeorPromedio
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error obteniendo estadísticas: {ex.Message}");
            }
        }

        private sealed class CursoRendimiento
        {
            public int CursoId { get; set; }
            public string Curso { get; set; } = string.Empty;
            public string? Grado { get; set; }
            public decimal? Promedio { get; set; }
            public int EstudiantesEvaluados { get; set; }
            public int EstudiantesEnRiesgo { get; set; }
        }
    }
}
