namespace edutrack_academy_api.Models
{
    public class NotaConfig
    {
        public int Id { get; set; }
        public int CursoId { get; set; }
        public int? CursoAsignaturaId { get; set; }
        public string Nombre { get; set; } = string.Empty; // Ej: "Parcial 1", "Quiz 2"
        public int Orden { get; set; } // Para ordenar las columnas
        public decimal Peso { get; set; } // Porcentaje: 30, 20, 50, etc.

        public int Periodo { get; set; } = 1; // Nuevo campo: 1, 2, 3 o 4

        public Curso? Curso { get; set; }
        public CursoAsignatura? CursoAsignatura { get; set; }
    }
}
