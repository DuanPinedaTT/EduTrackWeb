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

        public async Task<IEnumerable<UsuarioResponseDTO>> ListarDocentesAsync()
        {
            var lista = await _context.Usuarios
                .Where(u => u.Rol == "docente")
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
