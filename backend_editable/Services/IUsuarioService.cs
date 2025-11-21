using edutrack_academy_api.Models;

namespace edutrack_academy_api.Services
{
    public interface IUsuarioService
    {
        // Login
        Task<Usuario?> LoginAsync(string user, string password);

        // Listado
        Task<IEnumerable<UsuarioResponseDTO>> ListarAsync(string? rol = null);

        // Crear usuario (docente, admin o estudiante)
        Task<UsuarioResponseDTO> RegistrarAsync(RegistroUsuarioDTO dto);

        // Actualizar usuario
        Task<UsuarioResponseDTO?> ActualizarAsync(int id, ActualizarUsuarioDTO dto);

        // Eliminar usuario
        Task<bool> EliminarAsync(int id);
    }
}
