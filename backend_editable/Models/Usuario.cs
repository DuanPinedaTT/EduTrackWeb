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
        public string Rol { get; set; } = null!; // admin | docente | estudiante
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        public ICollection<Curso> CursosAsignados { get; set; } = new List<Curso>();

        public Administrador? AdministradorPerfil { get; set; }
        public Profesor? ProfesorPerfil { get; set; }
        public Estudiante? EstudiantePerfil { get; set; }
    }

    public class RegistroUsuarioDTO
    {
        public string User { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Rol { get; set; } = "docente"; // por defecto docente
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
        public string? Especialidad { get; set; }
        public string? Documento { get; set; }
        public string? Nivel { get; set; }
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
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
        public string? Especialidad { get; set; }
    }
}
