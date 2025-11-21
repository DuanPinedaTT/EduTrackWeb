namespace edutrack_academy_api.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string User { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Rol { get; set; } = null!; // "admin" | "docente"
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        public ICollection<Curso> CursosAsignados { get; set; } = new List<Curso>();
    }

    public class RegistroUsuarioDTO
    {
        public string User { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Rol { get; set; } = "docente"; // por defecto docente
    }

    public class LoginDTO
    {
        public string User { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class UsuarioResponseDTO
    {
        public int Id { get; set; }
        public string User { get; set; } = null!;
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Rol { get; set; } = null!;
    }
}
