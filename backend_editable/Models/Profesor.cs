namespace edutrack_academy_api.Models
{
    public class Profesor
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
        public string Especialidad { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Biografia { get; set; } = string.Empty;
        public DateTime FechaIngreso { get; set; } = DateTime.UtcNow;

        public ICollection<Curso>? CursosTitular { get; set; }
        public ICollection<CursoAsignatura>? Asignaturas { get; set; }
    }
}
