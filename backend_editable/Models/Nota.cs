namespace edutrack_academy_api.Models
{
    public class Nota
    {
        public int Id { get; set; }
        public int EstudianteId { get; set; }
        public int NotaConfigId { get; set; }
        public decimal? Valor { get; set; } // La nota numérica

        public Estudiante? Estudiante { get; set; }
        public NotaConfig? NotaConfig { get; set; }
    }
}
