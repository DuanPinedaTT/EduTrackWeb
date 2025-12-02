using System.Collections.Generic;
using System.Globalization;
using edutrack_academy_api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
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
                        CursoAsignaturaId = n.CursoAsignaturaId ?? n.NotaConfig!.CursoAsignaturaId,
                        CursoNombre = n.NotaConfig!.Curso != null ? n.NotaConfig!.Curso.Nombre : "Curso",
                        GradoNombre = n.NotaConfig!.Curso != null && n.NotaConfig!.Curso.Grado != null
                            ? n.NotaConfig!.Curso.Grado.Nombre
                            : null,
                        n.NotaConfig!.Peso,
                        Valor = n.Valor!.Value
                    })
                    .ToListAsync();

                var cursoPromedios = new List<CursoRendimiento>();
                var estudiantesEnRiesgoSet = new HashSet<int>();

                foreach (var cursoGroup in notaData.GroupBy(x => new { x.CursoId, x.CursoNombre, x.GradoNombre }))
                {
                    var studentSummaries = new List<StudentCourseSummary>();

                    foreach (var studentGroup in cursoGroup.GroupBy(item => item.EstudianteId))
                    {
                        var totalPeso = studentGroup.Sum(item => item.Peso);
                        if (totalPeso <= 0)
                        {
                            continue;
                        }

                        var overallAverage = Math.Round(
                            studentGroup.Sum(item => item.Valor * item.Peso) / totalPeso,
                            2,
                            MidpointRounding.AwayFromZero
                        );

                        var assignmentAverages = studentGroup
                            .GroupBy(item => item.CursoAsignaturaId ?? -1)
                            .Select(assignmentGroup =>
                            {
                                var assignmentPeso = assignmentGroup.Sum(n => n.Peso);
                                if (assignmentPeso <= 0)
                                {
                                    return (decimal?)null;
                                }

                                var assignmentAverage = assignmentGroup.Sum(n => n.Valor * n.Peso) / assignmentPeso;
                                return Math.Round(assignmentAverage, 2, MidpointRounding.AwayFromZero);
                            })
                            .Where(avg => avg.HasValue)
                            .Select(avg => avg!.Value)
                            .ToList();

                        var isRisk = assignmentAverages.Any(avg => avg < PassingScore);

                        var summary = new StudentCourseSummary
                        {
                            EstudianteId = studentGroup.Key,
                            Average = overallAverage,
                            IsRisk = isRisk
                        };

                        if (isRisk)
                        {
                            estudiantesEnRiesgoSet.Add(studentGroup.Key);
                        }

                        studentSummaries.Add(summary);
                    }

                    if (studentSummaries.Count == 0)
                    {
                        continue;
                    }

                    var promedio = Math.Round(
                        studentSummaries.Average(s => s.Average),
                        2,
                        MidpointRounding.AwayFromZero
                    );

                    cursoPromedios.Add(new CursoRendimiento
                    {
                        CursoId = cursoGroup.Key.CursoId,
                        Curso = cursoGroup.Key.CursoNombre,
                        Grado = cursoGroup.Key.GradoNombre,
                        Promedio = promedio,
                        EstudiantesEvaluados = studentSummaries.Count,
                        EstudiantesEnRiesgo = studentSummaries.Count(s => s.IsRisk)
                    });
                }

                var promedioGeneral = cursoPromedios.Count > 0
                    ? Math.Round(cursoPromedios.Average(x => x.Promedio!.Value), 2, MidpointRounding.AwayFromZero)
                    : (decimal?)null;

                var estudiantesEnRiesgo = estudiantesEnRiesgoSet.Count;

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

        private sealed class StudentCourseSummary
        {
            public int EstudianteId { get; set; }
            public decimal Average { get; set; }
            public bool IsRisk { get; set; }
        }
    }
}
