using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Services
{
    public record PortalCredentialResult(int UsuarioId, string Usuario, string? PasswordTemporal, bool Creado, bool PasswordActualizado);

    public interface IPortalCredentialService
    {
        Task<PortalCredentialResult> EnsureStudentAccountAsync(Estudiante estudiante, bool forcePasswordReset = false);
        Task<PortalCredentialResult> CreateTutorAccountAsync(Usuario usuario, string? plainPassword = null);
        Task<string> ResetPasswordAsync(int usuarioId);
        Task DeleteAccountAsync(int usuarioId);
    }

    public class PortalCredentialService : IPortalCredentialService
    {
        private readonly AppDbContext _context;

        public PortalCredentialService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PortalCredentialResult> EnsureStudentAccountAsync(Estudiante estudiante, bool forcePasswordReset = false)
        {
            if (estudiante == null)
            {
                throw new ArgumentNullException(nameof(estudiante));
            }

            Usuario? usuario = null;
            if (estudiante.UsuarioId.HasValue)
            {
                usuario = await _context.Usuarios.FindAsync(estudiante.UsuarioId.Value);
            }

            var baseToken = !string.IsNullOrWhiteSpace(estudiante.Documento)
                ? estudiante.Documento
                : estudiante.Id.ToString();

            var result = await EnsureAccountCoreAsync(
                usuario,
                "est",
                baseToken,
                estudiante.Nombre,
                "estudiante",
                forcePasswordReset);

            if (!estudiante.UsuarioId.HasValue || estudiante.UsuarioId.Value != result.UsuarioId)
            {
                estudiante.UsuarioId = result.UsuarioId;
                await _context.SaveChangesAsync();
            }

            return result;
        }

        public async Task<PortalCredentialResult> CreateTutorAccountAsync(Usuario usuario, string? plainPassword = null)
        {
            usuario.User = (usuario.User ?? string.Empty).Trim();
            var baseToken = usuario.User;
            var result = await EnsureAccountCoreAsync(
                null,
                "tutor",
                baseToken,
                $"{usuario.Nombre} {usuario.Apellido}",
                "tutor",
                true,
                usuario,
                plainPassword);

            return result;
        }

        public async Task<string> ResetPasswordAsync(int usuarioId)
        {
            var usuario = await _context.Usuarios.FindAsync(usuarioId)
                ?? throw new InvalidOperationException("Usuario no encontrado");

            var newPassword = GeneratePassword();
            usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();
            return newPassword;
        }

        public async Task DeleteAccountAsync(int usuarioId)
        {
            var usuario = await _context.Usuarios.FindAsync(usuarioId);
            if (usuario == null)
            {
                return;
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
        }

        private async Task<PortalCredentialResult> EnsureAccountCoreAsync(
            Usuario? existing,
            string prefix,
            string? baseToken,
            string? displayName,
            string rol,
            bool forcePasswordReset,
            Usuario? providedUsuario = null,
            string? providedPassword = null)
        {
            Usuario usuario;
            bool created = false;
            bool passwordUpdated = false;
            string? tempPassword = null;

            if (existing == null)
            {
                if (providedUsuario != null)
                {
                    usuario = providedUsuario;
                }
                else
                {
                    var username = await BuildUniqueUsernameAsync(prefix, baseToken);
                    var (nombre, apellido) = SplitNombre(displayName);
                    usuario = new Usuario
                    {
                        User = username,
                        Nombre = nombre,
                        Apellido = apellido,
                        Email = BuildPlaceholderEmail(username),
                        Rol = rol
                    };
                }

                tempPassword = string.IsNullOrWhiteSpace(providedPassword)
                    ? GeneratePassword()
                    : providedPassword.Trim();

                usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword);

                if (usuario.Id == 0)
                {
                    _context.Usuarios.Add(usuario);
                    await _context.SaveChangesAsync();
                }

                created = true;
                passwordUpdated = true;
            }
            else
            {
                usuario = existing;
                if (forcePasswordReset)
                {
                    tempPassword = string.IsNullOrWhiteSpace(providedPassword)
                        ? GeneratePassword()
                        : providedPassword.Trim();

                    usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword);
                    await _context.SaveChangesAsync();
                    passwordUpdated = true;
                }
            }

            if (string.IsNullOrWhiteSpace(usuario.User) || await UsernameAlreadyExistsAsync(usuario.User, usuario.Id))
            {
                usuario.User = await BuildUniqueUsernameAsync(prefix, baseToken);
                await _context.SaveChangesAsync();
            }

            return new PortalCredentialResult(usuario.Id, usuario.User, tempPassword, created, passwordUpdated);
        }

        private Task<bool> UsernameAlreadyExistsAsync(string user, int currentId)
        {
            return _context.Usuarios.AnyAsync(u => u.User == user && u.Id != currentId);
        }

        private async Task<string> BuildUniqueUsernameAsync(string prefix, string? baseToken)
        {
            var normalizedBase = NormalizeToken(baseToken);
            if (string.IsNullOrWhiteSpace(normalizedBase))
            {
                normalizedBase = Guid.NewGuid().ToString("N").Substring(0, 6);
            }

            var candidate = string.IsNullOrWhiteSpace(prefix)
                ? normalizedBase
                : $"{prefix}-{normalizedBase}";
            var finalUser = candidate;
            var suffix = 1;

            while (await _context.Usuarios.AnyAsync(u => u.User == finalUser))
            {
                finalUser = $"{candidate}{suffix}";
                suffix++;
            }

            return finalUser;
        }

        private static (string nombre, string apellido) SplitNombre(string? raw)
        {
            var value = (raw ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(value))
            {
                return ("Portal", "EduTrack");
            }

            var parts = value.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length == 1)
            {
                return (parts[0], "Portal");
            }

            return (parts[0], parts[1]);
        }

        private static string BuildPlaceholderEmail(string username)
        {
            return $"{username}@portal.edutrack.local";
        }

        private static string NormalizeToken(string? token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return string.Empty;
            }

            var simplified = token.Trim().ToLowerInvariant();
            simplified = simplified.Replace(' ', '-');
            simplified = Regex.Replace(simplified, "[^a-z0-9_-]", string.Empty);
            if (simplified.Length > 20)
            {
                simplified = simplified.Substring(0, 20);
            }
            return simplified;
        }

        private static string GeneratePassword()
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#";
            Span<char> buffer = stackalloc char[10];
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[buffer.Length];
            rng.GetBytes(bytes);
            for (var i = 0; i < buffer.Length; i++)
            {
                buffer[i] = chars[bytes[i] % chars.Length];
            }
            return new string(buffer);
        }
    }
}
