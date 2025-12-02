using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using System.Globalization;
using System.IO;
using System.Security.Claims;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin,docente")]
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
        public async Task<IActionResult> ExportCourseExcel(int courseId, [FromQuery] int? cursoAsignaturaId, [FromQuery] string? docente)
        {
            var snapshot = await BuildCourseSnapshotAsync(courseId, cursoAsignaturaId);
            if (snapshot == null)
            {
                return NotFound("Curso no encontrado");
            }

            var salonLabel = BuildSalonLabel(snapshot.Curso);
            var asignaturaLabel = BuildAsignaturaLabel(snapshot.Curso, snapshot.TargetAsignacion);
            var docenteLabel = await ResolveDocenteLabelAsync(docente, snapshot.Curso, snapshot.TargetAsignacion);
            var generatedAt = DateTime.Now;
            var asignaturaCode = ResolveAsignaturaCode(snapshot.Curso, snapshot.TargetAsignacion);
            var exportLabel = BuildExportLabel(salonLabel, asignaturaLabel, asignaturaCode, snapshot.Curso.Id);

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
                    snapshot.Estudiantes,
                    snapshot.Configs,
                    snapshot.Notas,
                    generatedAt);
            }

            using var ms = new MemoryStream();
            workbook.SaveAs(ms);
            var bytes = ms.ToArray();

            var safeName = SanitizeFileName($"planilla {exportLabel}") + ".xlsx";

            return File(
                bytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                safeName
            );
        }

        // GET /api/Exports/course/{courseId}/pdf
        [HttpGet("course/{courseId}/pdf")]
        public async Task<IActionResult> ExportCoursePdf(int courseId, [FromQuery] int? cursoAsignaturaId, [FromQuery] string? docente)
        {
            var snapshot = await BuildCourseSnapshotAsync(courseId, cursoAsignaturaId);
            if (snapshot == null)
            {
                return NotFound("Curso no encontrado");
            }

            var salonLabel = BuildSalonLabel(snapshot.Curso);
            var asignaturaLabel = BuildAsignaturaLabel(snapshot.Curso, snapshot.TargetAsignacion);
            var docenteLabel = await ResolveDocenteLabelAsync(docente, snapshot.Curso, snapshot.TargetAsignacion);
            var generatedAt = DateTime.Now;
            var asignaturaCode = ResolveAsignaturaCode(snapshot.Curso, snapshot.TargetAsignacion);
            var exportLabel = BuildExportLabel(salonLabel, asignaturaLabel, asignaturaCode, snapshot.Curso.Id);

                using var document = new PdfDocument();
                using var logoImage = LoadLogoImage();
            foreach (var periodo in Periodos)
            {
                var page = document.AddPage();
                page.Size = PdfSharpCore.PageSize.A4;
                using var gfx = XGraphics.FromPdfPage(page);
                RenderPeriodPdfPage(
                    gfx,
                    page,
                    periodo,
                    salonLabel,
                    asignaturaLabel,
                    docenteLabel,
                    snapshot.Estudiantes,
                    snapshot.Configs,
                    snapshot.Notas,
                    generatedAt,
                    logoImage);
            }

            using var ms = new MemoryStream();
            document.Save(ms, false);
            var bytes = ms.ToArray();

            var safeName = SanitizeFileName($"planilla {exportLabel}") + ".pdf";

            return File(bytes, "application/pdf", safeName);
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
                sheet.Cell(headerRow, currentCol).Value = cfg.Nombre;
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

        private static void RenderPeriodPdfPage(
            XGraphics gfx,
            PdfPage page,
            (int Id, string Nombre) periodo,
            string salonLabel,
            string asignaturaLabel,
            string docenteLabel,
            IReadOnlyList<Estudiante> estudiantes,
            IReadOnlyList<NotaConfig> configs,
            IReadOnlyDictionary<(int EstudianteId, int NotaConfigId), decimal?> notaLookup,
            DateTime generatedAt,
            XImage? logoImage)
        {
            const double margin = 40;
            const double rowHeight = 16;

            var configsPeriodo = configs
                .Where(cfg => cfg.Periodo == periodo.Id)
                .OrderBy(cfg => cfg.Orden)
                .ToList();

            var titleFont = new XFont("Segoe UI", 18, XFontStyle.Bold);
            var metaFont = new XFont("Segoe UI", 11, XFontStyle.Regular);
            var infoFont = new XFont("Segoe UI", 11, XFontStyle.Italic);
            var headerFont = new XFont("Segoe UI", 10, XFontStyle.Bold);
            var cellFont = new XFont("Segoe UI", 9, XFontStyle.Regular);

            double y = margin;

            if (logoImage != null)
            {
                const double maxLogoWidth = 180;
                var naturalWidth = Math.Max(1d, logoImage.PointWidth);
                var logoWidth = Math.Min(maxLogoWidth, naturalWidth);
                var scale = logoWidth / naturalWidth;
                var logoHeight = logoImage.PointHeight * scale;
                var logoX = (page.Width - logoWidth) / 2;
                var logoRect = new XRect(logoX, y, logoWidth, logoHeight);
                gfx.DrawImage(logoImage, logoRect);
                y += logoHeight + 10;
            }

            var titleRect = new XRect(margin, y, page.Width - margin * 2, 28);
            gfx.DrawString($"Planilla de notas · {salonLabel}", titleFont, XBrushes.Navy, titleRect, XStringFormats.TopCenter);
            y += titleRect.Height + 6;

            var metaLeftFormat = new XStringFormat { Alignment = XStringAlignment.Near, LineAlignment = XLineAlignment.Near };
            var metaRightFormat = new XStringFormat { Alignment = XStringAlignment.Far, LineAlignment = XLineAlignment.Near };

            gfx.DrawString($"Asignatura: {asignaturaLabel}", metaFont, XBrushes.Black, new XPoint(margin, y), metaLeftFormat);
            gfx.DrawString($"Periodo: {periodo.Nombre}", metaFont, XBrushes.Black, new XPoint(page.Width - margin, y), metaRightFormat);
            y += 18;
            gfx.DrawString($"Docente: {docenteLabel}", metaFont, XBrushes.Black, new XPoint(margin, y), metaLeftFormat);
            gfx.DrawString($"Generado: {generatedAt:dd/MM/yyyy}", metaFont, XBrushes.Black, new XPoint(page.Width - margin, y), metaRightFormat);
            y += 26;

            if (!configsPeriodo.Any())
            {
                var noConfigRect = new XRect(margin, y, page.Width - margin * 2, 40);
                gfx.DrawString("Este periodo no tiene evaluaciones configuradas.", infoFont, XBrushes.Gray, noConfigRect, XStringFormats.TopLeft);
                return;
            }

            if (!estudiantes.Any())
            {
                var noStudentsRect = new XRect(margin, y, page.Width - margin * 2, 40);
                gfx.DrawString("No hay estudiantes inscritos en este curso.", infoFont, XBrushes.Gray, noStudentsRect, XStringFormats.TopLeft);
                return;
            }

            var tableWidth = page.Width - margin * 2;
            var studentWidth = tableWidth * 0.32;
            var documentWidth = tableWidth * 0.18;
            var remainingWidth = tableWidth - studentWidth - documentWidth;
            var dynamicColumns = Math.Max(1, configsPeriodo.Count + 1); // at least promedio column
            var dynamicWidth = remainingWidth / dynamicColumns;

            var columnWidths = new List<double>
            {
                studentWidth,
                documentWidth
            };

            columnWidths.AddRange(Enumerable.Repeat(dynamicWidth, configsPeriodo.Count + 1));

            var headers = new List<string> { "Estudiante", "Documento" };
            headers.AddRange(configsPeriodo.Select(cfg => cfg.Nombre));
            headers.Add("Promedio");

            var headerBrush = new XSolidBrush(XColor.FromArgb(230, 235, 255));
            var tablePen = new XPen(XColor.FromArgb(160, 203, 213, 225), 0.6);

            double currentX = margin;
            for (var col = 0; col < headers.Count; col++)
            {
                var cellRect = new XRect(currentX, y, columnWidths[col], rowHeight + 4);
                gfx.DrawRectangle(headerBrush, cellRect);
                gfx.DrawRectangle(tablePen, cellRect);

                var format = new XStringFormat
                {
                    Alignment = col <= 1 ? XStringAlignment.Near : XStringAlignment.Center,
                    LineAlignment = XLineAlignment.Center
                };

                var paddedRect = new XRect(cellRect.X + 4, cellRect.Y + 1, cellRect.Width - 8, cellRect.Height - 2);
                gfx.DrawString(headers[col], headerFont, XBrushes.Navy, paddedRect, format);

                currentX += columnWidths[col];
            }
            y += rowHeight + 4;

            foreach (var est in estudiantes)
            {
                if (y + rowHeight > page.Height - margin)
                {
                    var warningRect = new XRect(margin, page.Height - margin - 24, tableWidth, 24);
                    gfx.DrawString("Se truncó la tabla por falta de espacio en la página.", infoFont, XBrushes.DarkGray, warningRect, XStringFormats.CenterLeft);
                    break;
                }

                currentX = margin;
                var cells = new List<string>
                {
                    est.Nombre ?? "—",
                    string.IsNullOrWhiteSpace(est.Documento) ? "—" : est.Documento!
                };

                decimal sumaProductos = 0m;
                decimal sumaPesos = 0m;

                foreach (var cfg in configsPeriodo)
                {
                    string cellValue = "-";
                    if (notaLookup.TryGetValue((est.Id, cfg.Id), out var valor) && valor.HasValue)
                    {
                        var notaValor = Math.Round(valor.Value, 2);
                        cellValue = notaValor.ToString("0.00", CultureInfo.InvariantCulture);
                        sumaProductos += cfg.Peso * notaValor;
                        sumaPesos += cfg.Peso;
                    }

                    cells.Add(cellValue);
                }

                var promedio = sumaPesos > 0
                    ? Math.Round(sumaProductos / sumaPesos, 2).ToString("0.00", CultureInfo.InvariantCulture)
                    : "-";
                cells.Add(promedio);

                for (var col = 0; col < cells.Count; col++)
                {
                    var rect = new XRect(currentX, y, columnWidths[col], rowHeight);
                    gfx.DrawRectangle(tablePen, rect);

                    var format = new XStringFormat
                    {
                        Alignment = col <= 1 ? XStringAlignment.Near : XStringAlignment.Center,
                        LineAlignment = XLineAlignment.Center
                    };

                    var textRect = new XRect(rect.X + 4, rect.Y, rect.Width - 8, rect.Height);
                    gfx.DrawString(cells[col], cellFont, XBrushes.Black, textRect, format);

                    currentX += columnWidths[col];
                }

                y += rowHeight;
            }
        }

        private static XImage? LoadLogoImage()
        {
            try
            {
                var baseDir = AppContext.BaseDirectory;
                var candidates = new[]
                {
                    Path.Combine(baseDir, "Assets", "logo-azul-relleno-grande.png"),
                    Path.Combine(baseDir, "wwwroot", "logo-azul-relleno-grande.png")
                };

                foreach (var path in candidates)
                {
                    if (System.IO.File.Exists(path))
                    {
                        return XImage.FromFile(path);
                    }
                }
            }
            catch
            {
                // ignored - logo is optional
            }

            return null;
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

        private async Task<string> ResolveDocenteLabelAsync(string? docenteOverride, Curso curso, CursoAsignatura? targetAsignacion)
        {
            if (!string.IsNullOrWhiteSpace(docenteOverride))
            {
                return docenteOverride.Trim();
            }

             if (targetAsignacion?.Docente != null)
             {
                 return FormatDocente(targetAsignacion.Docente);
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

            return BuildDocenteLabel(curso, targetAsignacion);
        }

        private class CourseSnapshot
        {
            public required Curso Curso { get; init; }
            public required List<Estudiante> Estudiantes { get; init; }
            public required List<NotaConfig> Configs { get; init; }
            public required Dictionary<(int EstudianteId, int NotaConfigId), decimal?> Notas { get; init; }
            public CursoAsignatura? TargetAsignacion { get; init; }
        }

        private async Task<CourseSnapshot?> BuildCourseSnapshotAsync(int courseId, int? cursoAsignaturaId)
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
                return null;
            }

            CursoAsignatura? targetAsignacion = null;
            if (cursoAsignaturaId.HasValue)
            {
                targetAsignacion = curso.CursoAsignaturas?
                    .FirstOrDefault(ca => ca.Id == cursoAsignaturaId.Value);

                if (targetAsignacion == null)
                {
                    return null;
                }
            }

            var estudiantes = await _context.Inscripciones
                .Where(i => i.CursoId == courseId)
                .Include(i => i.Estudiante)
                .Select(i => i.Estudiante!)
                .OrderBy(e => e.Nombre)
                .ToListAsync();

            var configsQuery = _context.NotaConfigs
                .Where(nc => nc.CursoId == courseId);

            if (cursoAsignaturaId.HasValue)
            {
                configsQuery = configsQuery.Where(nc => nc.CursoAsignaturaId == cursoAsignaturaId.Value);
            }

            var configs = await configsQuery
                .OrderBy(nc => nc.Periodo)
                .ThenBy(nc => nc.Orden)
                .ToListAsync();

            var estudianteIds = estudiantes.Select(e => e.Id).ToList();
            var notasQuery = _context.Notas
                .Where(n => estudianteIds.Contains(n.EstudianteId));

            if (cursoAsignaturaId.HasValue)
            {
                notasQuery = notasQuery.Where(n => n.CursoAsignaturaId == cursoAsignaturaId.Value);
            }

            var notas = await notasQuery
                .ToListAsync();

            var notaLookup = notas
                .GroupBy(n => new { n.EstudianteId, n.NotaConfigId })
                .ToDictionary(
                    g => (g.Key.EstudianteId, g.Key.NotaConfigId),
                    g => g.First().Valor
                );

            return new CourseSnapshot
            {
                Curso = curso,
                Estudiantes = estudiantes,
                Configs = configs,
                Notas = notaLookup,
                TargetAsignacion = targetAsignacion
            };
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

        private static string BuildAsignaturaLabel(Curso curso, CursoAsignatura? targetAsignacion)
        {
            if (targetAsignacion?.Asignatura != null)
            {
                return targetAsignacion.Asignatura.Nombre;
            }

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

        private static string BuildExportLabel(string? salonLabel, string? asignaturaLabel, string? asignaturaCode, int cursoId)
        {
            var baseLabel = !string.IsNullOrWhiteSpace(salonLabel)
                ? salonLabel!.Trim()
                : $"Curso {cursoId}";

            string? detalle = null;
            if (!string.IsNullOrWhiteSpace(asignaturaCode))
            {
                detalle = asignaturaCode!.Trim().ToUpperInvariant();
            }
            else if (!string.IsNullOrWhiteSpace(asignaturaLabel))
            {
                detalle = asignaturaLabel!.Trim();
            }

            return detalle == null ? baseLabel : $"{baseLabel} {detalle}";
        }

        private static string? ResolveAsignaturaCode(Curso curso, CursoAsignatura? targetAsignacion)
        {
            if (!string.IsNullOrWhiteSpace(targetAsignacion?.Asignatura?.Codigo))
            {
                return targetAsignacion.Asignatura!.Codigo!.Trim();
            }

            return curso.CursoAsignaturas?
                .Select(ca => ca.Asignatura?.Codigo)
                .FirstOrDefault(codigo => !string.IsNullOrWhiteSpace(codigo))?
                .Trim();
        }

        private static string BuildDocenteLabel(Curso curso, CursoAsignatura? targetAsignacion)
        {
            if (targetAsignacion?.Docente != null)
            {
                return FormatDocente(targetAsignacion.Docente);
            }

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
                .Select(ch => invalidChars.Contains(ch) ? ' ' : ch)
                .ToArray());

            cleaned = string.Join(" ", cleaned
                .Split(' ', StringSplitOptions.RemoveEmptyEntries));

            return string.IsNullOrWhiteSpace(cleaned) ? "planilla" : cleaned;
        }
    }
}
