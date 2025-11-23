using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace edutrack_academy_api.Migrations
{
    /// <inheritdoc />
    public partial class SeedDataRefresh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Apellido", "CreadoEn", "Email", "Nombre", "PasswordHash", "User" },
                values: new object[] { "Medina", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3788), "laura.medina@edutrack.com", "Laura", "$2a$11$b6uWBSEetnNYUt0fR2N2b.C9yA443GndOniPIOy4RqVHKfU6EXylK", "admin.campus" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Apellido", "CreadoEn", "Email", "Nombre", "PasswordHash", "Rol", "User" },
                values: new object[] { "Herrera", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3796), "diego.herrera@edutrack.com", "Diego", "$2a$11$F40K44fW8J0gyyoWXPf4nOJRe/ZHHp6nzhAGKyolfCYW6a9xshRuu", "admin", "coordinacion" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Apellido", "CreadoEn", "Email", "Nombre", "PasswordHash", "Rol", "User" },
                values: new object[] { "Roldán", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3798), "sofia.roldan@edutrack.com", "Sofía", "$2a$11$4zUFBLeIJfBJjwvGzZhYOOFseetOcdFGVQyW1NUcE9oGNzxFMlMYG", "admin", "rectoria" });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Apellido", "CreadoEn", "Email", "Nombre", "PasswordHash", "Rol", "User" },
                values: new object[,]
                {
                    { 4, "Valencia", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3799), "martina.valencia@edutrack.com", "Martina", "$2a$11$TJbxu6dVaNyjhBDn7t2hS.cn32ihxTNltcSk5r97MuBZliRFbBvy.", "docente", "prof.mvalencia" },
                    { 5, "Ramírez", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3801), "julio.ramirez@edutrack.com", "Julio", "$2a$11$hPC66/NNzgrMtMN6odDfwer5ztJz9jRH8qPuBg9ve9NcYQJzRgnKO", "docente", "prof.jramirez" },
                    { 6, "Zamora", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3804), "lucia.zamora@edutrack.com", "Lucía", "$2a$11$A7MyTpXoRR7Ijnwt/3dMqemAARofRpgBLsX0dk6IvLvqvqBc89lKO", "docente", "prof.zamora" },
                    { 7, "Marín", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3805), "luisa.marin@edutrack.com", "Luisa", "$2a$11$UBqkCYm1rmnMZtalVJ2EHeXCjZvcwt/Cckf731zIzIgI1fLRe/flW", "estudiante", "est.luisa" },
                    { 8, "Ruiz", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3806), "carlos.ruiz@edutrack.com", "Carlos", "$2a$11$rRq2ylS2LrM0m2A51QQOdOiReLqOUyiGePHucAkaco4eqivUi/QYi", "estudiante", "est.carlos" },
                    { 9, "Suárez", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3808), "ana.suarez@edutrack.com", "Ana", "$2a$11$.9aZfR3Pg1.B8vLwjvgxsuShtAOMxegHN9gfek0Jj.J0zUe94y7w6", "estudiante", "est.ana" }
                });

            migrationBuilder.UpdateData(
                table: "Administradores",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Direccion", "FechaRegistro", "Telefono" },
                values: new object[] { "Calle 10 #45-21", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3936), "3001112233" });

            migrationBuilder.InsertData(
                table: "Administradores",
                columns: new[] { "Id", "Direccion", "FechaRegistro", "Telefono", "UsuarioId" },
                values: new object[,]
                {
                    { 2, "Carrera 50 #12-44", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3941), "3002223344", 2 },
                    { 3, "Diagonal 80 #66-01", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3942), "3003334455", 3 }
                });

            migrationBuilder.InsertData(
                table: "Asignaturas",
                columns: new[] { "Id", "Codigo", "Nombre" },
                values: new object[,]
                {
                    { 1, "MAT", "Matemáticas" },
                    { 2, "LEN", "Lengua Castellana" },
                    { 3, "CIE", "Ciencias Naturales" },
                    { 4, "ING", "Inglés" },
                    { 5, "HIS", "Historia" }
                });

            migrationBuilder.UpdateData(
                table: "Estudiantes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Acudiente", "Apellido", "Direccion", "Documento", "FechaNacimiento", "Nivel", "Nombre", "Telefono", "UsuarioId" },
                values: new object[] { "Patricia Gómez", "Marín", "Barrio Primavera", "1053891201", new DateTime(2014, 5, 17, 0, 0, 0, 0, DateTimeKind.Utc), "5°", "Luisa", "3015558899", 7 });

            migrationBuilder.InsertData(
                table: "Estudiantes",
                columns: new[] { "Id", "Acudiente", "Apellido", "Direccion", "Documento", "FechaNacimiento", "Nivel", "Nombre", "Telefono", "UsuarioId" },
                values: new object[,]
                {
                    { 4, "Carolina López", "López", "Villa del Prado", "1053999981", new DateTime(2014, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "5°", "Mateo", "3009007766", null },
                    { 5, "Andrea Ortiz", "Ortiz", "Bosques del Norte", "1045888812", new DateTime(2012, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), "8°", "Valentina", "3012203344", null },
                    { 6, "Ricardo Torres", "Torres", "Altos de la Sabana", "1050011223", new DateTime(2010, 9, 2, 0, 0, 0, 0, DateTimeKind.Utc), "10°", "Samuel", "3021144556", null }
                });

            migrationBuilder.InsertData(
                table: "Grados",
                columns: new[] { "Id", "Codigo", "Grupos", "Nombre" },
                values: new object[,]
                {
                    { 1, "5BAS", "A,B", "Quinto Básico" },
                    { 2, "8BAS", "A,B", "Octavo Básico" },
                    { 3, "10ACA", "A", "Décimo Académico" }
                });

            migrationBuilder.UpdateData(
                table: "Profesores",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Biografia", "Direccion", "FechaIngreso", "UsuarioId" },
                values: new object[] { "Mentora STEM con enfoque en innovación", "Av. Educativa 45", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(4160), 4 });

            migrationBuilder.InsertData(
                table: "Cursos",
                columns: new[] { "Id", "AsignaturaId", "GradoId", "Grupo", "Nombre", "ProfesorId", "UsuarioId" },
                values: new object[] { 1, null, 1, "A", "5° Básico A", 1, null });

            migrationBuilder.InsertData(
                table: "Estudiantes",
                columns: new[] { "Id", "Acudiente", "Apellido", "Direccion", "Documento", "FechaNacimiento", "Nivel", "Nombre", "Telefono", "UsuarioId" },
                values: new object[,]
                {
                    { 2, "Sandra Ruiz", "Ruiz", "Conjunto Nogales", "1054782203", new DateTime(2012, 11, 9, 0, 0, 0, 0, DateTimeKind.Utc), "8°", "Carlos", "3017776644", 8 },
                    { 3, "Marcos Suárez", "Suárez", "Urbanización Cedros", "1045221188", new DateTime(2010, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc), "10°", "Ana", "3027773311", 9 }
                });

            migrationBuilder.InsertData(
                table: "Profesores",
                columns: new[] { "Id", "Biografia", "Direccion", "Especialidad", "FechaIngreso", "Telefono", "UsuarioId" },
                values: new object[,]
                {
                    { 2, "Coordinador de laboratorios escolares", "Calle 23 #18-55", "Ciencias Naturales", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(4164), "3008765432", 5 },
                    { 3, "Docente bilingüe con certificación CELTA", "Transversal 90 #33-10", "Inglés", new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(4165), "3007654321", 6 }
                });

            migrationBuilder.InsertData(
                table: "CursoAsignaturas",
                columns: new[] { "Id", "AsignaturaId", "CursoId", "ProfesorId" },
                values: new object[,]
                {
                    { 1, 1, 1, 1 },
                    { 2, 4, 1, 3 }
                });

            migrationBuilder.InsertData(
                table: "Cursos",
                columns: new[] { "Id", "AsignaturaId", "GradoId", "Grupo", "Nombre", "ProfesorId", "UsuarioId" },
                values: new object[,]
                {
                    { 2, null, 2, "A", "8° Básico A", 2, null },
                    { 3, null, 3, "A", "10° Académico A", 3, null }
                });

            migrationBuilder.InsertData(
                table: "Inscripciones",
                columns: new[] { "Id", "CursoId", "EstudianteId" },
                values: new object[,]
                {
                    { 1, 1, 1 },
                    { 2, 1, 4 }
                });

            migrationBuilder.InsertData(
                table: "NotaConfigs",
                columns: new[] { "Id", "CursoId", "Nombre", "Orden", "PeriodoAcademicoId", "Peso" },
                values: new object[,]
                {
                    { 1, 1, "Proyecto STEAM", 1, 1, 50m },
                    { 2, 1, "Evaluación integral", 2, 1, 50m }
                });

            migrationBuilder.InsertData(
                table: "Asistencias",
                columns: new[] { "Id", "CursoAsignaturaId", "Estado", "EstudianteId", "Fecha", "Observacion" },
                values: new object[,]
                {
                    { 1, 1, 1, 1, new DateTime(2025, 2, 3, 12, 0, 0, 0, DateTimeKind.Utc), "Participó activamente" },
                    { 2, 1, 1, 1, new DateTime(2025, 2, 4, 12, 0, 0, 0, DateTimeKind.Utc), "" },
                    { 3, 1, 3, 1, new DateTime(2025, 2, 5, 12, 0, 0, 0, DateTimeKind.Utc), "Llegó 10 min tarde" },
                    { 4, 1, 1, 4, new DateTime(2025, 2, 3, 12, 0, 0, 0, DateTimeKind.Utc), "" },
                    { 5, 1, 2, 4, new DateTime(2025, 2, 4, 12, 0, 0, 0, DateTimeKind.Utc), "Justificada por cita médica" },
                    { 6, 1, 1, 4, new DateTime(2025, 2, 5, 12, 0, 0, 0, DateTimeKind.Utc), "" }
                });

            migrationBuilder.InsertData(
                table: "CursoAsignaturas",
                columns: new[] { "Id", "AsignaturaId", "CursoId", "ProfesorId" },
                values: new object[,]
                {
                    { 3, 3, 2, 2 },
                    { 4, 2, 2, 1 },
                    { 5, 4, 3, 3 },
                    { 6, 5, 3, 2 }
                });

            migrationBuilder.InsertData(
                table: "Inscripciones",
                columns: new[] { "Id", "CursoId", "EstudianteId" },
                values: new object[,]
                {
                    { 3, 2, 2 },
                    { 4, 2, 5 },
                    { 5, 3, 3 },
                    { 6, 3, 6 }
                });

            migrationBuilder.InsertData(
                table: "NotaConfigs",
                columns: new[] { "Id", "CursoId", "Nombre", "Orden", "PeriodoAcademicoId", "Peso" },
                values: new object[,]
                {
                    { 3, 2, "Laboratorio de ciencias", 1, 1, 40m },
                    { 4, 2, "Examen bimestral", 2, 1, 60m },
                    { 5, 3, "Ensayo crítico", 1, 1, 40m },
                    { 6, 3, "Examen final", 2, 1, 60m }
                });

            migrationBuilder.InsertData(
                table: "Notas",
                columns: new[] { "Id", "CursoId", "EstudianteId", "NotaConfigId", "Valor" },
                values: new object[,]
                {
                    { 1, null, 1, 1, 4.5m },
                    { 2, null, 1, 2, 4.2m },
                    { 3, null, 4, 1, 3.8m },
                    { 4, null, 4, 2, 3.5m }
                });

            migrationBuilder.InsertData(
                table: "Notificaciones",
                columns: new[] { "Id", "CursoAsignaturaId", "EstudianteId", "FechaEnvio", "Leida", "Mensaje", "ProfesorId", "Tipo", "Titulo" },
                values: new object[] { 1, 1, null, new DateTime(2025, 2, 2, 13, 0, 0, 0, DateTimeKind.Utc), false, "Recuerden cargar la presentación antes del viernes.", 1, "evaluacion", "Entrega de proyecto STEAM" });

            migrationBuilder.InsertData(
                table: "Observaciones",
                columns: new[] { "Id", "Comentario", "CursoAsignaturaId", "EstudianteId", "Fecha", "ProfesorId", "Tipo" },
                values: new object[] { 2, "Lideró al equipo durante el reto de robótica", 1, 1, new DateTime(2025, 2, 7, 10, 0, 0, 0, DateTimeKind.Utc), 1, "reconocimiento" });

            migrationBuilder.InsertData(
                table: "Asistencias",
                columns: new[] { "Id", "CursoAsignaturaId", "Estado", "EstudianteId", "Fecha", "Observacion" },
                values: new object[,]
                {
                    { 7, 3, 1, 2, new DateTime(2025, 2, 3, 15, 0, 0, 0, DateTimeKind.Utc), "" },
                    { 8, 3, 1, 2, new DateTime(2025, 2, 4, 15, 0, 0, 0, DateTimeKind.Utc), "Dirigió laboratorio" },
                    { 9, 3, 1, 5, new DateTime(2025, 2, 3, 15, 0, 0, 0, DateTimeKind.Utc), "" },
                    { 10, 3, 2, 5, new DateTime(2025, 2, 4, 15, 0, 0, 0, DateTimeKind.Utc), "No entregó excusa" },
                    { 11, 5, 1, 3, new DateTime(2025, 2, 3, 17, 0, 0, 0, DateTimeKind.Utc), "Exposición sobresaliente" },
                    { 12, 5, 1, 3, new DateTime(2025, 2, 4, 17, 0, 0, 0, DateTimeKind.Utc), "" },
                    { 13, 5, 3, 6, new DateTime(2025, 2, 3, 17, 0, 0, 0, DateTimeKind.Utc), "Ingreso tarde por transporte" },
                    { 14, 5, 1, 6, new DateTime(2025, 2, 4, 17, 0, 0, 0, DateTimeKind.Utc), "" }
                });

            migrationBuilder.InsertData(
                table: "Notas",
                columns: new[] { "Id", "CursoId", "EstudianteId", "NotaConfigId", "Valor" },
                values: new object[,]
                {
                    { 5, null, 2, 3, 4.0m },
                    { 6, null, 2, 4, 4.6m },
                    { 7, null, 5, 3, 3.2m },
                    { 8, null, 5, 4, 3.4m },
                    { 9, null, 3, 5, 4.8m },
                    { 10, null, 3, 6, 4.4m },
                    { 11, null, 6, 5, 3.9m },
                    { 12, null, 6, 6, 3.6m }
                });

            migrationBuilder.InsertData(
                table: "Notificaciones",
                columns: new[] { "Id", "CursoAsignaturaId", "EstudianteId", "FechaEnvio", "Leida", "Mensaje", "ProfesorId", "Tipo", "Titulo" },
                values: new object[] { 2, 5, 3, new DateTime(2025, 2, 5, 18, 0, 0, 0, DateTimeKind.Utc), true, "Excelente liderazgo en la exposición final.", 3, "reconocimiento", "Reconocimiento" });

            migrationBuilder.InsertData(
                table: "Observaciones",
                columns: new[] { "Id", "Comentario", "CursoAsignaturaId", "EstudianteId", "Fecha", "ProfesorId", "Tipo" },
                values: new object[] { 1, "Requiere refuerzo en registro de laboratorio", 3, 5, new DateTime(2025, 2, 6, 14, 30, 0, 0, DateTimeKind.Utc), 2, "seguimiento" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Administradores",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Administradores",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Asistencias",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "CursoAsignaturas",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CursoAsignaturas",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "CursoAsignaturas",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Inscripciones",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Inscripciones",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Inscripciones",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Inscripciones",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Inscripciones",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Inscripciones",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Notas",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Notificaciones",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Notificaciones",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Observaciones",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Observaciones",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Asignaturas",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Asignaturas",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "CursoAsignaturas",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "CursoAsignaturas",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "CursoAsignaturas",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Estudiantes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Estudiantes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Estudiantes",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Estudiantes",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Estudiantes",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "NotaConfigs",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "NotaConfigs",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "NotaConfigs",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "NotaConfigs",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "NotaConfigs",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "NotaConfigs",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Asignaturas",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Asignaturas",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Asignaturas",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Cursos",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Cursos",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Cursos",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Grados",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Grados",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Grados",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Profesores",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Profesores",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.UpdateData(
                table: "Administradores",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Direccion", "FechaRegistro", "Telefono" },
                values: new object[] { "Calle Principal 123", new DateTime(2025, 11, 21, 17, 19, 33, 646, DateTimeKind.Utc).AddTicks(5868), "3001234567" });

            migrationBuilder.UpdateData(
                table: "Estudiantes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Acudiente", "Apellido", "Direccion", "Documento", "FechaNacimiento", "Nivel", "Nombre", "Telefono", "UsuarioId" },
                values: new object[] { "Carlos Pérez", "Pérez", "Calle Estudiantes 321", "123456789", new DateTime(2010, 11, 21, 17, 19, 33, 646, DateTimeKind.Utc).AddTicks(5928), "10°", "Juan", "3005551234", 3 });

            migrationBuilder.UpdateData(
                table: "Profesores",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Biografia", "Direccion", "FechaIngreso", "UsuarioId" },
                values: new object[] { "Docente titular de ciencias exactas", "Avenida Educación 456", new DateTime(2025, 11, 21, 17, 19, 33, 646, DateTimeKind.Utc).AddTicks(5899), 2 });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Apellido", "CreadoEn", "Email", "Nombre", "PasswordHash", "User" },
                values: new object[] { "Principal", new DateTime(2025, 11, 21, 17, 19, 33, 646, DateTimeKind.Utc).AddTicks(5661), "admin@edutrack.com", "Admin", "$2a$11$8Ax7AnCM1j7rwhhtjfiSeu41IrT9jp9.yhiAaZ1I.F7.DOPxJrj1C", "admin" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Apellido", "CreadoEn", "Email", "Nombre", "PasswordHash", "Rol", "User" },
                values: new object[] { "González", new DateTime(2025, 11, 21, 17, 19, 33, 646, DateTimeKind.Utc).AddTicks(5672), "docente@edutrack.com", "María", "$2a$11$k26qcKoy0eZZ.!9dBbTK1ehV4VHKs3P6KyHRxY6SY3n9Pqj8VimLa", "docente", "docente" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Apellido", "CreadoEn", "Email", "Nombre", "PasswordHash", "Rol", "User" },
                values: new object[] { "Pérez", new DateTime(2025, 11, 21, 17, 19, 33, 646, DateTimeKind.Utc).AddTicks(5674), "estudiante@edutrack.com", "Juan", "$2a$11$0LjXmJvLCYOtJk9gDC11SuGeUXLEVp3G.yUpiRaY1oWXcnZ6FQxK6", "estudiante", "estudiante" });
        }
    }
}
