using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PeriodosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PeriodosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPeriodos()
        {
            var periodos = await _context.PeriodosAcademicos
                .OrderBy(p => p.Orden)
                .Select(p => new
                {
                    p.Id,
                    p.Nombre,
                    p.FechaInicio,
                    p.FechaFin,
                    p.Activo,
                    p.Orden
                })
                .ToListAsync();
            return Ok(periodos);
        }

        [HttpGet("activo")]
        public async Task<IActionResult> GetPeriodoActivo()
        {
            var periodo = await _context.PeriodosAcademicos.FirstOrDefaultAsync(p => p.Activo);
            if (periodo == null) return NotFound("No hay un periodo activo definido");
            return Ok(periodo);
        }

        [HttpPost]
        public async Task<IActionResult> CrearPeriodo([FromBody] PeriodoAcademico periodo)
        {
            if (periodo.Orden <= 0)
            {
                periodo.Orden = await _context.PeriodosAcademicos.CountAsync() + 1;
            }

            periodo.Activo = false;
            _context.PeriodosAcademicos.Add(periodo);
            await _context.SaveChangesAsync();
            return Ok(periodo);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> ActualizarPeriodo(int id, [FromBody] PeriodoAcademico dto)
        {
            var periodo = await _context.PeriodosAcademicos.FindAsync(id);
            if (periodo == null) return NotFound();

            periodo.Nombre = dto.Nombre;
            periodo.FechaInicio = dto.FechaInicio;
            periodo.FechaFin = dto.FechaFin;
            periodo.Orden = dto.Orden;

            await _context.SaveChangesAsync();
            return Ok(periodo);
        }

        [HttpPost("{id:int}/activar")]
        public async Task<IActionResult> ActivarPeriodo(int id)
        {
            var periodo = await _context.PeriodosAcademicos.FindAsync(id);
            if (periodo == null) return NotFound();

            var periodos = await _context.PeriodosAcademicos.ToListAsync();
            foreach (var p in periodos)
            {
                p.Activo = p.Id == id;
            }

            await _context.SaveChangesAsync();
            return Ok(periodo);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> EliminarPeriodo(int id)
        {
            var periodo = await _context.PeriodosAcademicos.FindAsync(id);
            if (periodo == null) return NotFound();

            _context.PeriodosAcademicos.Remove(periodo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
