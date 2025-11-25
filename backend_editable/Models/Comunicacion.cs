namespace edutrack_academy_api.Models
{
    public class Comunicacion
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;
        public string Tipo { get; set; } = "general";
        public DateTime CreadaEn { get; set; } = DateTime.UtcNow;
        public int RemitenteId { get; set; }
        public Usuario Remitente { get; set; } = null!;
        public int? CursoId { get; set; }
        public Curso? Curso { get; set; }
        public ICollection<ComunicacionDestino> Destinatarios { get; set; } = new List<ComunicacionDestino>();
    }

    public class ComunicacionDestino
    {
        public int Id { get; set; }
        public int ComunicacionId { get; set; }
        public Comunicacion Comunicacion { get; set; } = null!;
        public int? EstudianteId { get; set; }
        public Estudiante? Estudiante { get; set; }
        public int? TutorId { get; set; }
        public Usuario? Tutor { get; set; }
        public bool Leido { get; set; }
        public DateTime? LeidoEn { get; set; }
        public string Canal { get; set; } = "portal";
    }
}
