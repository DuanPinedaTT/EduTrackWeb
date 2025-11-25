using EduTrack.Domain.Users;

namespace EduTrack.Domain.Academics;

public class Curso
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Grupo { get; set; } = string.Empty;
    public int? GradoId { get; set; }
    public Grado? Grado { get; set; }
    public Guid? DocenteId { get; set; }
    public ApplicationUser? Docente { get; set; }

    public ICollection<CursoAsignatura> CursoAsignaturas { get; set; } = new List<CursoAsignatura>();
    public ICollection<Inscripcion> Inscripciones { get; set; } = new List<Inscripcion>();
    public ICollection<NotaConfig> NotaConfigs { get; set; } = new List<NotaConfig>();
}
