namespace edutrack_academy_api.Models
{
    public class NotaConfig
    {
        public int Id { get; set; }
        public int CursoId { get; set; }
        public string Nombre { get; set; } = string.Empty; // Ej: "Parcial 1", "Quiz 2"
        public int Orden { get; set; } // Para ordenar las columnas
        public decimal Peso { get; set; } // Porcentaje: 30, 20, 50, etc.
        public int PeriodoAcademicoId { get; set; }
        public PeriodoAcademico? PeriodoAcademico { get; set; }
        public Curso? Curso { get; set; }
    }
}
