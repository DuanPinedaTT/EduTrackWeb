namespace edutrack_academy_api.Models
{
    public class Estudiante
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string Documento { get; set; } = null!;
        public int? GradoId { get; set; }
        public Grado? Grado { get; set; }
        public string Grupo { get; set; } = string.Empty;
        public int? UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
        // Estudiante ahora es una entidad global; las inscripciones a cursos se modelan
        // a través de la entidad `Inscripcion` (many-to-many).
        public ICollection<Inscripcion> Inscripciones { get; set; } = new List<Inscripcion>();
        public ICollection<TutorEstudiante> Tutores { get; set; } = new List<TutorEstudiante>();
        public ICollection<ComunicacionDestino> ComunicacionesRecibidas { get; set; } = new List<ComunicacionDestino>();
    }

    
}
