using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace edutrack_academy_api.Migrations
{
    /// <inheritdoc />
    public partial class newai : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Estudiantes_Cursos_CursoId",
                table: "Estudiantes");

            migrationBuilder.DropForeignKey(
                name: "FK_Estudiantes_Cursos_CursoId1",
                table: "Estudiantes");

            migrationBuilder.DropIndex(
                name: "IX_Estudiantes_CursoId",
                table: "Estudiantes");

            migrationBuilder.DropIndex(
                name: "IX_Estudiantes_CursoId1",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "CursoId",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "CursoId1",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "Grado",
                table: "Cursos");

            migrationBuilder.AddColumn<int>(
                name: "AsignaturaId",
                table: "Cursos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GradoId",
                table: "Cursos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Grupo",
                table: "Cursos",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Asignaturas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Codigo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Asignaturas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Grados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Codigo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Grupos = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grados", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Inscripciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CursoId = table.Column<int>(type: "int", nullable: false),
                    EstudianteId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inscripciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inscripciones_Cursos_CursoId",
                        column: x => x.CursoId,
                        principalTable: "Cursos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Inscripciones_Estudiantes_EstudianteId",
                        column: x => x.EstudianteId,
                        principalTable: "Estudiantes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CursoAsignaturas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CursoId = table.Column<int>(type: "int", nullable: false),
                    AsignaturaId = table.Column<int>(type: "int", nullable: false),
                    DocenteId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CursoAsignaturas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CursoAsignaturas_Asignaturas_AsignaturaId",
                        column: x => x.AsignaturaId,
                        principalTable: "Asignaturas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CursoAsignaturas_Cursos_CursoId",
                        column: x => x.CursoId,
                        principalTable: "Cursos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CursoAsignaturas_Usuarios_DocenteId",
                        column: x => x.DocenteId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cursos_AsignaturaId",
                table: "Cursos",
                column: "AsignaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_Cursos_GradoId",
                table: "Cursos",
                column: "GradoId");

            migrationBuilder.CreateIndex(
                name: "IX_CursoAsignaturas_AsignaturaId",
                table: "CursoAsignaturas",
                column: "AsignaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_CursoAsignaturas_CursoId_AsignaturaId",
                table: "CursoAsignaturas",
                columns: new[] { "CursoId", "AsignaturaId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CursoAsignaturas_DocenteId",
                table: "CursoAsignaturas",
                column: "DocenteId");

            migrationBuilder.CreateIndex(
                name: "IX_Inscripciones_CursoId",
                table: "Inscripciones",
                column: "CursoId");

            migrationBuilder.CreateIndex(
                name: "IX_Inscripciones_EstudianteId_CursoId",
                table: "Inscripciones",
                columns: new[] { "EstudianteId", "CursoId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cursos_Asignaturas_AsignaturaId",
                table: "Cursos",
                column: "AsignaturaId",
                principalTable: "Asignaturas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Cursos_Grados_GradoId",
                table: "Cursos",
                column: "GradoId",
                principalTable: "Grados",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cursos_Asignaturas_AsignaturaId",
                table: "Cursos");

            migrationBuilder.DropForeignKey(
                name: "FK_Cursos_Grados_GradoId",
                table: "Cursos");

            migrationBuilder.DropTable(
                name: "CursoAsignaturas");

            migrationBuilder.DropTable(
                name: "Grados");

            migrationBuilder.DropTable(
                name: "Inscripciones");

            migrationBuilder.DropTable(
                name: "Asignaturas");

            migrationBuilder.DropIndex(
                name: "IX_Cursos_AsignaturaId",
                table: "Cursos");

            migrationBuilder.DropIndex(
                name: "IX_Cursos_GradoId",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "AsignaturaId",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "GradoId",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "Grupo",
                table: "Cursos");

            migrationBuilder.AddColumn<int>(
                name: "CursoId",
                table: "Estudiantes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CursoId1",
                table: "Estudiantes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Grado",
                table: "Cursos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Estudiantes_CursoId",
                table: "Estudiantes",
                column: "CursoId");

            migrationBuilder.CreateIndex(
                name: "IX_Estudiantes_CursoId1",
                table: "Estudiantes",
                column: "CursoId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Estudiantes_Cursos_CursoId",
                table: "Estudiantes",
                column: "CursoId",
                principalTable: "Cursos",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Estudiantes_Cursos_CursoId1",
                table: "Estudiantes",
                column: "CursoId1",
                principalTable: "Cursos",
                principalColumn: "Id");
        }
    }
}
