using edutrack_academy_api.Models;

namespace edutrack_academy_api.Services
{
    public interface IUsuarioService
    {
        // Login
        Task<Usuario?> LoginAsync(string user, string password);

        // Docentes
        Task<IEnumerable<UsuarioResponseDTO>> ListarDocentesAsync();

        // Crear usuario (docente o admin)
        Task<Usuario> RegistrarAsync(RegistroUsuarioDTO dto);

        // Actualizar usuario
        Task<Usuario?> ActualizarAsync(int id, ActualizarUsuarioDTO dto);

        // Eliminar usuario
        Task<bool> EliminarAsync(int id);
    }
}
