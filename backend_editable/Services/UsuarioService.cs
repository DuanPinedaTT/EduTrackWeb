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

        public async Task<Usuario?> LoginAsync(string userOrEmail, string password)
        {
            if (string.IsNullOrWhiteSpace(userOrEmail))
                return null;

            var normalized = userOrEmail.Trim().ToLower();

            var persona = await _context.Usuarios
                .FirstOrDefaultAsync(p => p.User.ToLower() == normalized || p.Email.ToLower() == normalized);
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

        public async Task<IEnumerable<UsuarioResponseDTO>> ListarUsuariosAsync(string? rol = null)
        {
            var query = _context.Usuarios.AsQueryable();

            if (!string.IsNullOrWhiteSpace(rol))
            {
                var normalized = rol.Trim().ToLower();
                query = query.Where(u => u.Rol.ToLower() == normalized);
            }

            var lista = await query
                .Select(u => new UsuarioResponseDTO
                {
                    Id = u.Id,
                    User = u.User,
                    Nombre = u.Nombre,
                    Apellido = u.Apellido,
                    Email = u.Email,
                    Rol = u.Rol
                })
                .ToListAsync();

            return lista;
        }
    }
}
