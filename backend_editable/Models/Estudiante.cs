namespace edutrack_academy_api.Models
{
    public class Estudiante
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string Documento { get; set; } = null!;
        // Estudiante ahora es una entidad global; las inscripciones a cursos se modelan
        // a través de la entidad `Inscripcion` (many-to-many).
        public ICollection<Inscripcion> Inscripciones { get; set; } = new List<Inscripcion>();

    }

    
}
