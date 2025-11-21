using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace edutrack_academy_api.Migrations
{
    /// <inheritdoc />
    public partial class BackendOverhaul : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CursoAsignaturas_Usuarios_DocenteId",
                table: "CursoAsignaturas");

            migrationBuilder.DropForeignKey(
                name: "FK_Cursos_Usuarios_DocenteId",
                table: "Cursos");

            migrationBuilder.RenameColumn(
                name: "Periodo",
                table: "NotaConfigs",
                newName: "PeriodoAcademicoId");

            migrationBuilder.RenameColumn(
                name: "DocenteId",
                table: "Cursos",
                newName: "ProfesorId");

            migrationBuilder.RenameIndex(
                name: "IX_Cursos_DocenteId",
                table: "Cursos",
                newName: "IX_Cursos_ProfesorId");

            migrationBuilder.RenameColumn(
                name: "DocenteId",
                table: "CursoAsignaturas",
                newName: "ProfesorId");

            migrationBuilder.RenameIndex(
                name: "IX_CursoAsignaturas_DocenteId",
                table: "CursoAsignaturas",
                newName: "IX_CursoAsignaturas_ProfesorId");

            migrationBuilder.AlterColumn<string>(
                name: "User",
                table: "Usuarios",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Acudiente",
                table: "Estudiantes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Apellido",
                table: "Estudiantes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Direccion",
                table: "Estudiantes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaNacimiento",
                table: "Estudiantes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Nivel",
                table: "Estudiantes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telefono",
                table: "Estudiantes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "Estudiantes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Administradores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Direccion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Administradores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Administradores_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Asistencias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EstudianteId = table.Column<int>(type: "int", nullable: false),
                    CursoAsignaturaId = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Estado = table.Column<int>(type: "int", nullable: false),
                    Observacion = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Asistencias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Asistencias_CursoAsignaturas_CursoAsignaturaId",
                        column: x => x.CursoAsignaturaId,
                        principalTable: "CursoAsignaturas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Asistencias_Estudiantes_EstudianteId",
                        column: x => x.EstudianteId,
                        principalTable: "Estudiantes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PeriodosAcademicos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    Orden = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PeriodosAcademicos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Profesores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Especialidad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Direccion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Biografia = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaIngreso = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profesores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Profesores_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notificaciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProfesorId = table.Column<int>(type: "int", nullable: false),
                    CursoAsignaturaId = table.Column<int>(type: "int", nullable: true),
                    EstudianteId = table.Column<int>(type: "int", nullable: true),
                    Titulo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Mensaje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaEnvio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Leida = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notificaciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notificaciones_CursoAsignaturas_CursoAsignaturaId",
                        column: x => x.CursoAsignaturaId,
                        principalTable: "CursoAsignaturas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Notificaciones_Estudiantes_EstudianteId",
                        column: x => x.EstudianteId,
                        principalTable: "Estudiantes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Notificaciones_Profesores_ProfesorId",
                        column: x => x.ProfesorId,
                        principalTable: "Profesores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Observaciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProfesorId = table.Column<int>(type: "int", nullable: false),
                    EstudianteId = table.Column<int>(type: "int", nullable: false),
                    CursoAsignaturaId = table.Column<int>(type: "int", nullable: true),
                    Tipo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Comentario = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Observaciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Observaciones_CursoAsignaturas_CursoAsignaturaId",
                        column: x => x.CursoAsignaturaId,
                        principalTable: "CursoAsignaturas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Observaciones_Estudiantes_EstudianteId",
                        column: x => x.EstudianteId,
                        principalTable: "Estudiantes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Observaciones_Profesores_ProfesorId",
                        column: x => x.ProfesorId,
                        principalTable: "Profesores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "PeriodosAcademicos",
                columns: new[] { "Id", "Activo", "FechaFin", "FechaInicio", "Nombre", "Orden" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2025, 3, 31, 23, 59, 59, 0, DateTimeKind.Utc), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Periodo 1", 1 },
                    { 2, false, new DateTime(2025, 6, 30, 23, 59, 59, 0, DateTimeKind.Utc), new DateTime(2025, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Periodo 2", 2 },
                    { 3, false, new DateTime(2025, 9, 30, 23, 59, 59, 0, DateTimeKind.Utc), new DateTime(2025, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Periodo 3", 3 },
                    { 4, false, new DateTime(2025, 12, 31, 23, 59, 59, 0, DateTimeKind.Utc), new DateTime(2025, 10, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Periodo 4", 4 }
                });

            migrationBuilder.Sql(@"
IF EXISTS (SELECT 1 FROM [Usuarios] WHERE [Id] = 1)
BEGIN
    UPDATE [Usuarios]
    SET [Apellido] = 'Principal',
        [CreadoEn] = '2025-11-21T17:19:33.6465661Z',
        [Email] = 'admin@edutrack.com',
        [Nombre] = 'Admin',
        [PasswordHash] = '$2a$11$8Ax7AnCM1j7rwhhtjfiSeu41IrT9jp9.yhiAaZ1I.F7.DOPxJrj1C',
        [Rol] = 'admin',
        [User] = 'admin'
    WHERE [Id] = 1;
END
ELSE
BEGIN
    SET IDENTITY_INSERT [Usuarios] ON;
    INSERT INTO [Usuarios] ([Id], [Apellido], [CreadoEn], [Email], [Nombre], [PasswordHash], [Rol], [User])
    VALUES (1, 'Principal', '2025-11-21T17:19:33.6465661Z', 'admin@edutrack.com', 'Admin', '$2a$11$8Ax7AnCM1j7rwhhtjfiSeu41IrT9jp9.yhiAaZ1I.F7.DOPxJrj1C', 'admin', 'admin');
    SET IDENTITY_INSERT [Usuarios] OFF;
END

IF EXISTS (SELECT 1 FROM [Usuarios] WHERE [Id] = 2)
BEGIN
    UPDATE [Usuarios]
    SET [Apellido] = 'González',
        [CreadoEn] = '2025-11-21T17:19:33.6465672Z',
        [Email] = 'docente@edutrack.com',
        [Nombre] = 'María',
        [PasswordHash] = '$2a$11$k26qcKoy0eZZ.!9dBbTK1ehV4VHKs3P6KyHRxY6SY3n9Pqj8VimLa',
        [Rol] = 'docente',
        [User] = 'docente'
    WHERE [Id] = 2;
END
ELSE
BEGIN
    SET IDENTITY_INSERT [Usuarios] ON;
    INSERT INTO [Usuarios] ([Id], [Apellido], [CreadoEn], [Email], [Nombre], [PasswordHash], [Rol], [User])
    VALUES (2, 'González', '2025-11-21T17:19:33.6465672Z', 'docente@edutrack.com', 'María', '$2a$11$k26qcKoy0eZZ.!9dBbTK1ehV4VHKs3P6KyHRxY6SY3n9Pqj8VimLa', 'docente', 'docente');
    SET IDENTITY_INSERT [Usuarios] OFF;
END

IF EXISTS (SELECT 1 FROM [Usuarios] WHERE [Id] = 3)
BEGIN
    UPDATE [Usuarios]
    SET [Apellido] = 'Pérez',
        [CreadoEn] = '2025-11-21T17:19:33.6465674Z',
        [Email] = 'estudiante@edutrack.com',
        [Nombre] = 'Juan',
        [PasswordHash] = '$2a$11$0LjXmJvLCYOtJk9gDC11SuGeUXLEVp3G.yUpiRaY1oWXcnZ6FQxK6',
        [Rol] = 'estudiante',
        [User] = 'estudiante'
    WHERE [Id] = 3;
END
ELSE
BEGIN
    SET IDENTITY_INSERT [Usuarios] ON;
    INSERT INTO [Usuarios] ([Id], [Apellido], [CreadoEn], [Email], [Nombre], [PasswordHash], [Rol], [User])
    VALUES (3, 'Pérez', '2025-11-21T17:19:33.6465674Z', 'estudiante@edutrack.com', 'Juan', '$2a$11$0LjXmJvLCYOtJk9gDC11SuGeUXLEVp3G.yUpiRaY1oWXcnZ6FQxK6', 'estudiante', 'estudiante');
    SET IDENTITY_INSERT [Usuarios] OFF;
END

IF EXISTS (SELECT 1 FROM [Administradores] WHERE [Id] = 1)
BEGIN
    UPDATE [Administradores]
    SET [UsuarioId] = 1,
        [Telefono] = '3001234567',
        [Direccion] = 'Calle Principal 123',
        [FechaRegistro] = '2025-11-21T17:19:33.6465868Z'
    WHERE [Id] = 1;
END
ELSE
BEGIN
    SET IDENTITY_INSERT [Administradores] ON;
    INSERT INTO [Administradores] ([Id], [UsuarioId], [Telefono], [Direccion], [FechaRegistro])
    VALUES (1, 1, '3001234567', 'Calle Principal 123', '2025-11-21T17:19:33.6465868Z');
    SET IDENTITY_INSERT [Administradores] OFF;
END

IF EXISTS (SELECT 1 FROM [Profesores] WHERE [Id] = 1)
BEGIN
    UPDATE [Profesores]
    SET [UsuarioId] = 2,
        [Especialidad] = 'Matemáticas',
        [Telefono] = '3009876543',
        [Direccion] = 'Avenida Educación 456',
        [Biografia] = 'Docente titular de ciencias exactas',
        [FechaIngreso] = '2025-11-21T17:19:33.6465899Z'
    WHERE [Id] = 1;
END
ELSE
BEGIN
    SET IDENTITY_INSERT [Profesores] ON;
    INSERT INTO [Profesores] ([Id], [UsuarioId], [Especialidad], [Telefono], [Direccion], [Biografia], [FechaIngreso])
    VALUES (1, 2, 'Matemáticas', '3009876543', 'Avenida Educación 456', 'Docente titular de ciencias exactas', '2025-11-21T17:19:33.6465899Z');
    SET IDENTITY_INSERT [Profesores] OFF;
END

IF EXISTS (SELECT 1 FROM [Estudiantes] WHERE [Id] = 1)
BEGIN
    UPDATE [Estudiantes]
    SET [UsuarioId] = 3,
        [Nombre] = 'Juan',
        [Apellido] = 'Pérez',
        [Documento] = '123456789',
        [Telefono] = '3005551234',
        [Direccion] = 'Calle Estudiantes 321',
        [Acudiente] = 'Carlos Pérez',
        [Nivel] = '10°',
        [FechaNacimiento] = '2010-11-21T17:19:33.6465928Z'
    WHERE [Id] = 1;
END
ELSE
BEGIN
    SET IDENTITY_INSERT [Estudiantes] ON;
    INSERT INTO [Estudiantes] ([Id], [UsuarioId], [Nombre], [Apellido], [Documento], [Telefono], [Direccion], [Acudiente], [Nivel], [FechaNacimiento])
    VALUES (1, 3, 'Juan', 'Pérez', '123456789', '3005551234', 'Calle Estudiantes 321', 'Carlos Pérez', '10°', '2010-11-21T17:19:33.6465928Z');
    SET IDENTITY_INSERT [Estudiantes] OFF;
END
");

            migrationBuilder.Sql(@"
WITH RankedUsuarios AS (
    SELECT Id,
           [User],
           ROW_NUMBER() OVER (PARTITION BY [User] ORDER BY Id) AS rn
    FROM [Usuarios]
)
DELETE FROM [Usuarios]
WHERE Id IN (
    SELECT Id FROM RankedUsuarios WHERE rn > 1
);
");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_User",
                table: "Usuarios",
                column: "User",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NotaConfigs_PeriodoAcademicoId",
                table: "NotaConfigs",
                column: "PeriodoAcademicoId");

            migrationBuilder.CreateIndex(
                name: "IX_Estudiantes_UsuarioId",
                table: "Estudiantes",
                column: "UsuarioId",
                unique: true,
                filter: "[UsuarioId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Administradores_UsuarioId",
                table: "Administradores",
                column: "UsuarioId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_CursoAsignaturaId",
                table: "Asistencias",
                column: "CursoAsignaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_EstudianteId",
                table: "Asistencias",
                column: "EstudianteId");

            migrationBuilder.CreateIndex(
                name: "IX_Notificaciones_CursoAsignaturaId",
                table: "Notificaciones",
                column: "CursoAsignaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_Notificaciones_EstudianteId",
                table: "Notificaciones",
                column: "EstudianteId");

            migrationBuilder.CreateIndex(
                name: "IX_Notificaciones_ProfesorId",
                table: "Notificaciones",
                column: "ProfesorId");

            migrationBuilder.CreateIndex(
                name: "IX_Observaciones_CursoAsignaturaId",
                table: "Observaciones",
                column: "CursoAsignaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_Observaciones_EstudianteId",
                table: "Observaciones",
                column: "EstudianteId");

            migrationBuilder.CreateIndex(
                name: "IX_Observaciones_ProfesorId",
                table: "Observaciones",
                column: "ProfesorId");

            migrationBuilder.CreateIndex(
                name: "IX_Profesores_UsuarioId",
                table: "Profesores",
                column: "UsuarioId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CursoAsignaturas_Profesores_ProfesorId",
                table: "CursoAsignaturas",
                column: "ProfesorId",
                principalTable: "Profesores",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Cursos_Profesores_ProfesorId",
                table: "Cursos",
                column: "ProfesorId",
                principalTable: "Profesores",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Estudiantes_Usuarios_UsuarioId",
                table: "Estudiantes",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_NotaConfigs_PeriodosAcademicos_PeriodoAcademicoId",
                table: "NotaConfigs",
                column: "PeriodoAcademicoId",
                principalTable: "PeriodosAcademicos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CursoAsignaturas_Profesores_ProfesorId",
                table: "CursoAsignaturas");

            migrationBuilder.DropForeignKey(
                name: "FK_Cursos_Profesores_ProfesorId",
                table: "Cursos");

            migrationBuilder.DropForeignKey(
                name: "FK_Estudiantes_Usuarios_UsuarioId",
                table: "Estudiantes");

            migrationBuilder.DropForeignKey(
                name: "FK_NotaConfigs_PeriodosAcademicos_PeriodoAcademicoId",
                table: "NotaConfigs");

            migrationBuilder.DropTable(
                name: "Administradores");

            migrationBuilder.DropTable(
                name: "Asistencias");

            migrationBuilder.DropTable(
                name: "Notificaciones");

            migrationBuilder.DropTable(
                name: "Observaciones");

            migrationBuilder.DropTable(
                name: "PeriodosAcademicos");

            migrationBuilder.DropTable(
                name: "Profesores");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_User",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_NotaConfigs_PeriodoAcademicoId",
                table: "NotaConfigs");

            migrationBuilder.DropIndex(
                name: "IX_Estudiantes_UsuarioId",
                table: "Estudiantes");

            migrationBuilder.DeleteData(
                table: "Estudiantes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DropColumn(
                name: "Acudiente",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "Apellido",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "Direccion",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "FechaNacimiento",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "Nivel",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "Telefono",
                table: "Estudiantes");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Estudiantes");

            migrationBuilder.RenameColumn(
                name: "PeriodoAcademicoId",
                table: "NotaConfigs",
                newName: "Periodo");

            migrationBuilder.RenameColumn(
                name: "ProfesorId",
                table: "Cursos",
                newName: "DocenteId");

            migrationBuilder.RenameIndex(
                name: "IX_Cursos_ProfesorId",
                table: "Cursos",
                newName: "IX_Cursos_DocenteId");

            migrationBuilder.RenameColumn(
                name: "ProfesorId",
                table: "CursoAsignaturas",
                newName: "DocenteId");

            migrationBuilder.RenameIndex(
                name: "IX_CursoAsignaturas_ProfesorId",
                table: "CursoAsignaturas",
                newName: "IX_CursoAsignaturas_DocenteId");

            migrationBuilder.AlterColumn<string>(
                name: "User",
                table: "Usuarios",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddForeignKey(
                name: "FK_CursoAsignaturas_Usuarios_DocenteId",
                table: "CursoAsignaturas",
                column: "DocenteId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Cursos_Usuarios_DocenteId",
                table: "Cursos",
                column: "DocenteId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
