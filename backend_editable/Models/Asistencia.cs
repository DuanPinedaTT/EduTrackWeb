namespace edutrack_academy_api.Models
{
    public class Asistencia
    {
        public int Id { get; set; }
        public int CursoId { get; set; }
        public Curso Curso { get; set; } = null!;
        public int EstudianteId { get; set; }
        public Estudiante Estudiante { get; set; } = null!;
        public DateTime Fecha { get; set; }
        public int Periodo { get; set; } = 1;
        public string Estado { get; set; } = "Presente";
        public string? Observacion { get; set; }
        public int RegistradoPorId { get; set; }
        public Usuario RegistradoPor { get; set; } = null!;
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
    }
}
