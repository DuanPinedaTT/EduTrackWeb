namespace edutrack_academy_api.Models
{
    public enum AsistenciaEstado
    {
        Presente = 1,
        Ausente = 2,
        Tardanza = 3
    }

    public class Asistencia
    {
        public int Id { get; set; }
        public int EstudianteId { get; set; }
        public Estudiante? Estudiante { get; set; }
        public int CursoAsignaturaId { get; set; }
        public CursoAsignatura? CursoAsignatura { get; set; }
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
        public AsistenciaEstado Estado { get; set; } = AsistenciaEstado.Presente;
        public string Observacion { get; set; } = string.Empty;
    }
}
