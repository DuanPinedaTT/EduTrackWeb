using System.IO;
using ClosedXML.Excel;
using EduTrack.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExportsController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public ExportsController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("course/{courseId:int}/xlsx")]
    public async Task<IActionResult> ExportCourse(int courseId, CancellationToken cancellationToken)
    {
        var curso = await _dbContext.Cursos
            .Include(c => c.Grado)
            .FirstOrDefaultAsync(c => c.Id == courseId, cancellationToken);

        if (curso is null)
        {
            return NotFound("Curso no encontrado.");
        }

        var estudiantes = await _dbContext.Inscripciones
            .Where(i => i.CursoId == courseId)
            .Include(i => i.Estudiante)
            .Select(i => i.Estudiante!)
            .ToListAsync(cancellationToken);

        var configs = await _dbContext.NotaConfigs
            .Where(nc => nc.CursoId == courseId)
            .OrderBy(nc => nc.Periodo)
            .ThenBy(nc => nc.Orden)
            .ToListAsync(cancellationToken);

        var estudianteIds = estudiantes.Select(e => e.Id).ToList();
        var notas = await _dbContext.Notas
            .Where(n => estudianteIds.Contains(n.EstudianteId))
            .ToListAsync(cancellationToken);

        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Planilla");

        sheet.Cell(1, 1).Value = $"Curso: {curso.Nombre}";
        sheet.Cell(2, 1).Value = $"Grado: {curso.Grado?.Nombre ?? "N/A"}";

        sheet.Cell(4, 1).Value = "Estudiante";
        sheet.Cell(4, 2).Value = "Documento";

        var columnIndex = 3;
        foreach (var cfg in configs)
        {
            sheet.Cell(4, columnIndex).Value = $"{cfg.Nombre} ({cfg.Peso}%)";
            columnIndex++;
        }
        sheet.Cell(4, columnIndex).Value = "Promedio Final";

        var rowIndex = 5;
        foreach (var estudiante in estudiantes)
        {
            columnIndex = 1;
            sheet.Cell(rowIndex, columnIndex++).Value = estudiante.Nombre;
            sheet.Cell(rowIndex, columnIndex++).Value = estudiante.Documento;

            decimal sumaProductos = 0;
            decimal sumaPesos = 0;

            foreach (var cfg in configs)
            {
                var nota = notas.FirstOrDefault(n => n.EstudianteId == estudiante.Id && n.NotaConfigId == cfg.Id);
                if (nota?.Valor is decimal valor)
                {
                    sheet.Cell(rowIndex, columnIndex).Value = valor;
                    sumaProductos += valor * cfg.Peso;
                    sumaPesos += cfg.Peso;
                }
                else
                {
                    sheet.Cell(rowIndex, columnIndex).Value = "-";
                }
                columnIndex++;
            }

            sheet.Cell(rowIndex, columnIndex).Value = sumaPesos > 0
                ? Math.Round(sumaProductos / sumaPesos, 2)
                : "-";

            rowIndex++;
        }

        sheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);

        return File(
            stream.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"planilla_{SanitizeFileName(curso.Nombre)}.xlsx");
    }

    private static string SanitizeFileName(string fileName)
    {
        foreach (var invalid in Path.GetInvalidFileNameChars())
        {
            fileName = fileName.Replace(invalid, '_');
        }
        return fileName;
    }
}
