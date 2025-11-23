using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace edutrack_academy_api.Migrations
{
    /// <inheritdoc />
    public partial class estudiantegrupo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GradoId",
                table: "Estudiantes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Grupo",
                table: "Estudiantes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Estudiantes_GradoId",
                table: "Estudiantes",
                column: "GradoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Estudiantes_Grados_GradoId",
                table: "Estudiantes",
                column: "GradoId",
                principalTable: "Grados",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.Sql(@"
INSERT INTO Cursos (Nombre, Grupo, GradoId)
SELECT DISTINCT
    LTRIM(RTRIM(CASE WHEN NULLIF(gr.Codigo, '') IS NULL THEN gr.Nombre ELSE gr.Codigo END)) + ' ' + LTRIM(RTRIM(s.value)) AS Nombre,
    LTRIM(RTRIM(s.value)) AS Grupo,
    gr.Id
FROM Grados gr
CROSS APPLY STRING_SPLIT(gr.Grupos, ',') s
WHERE LTRIM(RTRIM(s.value)) <> ''
  AND NOT EXISTS (
        SELECT 1 FROM Cursos c
        WHERE c.GradoId = gr.Id
          AND ISNULL(c.Grupo, '') = LTRIM(RTRIM(s.value))
  );
");

            migrationBuilder.Sql(@"
WITH RankedIns AS (
    SELECT i.EstudianteId, i.CursoId,
           ROW_NUMBER() OVER (PARTITION BY i.EstudianteId ORDER BY i.Id) AS rn
    FROM Inscripciones i
)
UPDATE e
SET e.GradoId = c.GradoId,
    e.Grupo = ISNULL(c.Grupo, e.Grupo)
FROM Estudiantes e
JOIN RankedIns r ON r.EstudianteId = e.Id AND r.rn = 1
JOIN Cursos c ON c.Id = r.CursoId
WHERE c.GradoId IS NOT NULL;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Estudiantes_Grados_GradoId",
                table: "Estudiantes");

            migrationBuilder.DropIndex(
                name: "IX_Estudiantes_GradoId",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "GradoId",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "Grupo",
                table: "Estudiantes");
        }
    }
}
