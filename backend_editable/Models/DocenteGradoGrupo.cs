namespace edutrack_academy_api.Models
{
    public class DocenteGradoGrupo
    {
        public int Id { get; set; }
        public int DocenteId { get; set; }
        public Usuario? Docente { get; set; }
        public int GradoId { get; set; }
        public Grado? Grado { get; set; }
        public string Grupo { get; set; } = string.Empty;
    }
}
