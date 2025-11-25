using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;
using edutrack_academy_api.Data;

#nullable disable

namespace edutrack_academy_api.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(AppDbContext))]
    [Migration("20251126043000_EnsurePortalSupportTables")]
    public partial class EnsurePortalSupportTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID('[dbo].[TutorEstudiantes]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[TutorEstudiantes](
        [Id] INT IDENTITY(1,1) NOT NULL,
        [TutorId] INT NOT NULL,
        [EstudianteId] INT NOT NULL,
        [Relacion] NVARCHAR(50) NOT NULL CONSTRAINT [DF_TutorEstudiantes_Relacion] DEFAULT('Tutor'),
        [EsPrincipal] BIT NOT NULL CONSTRAINT [DF_TutorEstudiantes_EsPrincipal] DEFAULT(0),
        CONSTRAINT [PK_TutorEstudiantes] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_TutorEstudiantes_TutorId_EstudianteId'
      AND object_id = OBJECT_ID('[dbo].[TutorEstudiantes]'))
BEGIN
    CREATE UNIQUE INDEX [IX_TutorEstudiantes_TutorId_EstudianteId]
        ON [dbo].[TutorEstudiantes]([TutorId], [EstudianteId]);
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_TutorEstudiantes_Usuarios_TutorId')
BEGIN
    ALTER TABLE [dbo].[TutorEstudiantes] WITH CHECK
        ADD CONSTRAINT [FK_TutorEstudiantes_Usuarios_TutorId]
        FOREIGN KEY([TutorId]) REFERENCES [dbo].[Usuarios]([Id])
        ON DELETE CASCADE;
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_TutorEstudiantes_Estudiantes_EstudianteId')
BEGIN
    ALTER TABLE [dbo].[TutorEstudiantes] WITH CHECK
        ADD CONSTRAINT [FK_TutorEstudiantes_Estudiantes_EstudianteId]
        FOREIGN KEY([EstudianteId]) REFERENCES [dbo].[Estudiantes]([Id])
        ON DELETE CASCADE;
END;
", suppressTransaction: false);

            migrationBuilder.Sql(@"
IF OBJECT_ID('[dbo].[Asistencias]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Asistencias](
        [Id] INT IDENTITY(1,1) NOT NULL,
        [CursoId] INT NOT NULL,
        [EstudianteId] INT NOT NULL,
        [Fecha] DATETIME2 NOT NULL,
        [Periodo] INT NOT NULL CONSTRAINT [DF_Asistencias_Periodo] DEFAULT(1),
        [Estado] NVARCHAR(20) NOT NULL CONSTRAINT [DF_Asistencias_Estado] DEFAULT('Presente'),
        [Observacion] NVARCHAR(500) NULL,
        [RegistradoPorId] INT NOT NULL,
        [CreadoEn] DATETIME2 NOT NULL CONSTRAINT [DF_Asistencias_CreadoEn] DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT [PK_Asistencias] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_Asistencias_CursoId_EstudianteId_Fecha'
      AND object_id = OBJECT_ID('[dbo].[Asistencias]'))
BEGIN
    CREATE UNIQUE INDEX [IX_Asistencias_CursoId_EstudianteId_Fecha]
        ON [dbo].[Asistencias]([CursoId], [EstudianteId], [Fecha]);
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_Asistencias_Cursos_CursoId')
BEGIN
    ALTER TABLE [dbo].[Asistencias] WITH CHECK
        ADD CONSTRAINT [FK_Asistencias_Cursos_CursoId]
        FOREIGN KEY([CursoId]) REFERENCES [dbo].[Cursos]([Id])
        ON DELETE CASCADE;
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_Asistencias_Estudiantes_EstudianteId')
BEGIN
    ALTER TABLE [dbo].[Asistencias] WITH CHECK
        ADD CONSTRAINT [FK_Asistencias_Estudiantes_EstudianteId]
        FOREIGN KEY([EstudianteId]) REFERENCES [dbo].[Estudiantes]([Id])
        ON DELETE CASCADE;
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_Asistencias_Usuarios_RegistradoPorId')
BEGIN
    ALTER TABLE [dbo].[Asistencias] WITH CHECK
        ADD CONSTRAINT [FK_Asistencias_Usuarios_RegistradoPorId]
        FOREIGN KEY([RegistradoPorId]) REFERENCES [dbo].[Usuarios]([Id])
        ON DELETE NO ACTION;
END;
", suppressTransaction: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID('[dbo].[TutorEstudiantes]', 'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE name = 'FK_TutorEstudiantes_Usuarios_TutorId')
    BEGIN
        ALTER TABLE [dbo].[TutorEstudiantes]
            DROP CONSTRAINT [FK_TutorEstudiantes_Usuarios_TutorId];
    END;

    IF EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE name = 'FK_TutorEstudiantes_Estudiantes_EstudianteId')
    BEGIN
        ALTER TABLE [dbo].[TutorEstudiantes]
            DROP CONSTRAINT [FK_TutorEstudiantes_Estudiantes_EstudianteId];
    END;

    DROP TABLE [dbo].[TutorEstudiantes];
END;
", suppressTransaction: false);

            migrationBuilder.Sql(@"
IF OBJECT_ID('[dbo].[Asistencias]', 'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE name = 'FK_Asistencias_Cursos_CursoId')
    BEGIN
        ALTER TABLE [dbo].[Asistencias]
            DROP CONSTRAINT [FK_Asistencias_Cursos_CursoId];
    END;

    IF EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE name = 'FK_Asistencias_Estudiantes_EstudianteId')
    BEGIN
        ALTER TABLE [dbo].[Asistencias]
            DROP CONSTRAINT [FK_Asistencias_Estudiantes_EstudianteId];
    END;

    IF EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE name = 'FK_Asistencias_Usuarios_RegistradoPorId')
    BEGIN
        ALTER TABLE [dbo].[Asistencias]
            DROP CONSTRAINT [FK_Asistencias_Usuarios_RegistradoPorId];
    END;

    DROP TABLE [dbo].[Asistencias];
END;
", suppressTransaction: false);
        }
    }
}
