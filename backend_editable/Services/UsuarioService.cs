using System.Collections.Generic;
using System.Linq;
using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly AppDbContext _context;

        public UsuarioService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> LoginAsync(string user, string password)
        {
            var persona = await _context.Usuarios.FirstOrDefaultAsync(p => p.User == user);
            if (persona == null) return null;

            var valid = BCrypt.Net.BCrypt.Verify(password, persona.PasswordHash);
            return valid ? persona : null;
        }

        public async Task<Usuario> RegistrarAsync(RegistroUsuarioDTO dto)
        {
            var existente = await _context.Usuarios.AnyAsync(u => u.User == dto.User);
            if (existente)
                throw new InvalidOperationException("El usuario ya existe");

            var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var usuario = new Usuario
            {
                User = dto.User,
                PasswordHash = hash,
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Email = dto.Email,
                Rol = dto.Rol
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            if (usuario.Rol == "docente")
            {
                await SyncDocenteExtrasAsync(usuario.Id, dto.Asignaturas, dto.Asignaciones);
            }
            return usuario;
        }

        public async Task<Usuario?> ActualizarAsync(int id, ActualizarUsuarioDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return null;

            usuario.User = dto.User;
            usuario.Nombre = dto.Nombre;
            usuario.Apellido = dto.Apellido;
            usuario.Email = dto.Email;

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            await _context.SaveChangesAsync();

            if (usuario.Rol == "docente")
            {
                await SyncDocenteExtrasAsync(usuario.Id, dto.Asignaturas, dto.Asignaciones);
            }
            return usuario;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return false;

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<UsuarioResponseDTO>> ListarDocentesAsync()
        {
            var docentes = await _context.Usuarios
                .Where(u => u.Rol == "docente")
                .ToListAsync();

            var docenteIds = docentes.Select(d => d.Id).ToList();

            var asignaturasMap = await _context.DocenteAsignaturas
                .Where(da => docenteIds.Contains(da.DocenteId))
                .Include(da => da.Asignatura)
                .GroupBy(da => da.DocenteId)
                .ToDictionaryAsync(
                    g => g.Key,
                    g => g
                        .Where(x => x.Asignatura != null)
                        .Select(x => new DocenteAsignaturaResponseDTO
                        {
                            AsignaturaId = x.AsignaturaId,
                            Nombre = x.Asignatura!.Nombre,
                            Codigo = x.Asignatura!.Codigo
                        })
                        .ToList()
                );

            var gruposMap = await _context.DocenteGradoGrupos
                .Where(dg => docenteIds.Contains(dg.DocenteId))
                .Include(dg => dg.Grado)
                .GroupBy(dg => dg.DocenteId)
                .ToDictionaryAsync(
                    g => g.Key,
                    g => g.Select(x => new DocenteGrupoResponseDTO
                    {
                        GradoId = x.GradoId,
                        GradoNombre = x.Grado?.Nombre ?? string.Empty,
                        Grupo = x.Grupo
                    }).ToList()
                );

            var lista = docentes.Select(u => new UsuarioResponseDTO
            {
                Id = u.Id,
                User = u.User,
                Nombre = u.Nombre,
                Apellido = u.Apellido,
                Email = u.Email,
                Rol = u.Rol,
                Asignaturas = asignaturasMap.TryGetValue(u.Id, out var asigs)
                    ? asigs
                    : Enumerable.Empty<DocenteAsignaturaResponseDTO>(),
                Asignaciones = gruposMap.TryGetValue(u.Id, out var groups)
                    ? groups
                    : Enumerable.Empty<DocenteGrupoResponseDTO>()
            });

            return lista;
        }

        private async Task SyncDocenteExtrasAsync(int docenteId, IEnumerable<int>? asignaturas, IEnumerable<DocenteGrupoRequestDTO>? asignaciones)
        {
            var asignaturasList = (asignaturas ?? Enumerable.Empty<int>())
                .Where(id => id > 0)
                .Distinct()
                .ToList();

            var gruposList = (asignaciones ?? Enumerable.Empty<DocenteGrupoRequestDTO>())
                .Where(a => a.GradoId > 0 && !string.IsNullOrWhiteSpace(a.Grupo))
                .Select(a => new { a.GradoId, Grupo = a.Grupo.Trim() })
                .GroupBy(a => new { a.GradoId, a.Grupo })
                .Select(g => (g.Key.GradoId, Grupo: g.Key.Grupo))
                .ToList();

            var actualesAsignaturas = await _context.DocenteAsignaturas
                .Where(d => d.DocenteId == docenteId)
                .ToListAsync();
            var actualesGrupos = await _context.DocenteGradoGrupos
                .Where(d => d.DocenteId == docenteId)
                .ToListAsync();

            _context.DocenteAsignaturas.RemoveRange(actualesAsignaturas);
            _context.DocenteGradoGrupos.RemoveRange(actualesGrupos);

            foreach (var asignaturaId in asignaturasList)
            {
                _context.DocenteAsignaturas.Add(new DocenteAsignatura
                {
                    DocenteId = docenteId,
                    AsignaturaId = asignaturaId
                });
            }

            foreach (var (gradoId, grupo) in gruposList)
            {
                _context.DocenteGradoGrupos.Add(new DocenteGradoGrupo
                {
                    DocenteId = docenteId,
                    GradoId = gradoId,
                    Grupo = grupo
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}
