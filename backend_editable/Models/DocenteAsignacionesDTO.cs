namespace edutrack_academy_api.Models
{
    public class DocenteGrupoRequestDTO
    {
        public int GradoId { get; set; }
        public string Grupo { get; set; } = string.Empty;
    }

    public class DocenteAsignaturaResponseDTO
    {
        public int AsignaturaId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Codigo { get; set; }
    }

    public class DocenteGrupoResponseDTO
    {
        public int GradoId { get; set; }
        public string GradoNombre { get; set; } = string.Empty;
        public string Grupo { get; set; } = string.Empty;
    }
}
