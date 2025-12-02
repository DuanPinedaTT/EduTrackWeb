using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AsignaturasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AsignaturasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.Asignaturas
                .Select(a => new { a.Id, a.Nombre, a.Codigo })
                .ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var a = await _context.Asignaturas.FindAsync(id);
            if (a == null) return NotFound();
            return Ok(new { a.Id, a.Nombre, a.Codigo });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Asignatura dto)
        {
            var a = new Asignatura { Nombre = dto.Nombre, Codigo = dto.Codigo };
            _context.Asignaturas.Add(a);
            await _context.SaveChangesAsync();
            return Ok(new { a.Id, a.Nombre, a.Codigo });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Asignatura dto)
        {
            var a = await _context.Asignaturas.FindAsync(id);
            if (a == null) return NotFound();
            a.Nombre = dto.Nombre;
            a.Codigo = dto.Codigo;
            await _context.SaveChangesAsync();
            return Ok(new { a.Id, a.Nombre, a.Codigo });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var a = await _context.Asignaturas.FindAsync(id);
            if (a == null) return NotFound();
            _context.Asignaturas.Remove(a);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
