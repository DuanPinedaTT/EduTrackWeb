namespace edutrack_academy_api.Models
{
    public class Grado
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty; // Ej: "Octavo", "Décimo"
        // Código identificador editable por admin (ej: DEC, OCT)
        public string Codigo { get; set; } = string.Empty;

        // Grupos definidos para el grado, almacenados como CSV (ej: "01,02,03")
        public string Grupos { get; set; } = string.Empty;

        public ICollection<Curso> Cursos { get; set; } = new List<Curso>();
    }
}
