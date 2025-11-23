using System.Collections.Generic;

namespace edutrack_academy_api.Models
{
    public class ActualizarUsuarioDTO
    {
        public string User { get; set; } = null!;
        public string? Password { get; set; }   // opcional al editar
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Email { get; set; } = null!;
        public List<int> Asignaturas { get; set; } = new();
        public List<DocenteGrupoRequestDTO> Asignaciones { get; set; } = new();
    }
}
