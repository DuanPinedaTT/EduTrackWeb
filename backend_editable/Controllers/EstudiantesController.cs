using System;
using System.Linq;
using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using edutrack_academy_api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Controllers
{
    // DTOs
    public class EstudianteDTO
    {
        public int? Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Documento { get; set; } = string.Empty;
        public int? GradoId { get; set; }
        public string? GradoNombre { get; set; }
        public string? Grupo { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class EstudiantesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IGrupoSyncService _grupoSyncService;

        public EstudiantesController(AppDbContext context, IGrupoSyncService grupoSyncService)
        {
            _context = context;
            _grupoSyncService = grupoSyncService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var estudiantes = await _context.Estudiantes
                .Include(e => e.Grado)
                .Select(e => new EstudianteDTO
                {
                    Id = e.Id,
                    Nombre = e.Nombre,
                    Documento = e.Documento,
                    GradoId = e.GradoId,
                    GradoNombre = e.Grado != null ? e.Grado.Nombre : null,
                    Grupo = string.IsNullOrWhiteSpace(e.Grupo) ? null : e.Grupo
                })
                .ToListAsync();
            return Ok(estudiantes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var estudiante = await _context.Estudiantes.Include(e => e.Grado).FirstOrDefaultAsync(e => e.Id == id);
            if (estudiante == null) return NotFound();

            return Ok(new EstudianteDTO
            {
                Id = estudiante.Id,
                Nombre = estudiante.Nombre,
                Documento = estudiante.Documento,
                GradoId = estudiante.GradoId,
                GradoNombre = estudiante.Grado?.Nombre,
                Grupo = string.IsNullOrWhiteSpace(estudiante.Grupo) ? null : estudiante.Grupo
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EstudianteDTO dto)
        {
            var (grado, grupoNormalizado, validationError) = await ValidateGradoYGrupo(dto.GradoId, dto.Grupo);
            if (validationError != null) return BadRequest(validationError);

            var estudiante = new Estudiante
            {
                Nombre = dto.Nombre,
                Documento = dto.Documento,
                GradoId = grado?.Id,
                Grupo = grupoNormalizado
            };
            _context.Estudiantes.Add(estudiante);
            await _context.SaveChangesAsync();
            await EnsureGrupoInscripcionAsync(estudiante, grupoNormalizado);

            dto.Id = estudiante.Id;
            dto.GradoNombre = grado?.Nombre;
            dto.Grupo = grupoNormalizado;
            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EstudianteDTO dto)
        {
            var estudiante = await _context.Estudiantes.FindAsync(id);
            if (estudiante == null) return NotFound();

            var (grado, grupoNormalizado, validationError) = await ValidateGradoYGrupo(dto.GradoId, dto.Grupo);
            if (validationError != null) return BadRequest(validationError);

            estudiante.Nombre = dto.Nombre;
            estudiante.Documento = dto.Documento;
            estudiante.GradoId = grado?.Id;
            estudiante.Grupo = grupoNormalizado;
            await _context.SaveChangesAsync();
            await EnsureGrupoInscripcionAsync(estudiante, grupoNormalizado);
            dto.GradoNombre = grado?.Nombre;
            dto.Grupo = grupoNormalizado;
            return Ok(dto);
        }

        private async Task<(Grado? grado, string grupoNormalizado, string? error)> ValidateGradoYGrupo(int? gradoId, string? grupo)
        {
            if (!gradoId.HasValue)
            {
                return (null, string.Empty, "Debes seleccionar un grado");
            }

            var normalizedGrupo = (grupo ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(normalizedGrupo))
            {
                return (null, string.Empty, "Debes seleccionar un grupo");
            }

            var grado = await _context.Grados.FindAsync(gradoId.Value);
            if (grado == null)
            {
                return (null, normalizedGrupo, "El grado seleccionado no existe");
            }

            var gruposDisponibles = GrupoSyncService.NormalizeGruposFromCsv(grado.Grupos);
            var pertenece = gruposDisponibles.Any(g => string.Equals(g, normalizedGrupo, StringComparison.OrdinalIgnoreCase));
            if (!pertenece)
            {
                return (grado, normalizedGrupo, "El grupo no pertenece al grado seleccionado");
            }

            return (grado, normalizedGrupo, null);
        }

        private async Task EnsureGrupoInscripcionAsync(Estudiante estudiante, string grupoNormalizado)
        {
            if (!estudiante.GradoId.HasValue || string.IsNullOrWhiteSpace(grupoNormalizado))
            {
                return;
            }

            var curso = await _grupoSyncService.EnsureCursoAsync(estudiante.GradoId.Value, grupoNormalizado);
            var exists = await _context.Inscripciones.AnyAsync(i => i.EstudianteId == estudiante.Id && i.CursoId == curso.Id);
            if (!exists)
            {
                _context.Inscripciones.Add(new Inscripcion { CursoId = curso.Id, EstudianteId = estudiante.Id });
                await _context.SaveChangesAsync();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var estudiante = await _context.Estudiantes.FindAsync(id);
            if (estudiante == null) return NotFound();

            _context.Estudiantes.Remove(estudiante);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
