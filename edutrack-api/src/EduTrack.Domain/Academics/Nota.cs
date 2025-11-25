namespace EduTrack.Domain.Academics;

public class Nota
{
    public int Id { get; set; }
    public int EstudianteId { get; set; }
    public Estudiante? Estudiante { get; set; }
    public int NotaConfigId { get; set; }
    public NotaConfig? NotaConfig { get; set; }
    public decimal? Valor { get; set; }
}
