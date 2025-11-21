using edutrack_academy_api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExportsController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/Exports/course/{courseId}/xlsx
        [HttpGet("course/{courseId}/xlsx")]
        public async Task<IActionResult> ExportCourseExcel(int courseId)
        {
            var curso = await _context.Cursos
                .Include(c => c.Grado)
                .FirstOrDefaultAsync(c => c.Id == courseId);
            if (curso == null) return NotFound("Curso no encontrado");

            var estudiantes = await _context.Inscripciones
                .Where(i => i.CursoId == courseId)
                .Include(i => i.Estudiante)
                .Select(i => i.Estudiante!)
                .ToListAsync();

            var configs = await _context.NotaConfigs
                .Where(nc => nc.CursoId == courseId)
                .OrderBy(nc => nc.Orden)
                .ToListAsync();

            var estudianteIds = estudiantes.Select(e => e.Id).ToList();
            var notas = await _context.Notas
                .Where(n => estudianteIds.Contains(n.EstudianteId))
                .ToListAsync();

            using var workbook = new XLWorkbook();
            var sheet = workbook.Worksheets.Add("Planilla");

            // Título
            sheet.Cell(1, 1).Value = "Curso: " + curso.Nombre;
            sheet.Cell(2, 1).Value = "Grado: " + (curso.Grado != null ? curso.Grado.Nombre : "N/A");

            // Encabezados
            int col = 1;
            sheet.Cell(4, col).Value = "Estudiante";
            col = col + 1;
            sheet.Cell(4, col).Value = "Documento";
            col = col + 1;

            foreach (var cfg in configs)
            {
                sheet.Cell(4, col).Value = cfg.Nombre + " (" + cfg.Peso + "%)";
                col = col + 1;
            }
            sheet.Cell(4, col).Value = "Promedio Final";

            // Datos
            int row = 5;
            foreach (var est in estudiantes)
            {
                col = 1;
                sheet.Cell(row, col).Value = est.Nombre;
                col = col + 1;
                sheet.Cell(row, col).Value = est.Documento;
                col = col + 1;

                decimal sumaProductos = 0;
                decimal sumaPesos = 0;

                foreach (var cfg in configs)
                {
                    var nota = notas.FirstOrDefault(n => n.EstudianteId == est.Id && n.NotaConfigId == cfg.Id);
                    if (nota != null && nota.Valor != null)
                    {
                        sheet.Cell(row, col).Value = nota.Valor.Value;
                        sumaProductos = sumaProductos + (nota.Valor.Value * cfg.Peso);
                        sumaPesos = sumaPesos + cfg.Peso;
                    }
                    else
                    {
                        sheet.Cell(row, col).Value = "-";
                    }
                    col = col + 1;
                }

                // Promedio
                if (sumaPesos > 0)
                {
                    decimal promedio = Math.Round(sumaProductos / sumaPesos, 2);
                    sheet.Cell(row, col).Value = promedio;
                }
                else
                {
                    sheet.Cell(row, col).Value = "-";
                }

                row = row + 1;
            }

            sheet.Columns().AdjustToContents();

            using var ms = new MemoryStream();
            workbook.SaveAs(ms);
            var bytes = ms.ToArray();

            return File(
                bytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "planilla_" + curso.Nombre + ".xlsx"
            );
        }
    }
}
