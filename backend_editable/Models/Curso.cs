namespace edutrack_academy_api.Models
{
    public class Curso
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        // Grupo / salón dentro del grado (ej: "01", "A")
        public string Grupo { get; set; } = string.Empty;
        // ahora `Curso` referencia a `Grado` (ej. 8A)
        public int? GradoId { get; set; }
        public Grado? Grado { get; set; }
        public int? DocenteId { get; set; }
        public Usuario? Docente { get; set; }

        // Un curso (sección) puede tener asignadas múltiples asignaturas (con docentes)
        public ICollection<CursoAsignatura> CursoAsignaturas { get; set; } = new List<CursoAsignatura>();

        // Las inscripciones representan la relación entre cursos y estudiantes.
        public ICollection<Inscripcion> Inscripciones { get; set; } = new List<Inscripcion>();
        public ICollection<Nota> Notas { get; set; } = new List<Nota>();
    }

    public class CursoDTO
    {
        public string Nombre { get; set; } = null!;
        // En el nuevo modelo el front-end debe enviar `GradoId` cuando cree/edite
        // un curso. Conservamos el nullable por compatibilidad.
        public int? GradoId { get; set; }
        public string? Grupo { get; set; }
        public int? DocenteId { get; set; }
    }
}
