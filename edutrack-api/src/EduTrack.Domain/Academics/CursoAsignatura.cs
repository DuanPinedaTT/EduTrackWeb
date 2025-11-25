using EduTrack.Domain.Users;

namespace EduTrack.Domain.Academics;

public class CursoAsignatura
{
    public int Id { get; set; }
    public int CursoId { get; set; }
    public Curso? Curso { get; set; }
    public int AsignaturaId { get; set; }
    public Asignatura? Asignatura { get; set; }
    public Guid? DocenteId { get; set; }
    public ApplicationUser? Docente { get; set; }
}
