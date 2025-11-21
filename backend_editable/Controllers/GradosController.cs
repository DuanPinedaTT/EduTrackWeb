using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GradosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.Grados
                .Select(g => new { g.Id, g.Nombre, g.Codigo, Grupos = (g.Grupos ?? string.Empty).Split(',', StringSplitOptions.RemoveEmptyEntries) })
                .ToListAsync();
            return Ok(list);
        }

        public class GradoCreateDTO
        {
            public string Nombre { get; set; } = string.Empty;
            public string Codigo { get; set; } = string.Empty;
            public string[] Grupos { get; set; } = new string[0];
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GradoCreateDTO dto)
        {
            var g = new Grado { Nombre = dto.Nombre, Codigo = dto.Codigo ?? string.Empty, Grupos = dto.Grupos != null ? string.Join(',', dto.Grupos) : string.Empty };
            _context.Grados.Add(g);
            await _context.SaveChangesAsync();
            return Ok(new { g.Id, g.Nombre, g.Codigo, Grupos = (g.Grupos ?? string.Empty).Split(',', StringSplitOptions.RemoveEmptyEntries) });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] GradoCreateDTO dto)
        {
            var g = await _context.Grados.FindAsync(id);
            if (g == null) return NotFound();
            g.Nombre = dto.Nombre;
            g.Codigo = dto.Codigo ?? string.Empty;
            g.Grupos = dto.Grupos != null ? string.Join(',', dto.Grupos) : string.Empty;
            await _context.SaveChangesAsync();
            return Ok(new { g.Id, g.Nombre, g.Codigo, Grupos = (g.Grupos ?? string.Empty).Split(',', StringSplitOptions.RemoveEmptyEntries) });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var g = await _context.Grados.FindAsync(id);
            if (g == null) return NotFound();
            _context.Grados.Remove(g);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
