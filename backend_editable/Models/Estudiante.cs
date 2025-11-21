namespace edutrack_academy_api.Models
{
    public class Estudiante
    {
        public int Id { get; set; }
        public int? UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = string.Empty;
        public string Documento { get; set; } = null!;
        public DateTime FechaNacimiento { get; set; } = DateTime.UtcNow.AddYears(-15);
        public string Telefono { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Acudiente { get; set; } = string.Empty;
        public string Nivel { get; set; } = string.Empty;
        // Estudiante ahora es una entidad global; las inscripciones a cursos se modelan
        // a través de la entidad `Inscripcion` (many-to-many).
        public ICollection<Inscripcion> Inscripciones { get; set; } = new List<Inscripcion>();

        public ICollection<Asistencia> Asistencias { get; set; } = new List<Asistencia>();
        public ICollection<Observacion> Observaciones { get; set; } = new List<Observacion>();
        public ICollection<Notificacion> Notificaciones { get; set; } = new List<Notificacion>();
        public ICollection<Nota> Notas { get; set; } = new List<Nota>();
    }

    
}
