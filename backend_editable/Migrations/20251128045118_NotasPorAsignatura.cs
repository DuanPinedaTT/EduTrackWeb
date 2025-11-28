using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace edutrack_academy_api.Migrations
{
    /// <inheritdoc />
    public partial class NotasPorAsignatura : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Asistencias_CursoId_EstudianteId_Fecha",
                table: "Asistencias");

            migrationBuilder.AddColumn<int>(
                name: "CursoAsignaturaId",
                table: "Notas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CursoAsignaturaId",
                table: "NotaConfigs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AsignaturaId",
                table: "Asistencias",
                type: "int",
                nullable: true);

            migrationBuilder.Sql(@"
                UPDATE nc
                SET CursoAsignaturaId = ca.Id
                FROM NotaConfigs nc
                OUTER APPLY (
                    SELECT TOP 1 Id
                    FROM CursoAsignaturas
                    WHERE CursoId = nc.CursoId
                    ORDER BY Id
                ) ca
                WHERE nc.CursoAsignaturaId IS NULL AND ca.Id IS NOT NULL;

                UPDATE n
                SET CursoAsignaturaId = nc.CursoAsignaturaId
                FROM Notas n
                INNER JOIN NotaConfigs nc ON nc.Id = n.NotaConfigId;
            ");

            migrationBuilder.CreateIndex(
                name: "IX_Notas_CursoAsignaturaId",
                table: "Notas",
                column: "CursoAsignaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_NotaConfigs_CursoAsignaturaId",
                table: "NotaConfigs",
                column: "CursoAsignaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_AsignaturaId",
                table: "Asistencias",
                column: "AsignaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_CursoId_AsignaturaId_EstudianteId_Fecha_Periodo",
                table: "Asistencias",
                columns: new[] { "CursoId", "AsignaturaId", "EstudianteId", "Fecha", "Periodo" },
                unique: true,
                filter: "[AsignaturaId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencias_Asignaturas_AsignaturaId",
                table: "Asistencias",
                column: "AsignaturaId",
                principalTable: "Asignaturas",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_NotaConfigs_CursoAsignaturas_CursoAsignaturaId",
                table: "NotaConfigs",
                column: "CursoAsignaturaId",
                principalTable: "CursoAsignaturas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notas_CursoAsignaturas_CursoAsignaturaId",
                table: "Notas",
                column: "CursoAsignaturaId",
                principalTable: "CursoAsignaturas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Asistencias_Asignaturas_AsignaturaId",
                table: "Asistencias");

            migrationBuilder.DropForeignKey(
                name: "FK_NotaConfigs_CursoAsignaturas_CursoAsignaturaId",
                table: "NotaConfigs");

            migrationBuilder.DropForeignKey(
                name: "FK_Notas_CursoAsignaturas_CursoAsignaturaId",
                table: "Notas");

            migrationBuilder.DropIndex(
                name: "IX_Notas_CursoAsignaturaId",
                table: "Notas");

            migrationBuilder.DropIndex(
                name: "IX_NotaConfigs_CursoAsignaturaId",
                table: "NotaConfigs");

            migrationBuilder.DropIndex(
                name: "IX_Asistencias_AsignaturaId",
                table: "Asistencias");

            migrationBuilder.DropIndex(
                name: "IX_Asistencias_CursoId_AsignaturaId_EstudianteId_Fecha_Periodo",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "CursoAsignaturaId",
                table: "Notas");

            migrationBuilder.DropColumn(
                name: "CursoAsignaturaId",
                table: "NotaConfigs");

            migrationBuilder.DropColumn(
                name: "AsignaturaId",
                table: "Asistencias");

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_CursoId_EstudianteId_Fecha",
                table: "Asistencias",
                columns: new[] { "CursoId", "EstudianteId", "Fecha" },
                unique: true);
        }
    }
}
