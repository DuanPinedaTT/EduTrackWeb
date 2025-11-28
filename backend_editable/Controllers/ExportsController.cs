using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;
using System.Security.Claims;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        private static readonly (int Id, string Nombre)[] Periodos = new[]
        {
            (1, "Periodo 1"),
            (2, "Periodo 2"),
            (3, "Periodo 3"),
            (4, "Periodo 4")
        };

        public ExportsController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/Exports/course/{courseId}/xlsx
        [HttpGet("course/{courseId}/xlsx")]
        public async Task<IActionResult> ExportCourseExcel(int courseId, [FromQuery] string? docente)
        {
            var curso = await _context.Cursos
                .Include(c => c.Grado)
                .Include(c => c.Docente)
                .Include(c => c.CursoAsignaturas)
                    .ThenInclude(ca => ca.Asignatura)
                .Include(c => c.CursoAsignaturas)
                    .ThenInclude(ca => ca.Docente)
                .FirstOrDefaultAsync(c => c.Id == courseId);
            if (curso == null)
            {
                return NotFound("Curso no encontrado");
            }

            var estudiantes = await _context.Inscripciones
                .Where(i => i.CursoId == courseId)
                .Include(i => i.Estudiante)
                .Select(i => i.Estudiante!)
                .OrderBy(e => e.Nombre)
                .ToListAsync();

            var configs = await _context.NotaConfigs
                .Where(nc => nc.CursoId == courseId)
                .OrderBy(nc => nc.Periodo)
                .ThenBy(nc => nc.Orden)
                .ToListAsync();

            var estudianteIds = estudiantes.Select(e => e.Id).ToList();
            var notas = await _context.Notas
                .Where(n => estudianteIds.Contains(n.EstudianteId))
                .ToListAsync();

            var notaLookup = notas
                .GroupBy(n => new { n.EstudianteId, n.NotaConfigId })
                .ToDictionary(
                    g => (g.Key.EstudianteId, g.Key.NotaConfigId),
                    g => g.First().Valor
                );

            var salonLabel = BuildSalonLabel(curso);
            var asignaturaLabel = BuildAsignaturaLabel(curso);
            var docenteLabel = await ResolveDocenteLabelAsync(docente, curso);
            var generatedAt = DateTime.Now;

            using var workbook = new XLWorkbook();
            foreach (var periodo in Periodos)
            {
                var sheet = workbook.Worksheets.Add(periodo.Nombre);
                BuildPeriodSheet(
                    sheet,
                    periodo,
                    salonLabel,
                    asignaturaLabel,
                    docenteLabel,
                    estudiantes,
                    configs,
                    notaLookup,
                    generatedAt);
            }

            using var ms = new MemoryStream();
            workbook.SaveAs(ms);
            var bytes = ms.ToArray();

            var safeName = "planilla_" + SanitizeFileName(salonLabel ?? curso.Nombre ?? $"curso_{courseId}") + ".xlsx";

            return File(
                bytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                safeName
            );
        }

        private static void BuildPeriodSheet(
            IXLWorksheet sheet,
            (int Id, string Nombre) periodo,
            string salonLabel,
            string asignaturaLabel,
            string docenteLabel,
            IReadOnlyList<Estudiante> estudiantes,
            IReadOnlyList<NotaConfig> configs,
            IReadOnlyDictionary<(int EstudianteId, int NotaConfigId), decimal?> notaLookup,
            DateTime generatedAt)
        {
            var configsPeriodo = configs
                .Where(cfg => cfg.Periodo == periodo.Id)
                .OrderBy(cfg => cfg.Orden)
                .ToList();

            var lastColumn = 2 + Math.Max(0, configsPeriodo.Count) + 1; // estudiante, documento, columnas periodo, promedio
            var rightColumn = Math.Max(2, lastColumn);

            sheet.Style.Font.FontName = "Segoe UI";
            sheet.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

            var titleRange = sheet.Range(1, 1, 1, lastColumn);
            titleRange.Merge();
            titleRange.Value = $"Planilla de notas · {salonLabel}";
            titleRange.Style.Font.SetBold();
            titleRange.Style.Font.FontSize = 15;
            titleRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            titleRange.Style.Fill.SetBackgroundColor(XLColor.FromHtml("#e8edff"));
            titleRange.Style.Font.FontColor = XLColor.FromHtml("#1f2a44");

            sheet.Cell(2, 1).Value = $"Asignatura: {asignaturaLabel}";
            sheet.Cell(2, rightColumn).Value = $"Periodo: {periodo.Nombre}";
            sheet.Cell(3, 1).Value = $"Docente: {docenteLabel}";
            sheet.Cell(3, rightColumn).Value = $"Generado: {generatedAt:dd/MM/yyyy}";

            var metaRange = sheet.Range(2, 1, 3, lastColumn);
            metaRange.Style.Fill.SetBackgroundColor(XLColor.FromHtml("#f8fbff"));
            metaRange.Style.Font.FontColor = XLColor.FromHtml("#475569");
            metaRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;

            var headerRow = 5;
            sheet.Cell(headerRow, 1).Value = "Estudiante";
            sheet.Cell(headerRow, 2).Value = "Documento";

            var currentCol = 3;
            foreach (var cfg in configsPeriodo)
            {
                sheet.Cell(headerRow, currentCol).Value = $"{cfg.Nombre} ({cfg.Peso}%)";
                sheet.Cell(headerRow, currentCol).Style.Alignment.WrapText = true;
                currentCol++;
            }

            sheet.Cell(headerRow, currentCol).Value = "Promedio periodo";
            var headerRange = sheet.Range(headerRow, 1, headerRow, currentCol);
            headerRange.Style.Font.SetBold();
            headerRange.Style.Fill.SetBackgroundColor(XLColor.FromHtml("#dbe3ff"));
            headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            headerRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            headerRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

            sheet.SheetView.FreezeRows(headerRow);
            sheet.SheetView.FreezeColumns(2);

            var noConfigs = !configsPeriodo.Any();
            var hasStudents = estudiantes.Any();

            if (noConfigs)
            {
                RenderInfoRow(sheet, headerRow + 1, currentCol, "Este periodo no tiene evaluaciones configuradas.");
                sheet.Columns(1, currentCol).AdjustToContents();
                return;
            }

            if (!hasStudents)
            {
                RenderInfoRow(sheet, headerRow + 1, currentCol, "No hay estudiantes inscritos en este curso.");
                sheet.Columns(1, currentCol).AdjustToContents();
                return;
            }

            var dataStartRow = headerRow + 1;
            var row = dataStartRow;

            foreach (var est in estudiantes)
            {
                sheet.Cell(row, 1).Value = est.Nombre;
                sheet.Cell(row, 2).Value = est.Documento;

                decimal sumaProductos = 0m;
                decimal sumaPesos = 0m;
                var dataCol = 3;

                foreach (var cfg in configsPeriodo)
                {
                    var cell = sheet.Cell(row, dataCol);
                    if (notaLookup.TryGetValue((est.Id, cfg.Id), out var valor) && valor.HasValue)
                    {
                        var notaValor = Math.Round(valor.Value, 2);
                        cell.Value = notaValor;
                        cell.Style.NumberFormat.Format = "0.00";
                        sumaProductos += cfg.Peso * notaValor;
                        sumaPesos += cfg.Peso;
                    }
                    else
                    {
                        cell.Value = "-";
                        cell.Style.Font.FontColor = XLColor.FromHtml("#94a3b8");
                    }

                    dataCol++;
                }

                var promedioCell = sheet.Cell(row, currentCol);
                if (sumaPesos > 0)
                {
                    var promedio = Math.Round(sumaProductos / sumaPesos, 2);
                    promedioCell.Value = promedio;
                    promedioCell.Style.NumberFormat.Format = "0.00";
                    promedioCell.Style.Font.SetBold();
                }
                else
                {
                    promedioCell.Value = "-";
                    promedioCell.Style.Font.FontColor = XLColor.FromHtml("#94a3b8");
                }

                row++;
            }

            var tableRange = sheet.Range(headerRow, 1, row - 1, currentCol);
            tableRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            tableRange.Style.Border.InsideBorder = XLBorderStyleValues.Hair;

            for (var zebraRow = dataStartRow; zebraRow < row; zebraRow++)
            {
                if ((zebraRow - dataStartRow) % 2 == 1)
                {
                    sheet.Row(zebraRow).Style.Fill.SetBackgroundColor(XLColor.FromHtml("#f6f8ff"));
                }
            }

            sheet.Columns(1, currentCol).AdjustToContents();
        }

        private static void RenderInfoRow(IXLWorksheet sheet, int rowNumber, int lastColumn, string message)
        {
            var range = sheet.Range(rowNumber, 1, rowNumber, lastColumn);
            range.Merge();
            range.Value = message;
            range.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            range.Style.Fill.SetBackgroundColor(XLColor.FromHtml("#fff5f7"));
            range.Style.Font.FontColor = XLColor.FromHtml("#b91c1c");
            range.Style.Border.OutsideBorder = XLBorderStyleValues.Dotted;
        }

        private async Task<string> ResolveDocenteLabelAsync(string? docenteOverride, Curso curso)
        {
            if (!string.IsNullOrWhiteSpace(docenteOverride))
            {
                return docenteOverride.Trim();
            }

            var userIdClaim = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out var userId))
            {
                var usuario = await _context.Usuarios.FindAsync(userId);
                if (usuario != null)
                {
                    return FormatDocente(usuario);
                }
            }

            return BuildDocenteLabel(curso);
        }

        private static string BuildSalonLabel(Curso curso)
        {
            var grado = curso.Grado?.Nombre;
            var baseLabel = !string.IsNullOrWhiteSpace(grado) ? grado : curso.Nombre;
            if (!string.IsNullOrWhiteSpace(curso.Grupo))
            {
                baseLabel = string.IsNullOrWhiteSpace(baseLabel)
                    ? $"Grupo {curso.Grupo}"
                    : $"{baseLabel} {curso.Grupo}";
            }

            return string.IsNullOrWhiteSpace(baseLabel) ? $"Curso #{curso.Id}" : baseLabel;
        }

        private static string BuildAsignaturaLabel(Curso curso)
        {
            var asignaturas = curso.CursoAsignaturas?
                .Select(ca => ca.Asignatura?.Nombre)
                .Where(nombre => !string.IsNullOrWhiteSpace(nombre))
                .Select(nombre => nombre!.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList() ?? new List<string>();

            if (asignaturas.Count == 0)
            {
                return curso.Nombre;
            }

            return asignaturas.Count == 1
                ? asignaturas[0]
                : string.Join(", ", asignaturas);
        }

        private static string BuildDocenteLabel(Curso curso)
        {
            if (curso.Docente != null)
            {
                return FormatDocente(curso.Docente);
            }

            var docentesAsignados = curso.CursoAsignaturas?
                .Select(ca => ca.Docente)
                .Where(doc => doc != null)
                .Select(doc => FormatDocente(doc!))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList() ?? new List<string>();

            if (docentesAsignados.Count == 0)
            {
                return "Sin docente asignado";
            }

            return docentesAsignados.Count == 1
                ? docentesAsignados[0]
                : string.Join(", ", docentesAsignados);
        }

        private static string FormatDocente(Usuario docente)
        {
            var displayName = $"{docente.Nombre} {docente.Apellido}".Trim();
            return string.IsNullOrWhiteSpace(displayName) ? docente.User : displayName;
        }

        private static string SanitizeFileName(string? input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return "planilla";
            }

            var invalidChars = System.IO.Path.GetInvalidFileNameChars();
            var cleaned = new string(input
                .Select(ch => invalidChars.Contains(ch) ? '_' : ch)
                .ToArray());

            cleaned = cleaned.Replace(' ', '_').Trim('_');
            return string.IsNullOrWhiteSpace(cleaned) ? "planilla" : cleaned;
        }
    }
}
