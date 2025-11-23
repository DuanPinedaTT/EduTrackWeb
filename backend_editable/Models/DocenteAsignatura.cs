namespace edutrack_academy_api.Models
{
    public class DocenteAsignatura
    {
        public int Id { get; set; }
        public int DocenteId { get; set; }
        public Usuario? Docente { get; set; }
        public int AsignaturaId { get; set; }
        public Asignatura? Asignatura { get; set; }
    }
}
