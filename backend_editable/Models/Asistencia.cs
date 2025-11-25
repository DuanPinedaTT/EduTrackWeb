using System.ComponentModel.DataAnnotations;

namespace edutrack_academy_api.Models
{
    public class Asistencia
    {
        public int Id { get; set; }
        public int CursoId { get; set; }
        public Curso? Curso { get; set; }
        public int EstudianteId { get; set; }
        public Estudiante? Estudiante { get; set; }
        public DateTime Fecha { get; set; }

        [MaxLength(20)]
        public string Estado { get; set; } = "presente"; // presente, ausente, tarde

        [MaxLength(500)]
        public string? Observacion { get; set; }

        public int? RegistradoPorId { get; set; }
        public Usuario? RegistradoPor { get; set; }

        public DateTime RegistradoEn { get; set; } = DateTime.UtcNow;
        public DateTime ActualizadoEn { get; set; } = DateTime.UtcNow;
    }
}
