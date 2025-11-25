using System.ComponentModel.DataAnnotations;

namespace edutrack_academy_api.Models
{
    public class RegistroAsistenciaDTO
    {
        [Required]
        public int EstudianteId { get; set; }

        public string? Estado { get; set; }

        public string? Observacion { get; set; }
    }

    public class GuardarAsistenciasDTO
    {
        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        public List<RegistroAsistenciaDTO> Registros { get; set; } = new();

        public int? RegistradoPorId { get; set; }
    }
}
