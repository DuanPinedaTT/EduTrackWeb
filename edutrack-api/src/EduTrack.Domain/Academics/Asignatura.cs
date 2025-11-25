namespace EduTrack.Domain.Academics;

public class Asignatura
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Codigo { get; set; } = string.Empty;

    public ICollection<CursoAsignatura> CursoAsignaturas { get; set; } = new List<CursoAsignatura>();
}
