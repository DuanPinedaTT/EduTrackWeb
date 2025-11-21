namespace edutrack_academy_api.Models
{
    public class ActualizarUsuarioDTO
    {
        public string User { get; set; } = null!;
        public string? Password { get; set; }   // opcional al editar
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
        public string? Especialidad { get; set; }
        public string? Documento { get; set; }
        public string? Nivel { get; set; }
        // Si más adelante quieres permitir cambiar también el rol:
        // public string? Rol { get; set; }
    }
}
