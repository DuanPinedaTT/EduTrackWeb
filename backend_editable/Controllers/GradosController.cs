using System;
using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using edutrack_academy_api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IGrupoSyncService _grupoSyncService;

        public GradosController(AppDbContext context, IGrupoSyncService grupoSyncService)
        {
            _context = context;
            _grupoSyncService = grupoSyncService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var grados = await _context.Grados.AsNoTracking().ToListAsync();
            var list = grados.Select(g => new
            {
                g.Id,
                g.Nombre,
                g.Codigo,
                Grupos = GrupoSyncService.NormalizeGruposFromCsv(g.Grupos)
            }).ToList();
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
            var gruposNormalizados = GrupoSyncService.NormalizeGrupos(dto.Grupos ?? Array.Empty<string>());
            var g = new Grado
            {
                Nombre = dto.Nombre,
                Codigo = dto.Codigo ?? string.Empty,
                Grupos = string.Join(',', gruposNormalizados)
            };
            _context.Grados.Add(g);
            await _context.SaveChangesAsync();
            await _grupoSyncService.EnsureCursosForGradoAsync(g);
            return Ok(new { g.Id, g.Nombre, g.Codigo, Grupos = gruposNormalizados });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] GradoCreateDTO dto)
        {
            var g = await _context.Grados.FindAsync(id);
            if (g == null) return NotFound();
            var gruposNormalizados = GrupoSyncService.NormalizeGrupos(dto.Grupos ?? Array.Empty<string>());
            g.Nombre = dto.Nombre;
            g.Codigo = dto.Codigo ?? string.Empty;
            g.Grupos = string.Join(',', gruposNormalizados);
            await _context.SaveChangesAsync();
            await _grupoSyncService.EnsureCursosForGradoAsync(g);
            return Ok(new { g.Id, g.Nombre, g.Codigo, Grupos = gruposNormalizados });
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
