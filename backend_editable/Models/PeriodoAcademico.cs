namespace edutrack_academy_api.Models
{
    public class PeriodoAcademico
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public bool Activo { get; set; }
        public int Orden { get; set; }

        public ICollection<NotaConfig> ConfiguracionesNotas { get; set; } = new List<NotaConfig>();
    }
}
