namespace edutrack_academy_api.Models
{
    public class Observacion
    {
        public int Id { get; set; }
        public int ProfesorId { get; set; }
        public Profesor? Profesor { get; set; }
        public int EstudianteId { get; set; }
        public Estudiante? Estudiante { get; set; }
        public int? CursoAsignaturaId { get; set; }
        public CursoAsignatura? CursoAsignatura { get; set; }
        public string Tipo { get; set; } = "positiva";
        public string Comentario { get; set; } = string.Empty;
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
    }
}
