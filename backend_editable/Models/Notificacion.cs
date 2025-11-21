namespace edutrack_academy_api.Models
{
    public class Notificacion
    {
        public int Id { get; set; }
        public int ProfesorId { get; set; }
        public Profesor? Profesor { get; set; }
        public int? CursoAsignaturaId { get; set; }
        public CursoAsignatura? CursoAsignatura { get; set; }
        public int? EstudianteId { get; set; }
        public Estudiante? Estudiante { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;
        public string Tipo { get; set; } = "general";
        public DateTime FechaEnvio { get; set; } = DateTime.UtcNow;
        public bool Leida { get; set; }
    }
}
