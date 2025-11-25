namespace edutrack_academy_api.Models
{
    public class TutorEstudiante
    {
        public int Id { get; set; }
        public int TutorId { get; set; }
        public Usuario Tutor { get; set; } = null!;
        public int EstudianteId { get; set; }
        public Estudiante Estudiante { get; set; } = null!;
        public string Relacion { get; set; } = "Tutor";
        public bool EsPrincipal { get; set; } = false;
    }
}
