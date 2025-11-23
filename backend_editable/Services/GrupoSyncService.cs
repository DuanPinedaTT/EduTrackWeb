using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace edutrack_academy_api.Services
{
    public interface IGrupoSyncService
    {
        Task EnsureCursosForGradoAsync(Grado grado);
        Task<Curso> EnsureCursoAsync(int gradoId, string grupo);
        Task EnsureCursosForAllGradosAsync();
    }

    public class GrupoSyncService : IGrupoSyncService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<GrupoSyncService> _logger;

        public GrupoSyncService(AppDbContext context, ILogger<GrupoSyncService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task EnsureCursosForAllGradosAsync()
        {
            var grados = await _context.Grados.AsNoTracking().ToListAsync();
            foreach (var grado in grados)
            {
                await EnsureCursosForGradoAsync(grado);
            }
        }

        public async Task EnsureCursosForGradoAsync(Grado grado)
        {
            var grupos = NormalizeGruposFromCsv(grado.Grupos);
            if (grupos.Count == 0)
            {
                return;
            }

            var existingCursos = await _context.Cursos
                .Where(c => c.GradoId == grado.Id)
                .ToListAsync();

            var createdSomething = false;
            foreach (var grupo in grupos)
            {
                if (existingCursos.Any(c => string.Equals(c.Grupo, grupo, StringComparison.OrdinalIgnoreCase)))
                {
                    continue;
                }

                var curso = new Curso
                {
                    Nombre = BuildCursoNombre(grado, grupo),
                    Grupo = grupo,
                    GradoId = grado.Id
                };
                _context.Cursos.Add(curso);
                createdSomething = true;
            }

            if (createdSomething)
            {
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "No se pudieron sincronizar los cursos para el grado {GradoId}", grado.Id);
                    throw;
                }
            }
        }

        public async Task<Curso> EnsureCursoAsync(int gradoId, string grupo)
        {
            var normalizedGrupo = (grupo ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(normalizedGrupo))
            {
                throw new ArgumentException("El grupo es obligatorio", nameof(grupo));
            }

            var curso = await _context.Cursos
                .FirstOrDefaultAsync(c => c.GradoId == gradoId && c.Grupo != null && c.Grupo.ToLower() == normalizedGrupo.ToLower());

            if (curso != null)
            {
                return curso;
            }

            var grado = await _context.Grados.FindAsync(gradoId)
                ?? throw new InvalidOperationException($"No existe el grado {gradoId}");

            curso = new Curso
            {
                Nombre = BuildCursoNombre(grado, normalizedGrupo),
                Grupo = normalizedGrupo,
                GradoId = grado.Id
            };

            _context.Cursos.Add(curso);
            await _context.SaveChangesAsync();
            return curso;
        }

        private static string BuildCursoNombre(Grado grado, string grupo)
        {
            var prefijo = string.IsNullOrWhiteSpace(grado.Codigo) ? grado.Nombre : grado.Codigo;
            return string.IsNullOrWhiteSpace(prefijo)
                ? grupo
                : $"{prefijo.Trim()} {grupo}".Trim();
        }

        public static IReadOnlyList<string> NormalizeGrupos(IEnumerable<string> grupos)
        {
            var result = new List<string>();
            var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var raw in grupos)
            {
                var value = (raw ?? string.Empty).Trim();
                if (string.IsNullOrWhiteSpace(value)) continue;
                if (seen.Add(value)) result.Add(value);
            }

            return result;
        }

        public static IReadOnlyList<string> NormalizeGruposFromCsv(string? raw)
        {
            if (string.IsNullOrWhiteSpace(raw)) return Array.Empty<string>();
            var parts = raw.Split(',', StringSplitOptions.RemoveEmptyEntries);
            return NormalizeGrupos(parts);
        }

        public static string BuildCsv(IEnumerable<string> grupos)
        {
            return string.Join(',', NormalizeGrupos(grupos));
        }
    }
}
