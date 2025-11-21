namespace edutrack_academy_api.Models
{
    public class Asignatura
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        // Código identificador (ej: MAT)
        public string Codigo { get; set; } = string.Empty;

        public ICollection<Curso> Cursos { get; set; } = new List<Curso>();
    }
}
