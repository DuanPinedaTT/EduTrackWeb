namespace edutrack_academy_api.Models
{
    public class CursoAsignatura
    {
        public int Id { get; set; }

        public int CursoId { get; set; }
        public Curso? Curso { get; set; }

        public int AsignaturaId { get; set; }
        public Asignatura? Asignatura { get; set; }

        // Docente que imparte esa asignatura en ese curso (opcional)
        public int? DocenteId { get; set; }
        public Usuario? Docente { get; set; }
    }
}
