using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace edutrack_academy_api.Migrations
{
    /// <inheritdoc />
    public partial class new1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cursos_Usuarios_DocenteId",
                table: "Cursos");

            migrationBuilder.DropForeignKey(
                name: "FK_Notas_Cursos_CursoId",
                table: "Notas");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_User",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "ActualizadoEn",
                table: "Notas");

            migrationBuilder.DropColumn(
                name: "Definitiva",
                table: "Notas");

            migrationBuilder.DropColumn(
                name: "NotasJson",
                table: "Notas");

            migrationBuilder.AlterColumn<string>(
                name: "User",
                table: "Usuarios",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<int>(
                name: "CursoId",
                table: "Notas",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "NotaConfigId",
                table: "Notas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "Valor",
                table: "Notas",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CursoId1",
                table: "Estudiantes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "Cursos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "NotaConfigs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CursoId = table.Column<int>(type: "int", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Orden = table.Column<int>(type: "int", nullable: false),
                    Peso = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotaConfigs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotaConfigs_Cursos_CursoId",
                        column: x => x.CursoId,
                        principalTable: "Cursos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notas_NotaConfigId",
                table: "Notas",
                column: "NotaConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_Estudiantes_CursoId1",
                table: "Estudiantes",
                column: "CursoId1");

            migrationBuilder.CreateIndex(
                name: "IX_Cursos_UsuarioId",
                table: "Cursos",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_NotaConfigs_CursoId",
                table: "NotaConfigs",
                column: "CursoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cursos_Usuarios_DocenteId",
                table: "Cursos",
                column: "DocenteId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Cursos_Usuarios_UsuarioId",
                table: "Cursos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Estudiantes_Cursos_CursoId1",
                table: "Estudiantes",
                column: "CursoId1",
                principalTable: "Cursos",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notas_Cursos_CursoId",
                table: "Notas",
                column: "CursoId",
                principalTable: "Cursos",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notas_NotaConfigs_NotaConfigId",
                table: "Notas",
                column: "NotaConfigId",
                principalTable: "NotaConfigs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cursos_Usuarios_DocenteId",
                table: "Cursos");

            migrationBuilder.DropForeignKey(
                name: "FK_Cursos_Usuarios_UsuarioId",
                table: "Cursos");

            migrationBuilder.DropForeignKey(
                name: "FK_Estudiantes_Cursos_CursoId1",
                table: "Estudiantes");

            migrationBuilder.DropForeignKey(
                name: "FK_Notas_Cursos_CursoId",
                table: "Notas");

            migrationBuilder.DropForeignKey(
                name: "FK_Notas_NotaConfigs_NotaConfigId",
                table: "Notas");

            migrationBuilder.DropTable(
                name: "NotaConfigs");

            migrationBuilder.DropIndex(
                name: "IX_Notas_NotaConfigId",
                table: "Notas");

            migrationBuilder.DropIndex(
                name: "IX_Estudiantes_CursoId1",
                table: "Estudiantes");

            migrationBuilder.DropIndex(
                name: "IX_Cursos_UsuarioId",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "NotaConfigId",
                table: "Notas");

            migrationBuilder.DropColumn(
                name: "Valor",
                table: "Notas");

            migrationBuilder.DropColumn(
                name: "CursoId1",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Cursos");

            migrationBuilder.AlterColumn<string>(
                name: "User",
                table: "Usuarios",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "CursoId",
                table: "Notas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ActualizadoEn",
                table: "Notas",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "Definitiva",
                table: "Notas",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "NotasJson",
                table: "Notas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_User",
                table: "Usuarios",
                column: "User",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cursos_Usuarios_DocenteId",
                table: "Cursos",
                column: "DocenteId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notas_Cursos_CursoId",
                table: "Notas",
                column: "CursoId",
                principalTable: "Cursos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
