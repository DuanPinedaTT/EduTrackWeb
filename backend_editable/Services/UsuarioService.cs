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

        public async Task<IEnumerable<UsuarioResponseDTO>> ListarAsync(string? rol = null)
        {
            var query = _context.Usuarios
                .Include(u => u.AdministradorPerfil)
                .Include(u => u.ProfesorPerfil)
                .Include(u => u.EstudiantePerfil)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(rol))
            {
                var rolNormalizado = rol.Trim().ToLower();
                query = query.Where(u => u.Rol == rolNormalizado);
            }

            var usuarios = await query.ToListAsync();
            return usuarios.Select(MapToDto);
        }

        public async Task<UsuarioResponseDTO> RegistrarAsync(RegistroUsuarioDTO dto)
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
                Rol = dto.Rol.ToLower()
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            await CrearOActualizarPerfilAsync(usuario, dto.Telefono, dto.Direccion, dto.Especialidad, dto.Documento, dto.Nivel);
            await _context.SaveChangesAsync();

            await _context.Entry(usuario).Reference(u => u.AdministradorPerfil).LoadAsync();
            await _context.Entry(usuario).Reference(u => u.ProfesorPerfil).LoadAsync();
            await _context.Entry(usuario).Reference(u => u.EstudiantePerfil).LoadAsync();

            return MapToDto(usuario);
        }

        public async Task<UsuarioResponseDTO?> ActualizarAsync(int id, ActualizarUsuarioDTO dto)
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

            await CrearOActualizarPerfilAsync(usuario, dto.Telefono, dto.Direccion, dto.Especialidad, dto.Documento, dto.Nivel);
            await _context.SaveChangesAsync();

            await _context.Entry(usuario).Reference(u => u.AdministradorPerfil).LoadAsync();
            await _context.Entry(usuario).Reference(u => u.ProfesorPerfil).LoadAsync();
            await _context.Entry(usuario).Reference(u => u.EstudiantePerfil).LoadAsync();

            return MapToDto(usuario);
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

        private async Task CrearOActualizarPerfilAsync(Usuario usuario, string? telefono, string? direccion, string? especialidad, string? documento, string? nivel)
        {
            switch (usuario.Rol)
            {
                case "admin":
                    var admin = await _context.Administradores.FirstOrDefaultAsync(a => a.UsuarioId == usuario.Id);
                    if (admin == null)
                    {
                        _context.Administradores.Add(new Administrador
                        {
                            UsuarioId = usuario.Id,
                            Telefono = telefono ?? string.Empty,
                            Direccion = direccion ?? string.Empty
                        });
                    }
                    else
                    {
                        admin.Telefono = telefono ?? admin.Telefono;
                        admin.Direccion = direccion ?? admin.Direccion;
                    }
                    break;
                case "docente":
                    var profesor = await _context.Profesores.FirstOrDefaultAsync(p => p.UsuarioId == usuario.Id);
                    if (profesor == null)
                    {
                        _context.Profesores.Add(new Profesor
                        {
                            UsuarioId = usuario.Id,
                            Telefono = telefono ?? string.Empty,
                            Direccion = direccion ?? string.Empty,
                            Especialidad = especialidad ?? string.Empty,
                            Biografia = string.Empty
                        });
                    }
                    else
                    {
                        profesor.Telefono = telefono ?? profesor.Telefono;
                        profesor.Direccion = direccion ?? profesor.Direccion;
                        profesor.Especialidad = especialidad ?? profesor.Especialidad;
                    }
                    break;
                case "estudiante":
                    var estudiante = await _context.Estudiantes.FirstOrDefaultAsync(e => e.UsuarioId == usuario.Id);
                    if (estudiante == null)
                    {
                        _context.Estudiantes.Add(new Estudiante
                        {
                            UsuarioId = usuario.Id,
                            Nombre = usuario.Nombre,
                            Apellido = usuario.Apellido,
                            Documento = documento ?? string.Empty,
                            Nivel = nivel ?? string.Empty,
                            Telefono = telefono ?? string.Empty,
                            Direccion = direccion ?? string.Empty,
                            Acudiente = string.Empty
                        });
                    }
                    else
                    {
                        estudiante.Documento = documento ?? estudiante.Documento;
                        estudiante.Nivel = nivel ?? estudiante.Nivel;
                        estudiante.Telefono = telefono ?? estudiante.Telefono;
                        estudiante.Direccion = direccion ?? estudiante.Direccion;
                        estudiante.Nombre = usuario.Nombre;
                        estudiante.Apellido = usuario.Apellido;
                    }
                    break;
            }
        }

        private static UsuarioResponseDTO MapToDto(Usuario usuario)
        {
            return new UsuarioResponseDTO
            {
                Id = usuario.Id,
                User = usuario.User,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Email = usuario.Email,
                Rol = usuario.Rol,
                Telefono = usuario.Rol switch
                {
                    "admin" => usuario.AdministradorPerfil?.Telefono,
                    "docente" => usuario.ProfesorPerfil?.Telefono,
                    "estudiante" => usuario.EstudiantePerfil?.Telefono,
                    _ => null
                },
                Direccion = usuario.Rol switch
                {
                    "admin" => usuario.AdministradorPerfil?.Direccion,
                    "docente" => usuario.ProfesorPerfil?.Direccion,
                    "estudiante" => usuario.EstudiantePerfil?.Direccion,
                    _ => null
                },
                Especialidad = usuario.ProfesorPerfil?.Especialidad
            };
        }
    }
}
