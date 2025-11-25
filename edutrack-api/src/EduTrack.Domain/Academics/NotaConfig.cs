namespace EduTrack.Domain.Academics;

public class NotaConfig
{
    public int Id { get; set; }
    public int CursoId { get; set; }
    public Curso? Curso { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int Orden { get; set; }
    public decimal Peso { get; set; }
    public int Periodo { get; set; } = 1;

    public ICollection<Nota> Notas { get; set; } = new List<Nota>();
}
