using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using edutrack_academy_api.Data;

#nullable disable

namespace edutrack_academy_api.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20251126064000_EnsurePortalCommunications")]
    public partial class EnsurePortalCommunications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID('[dbo].[Comunicaciones]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Comunicaciones](
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Titulo] NVARCHAR(200) NOT NULL,
        [Mensaje] NVARCHAR(MAX) NOT NULL,
        [Tipo] NVARCHAR(40) NOT NULL CONSTRAINT [DF_Comunicaciones_Tipo] DEFAULT('general'),
        [CreadaEn] DATETIME2 NOT NULL CONSTRAINT [DF_Comunicaciones_CreadaEn] DEFAULT (SYSUTCDATETIME()),
        [RemitenteId] INT NOT NULL,
        [CursoId] INT NULL,
        CONSTRAINT [PK_Comunicaciones] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_Comunicaciones_Usuarios_RemitenteId')
BEGIN
    ALTER TABLE [dbo].[Comunicaciones] WITH CHECK
        ADD CONSTRAINT [FK_Comunicaciones_Usuarios_RemitenteId]
        FOREIGN KEY([RemitenteId]) REFERENCES [dbo].[Usuarios]([Id])
        ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_Comunicaciones_Cursos_CursoId')
BEGIN
    ALTER TABLE [dbo].[Comunicaciones] WITH CHECK
        ADD CONSTRAINT [FK_Comunicaciones_Cursos_CursoId]
        FOREIGN KEY([CursoId]) REFERENCES [dbo].[Cursos]([Id])
        ON DELETE SET NULL;
END;

IF OBJECT_ID('[dbo].[ComunicacionDestinos]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[ComunicacionDestinos](
        [Id] INT IDENTITY(1,1) NOT NULL,
        [ComunicacionId] INT NOT NULL,
        [EstudianteId] INT NULL,
        [TutorId] INT NULL,
        [Leido] BIT NOT NULL CONSTRAINT [DF_ComunicacionDestinos_Leido] DEFAULT(0),
        [LeidoEn] DATETIME2 NULL,
        [Canal] NVARCHAR(30) NOT NULL CONSTRAINT [DF_ComunicacionDestinos_Canal] DEFAULT('portal'),
        CONSTRAINT [PK_ComunicacionDestinos] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_ComunicacionDestinos_ComunicacionId'
      AND object_id = OBJECT_ID('[dbo].[ComunicacionDestinos]'))
BEGIN
    CREATE INDEX [IX_ComunicacionDestinos_ComunicacionId]
        ON [dbo].[ComunicacionDestinos]([ComunicacionId]);
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_ComunicacionDestinos_EstudianteId'
      AND object_id = OBJECT_ID('[dbo].[ComunicacionDestinos]'))
BEGIN
    CREATE INDEX [IX_ComunicacionDestinos_EstudianteId]
        ON [dbo].[ComunicacionDestinos]([EstudianteId]);
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_ComunicacionDestinos_TutorId'
      AND object_id = OBJECT_ID('[dbo].[ComunicacionDestinos]'))
BEGIN
    CREATE INDEX [IX_ComunicacionDestinos_TutorId]
        ON [dbo].[ComunicacionDestinos]([TutorId]);
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_ComunicacionDestinos_Comunicaciones_ComunicacionId')
BEGIN
    ALTER TABLE [dbo].[ComunicacionDestinos] WITH CHECK
        ADD CONSTRAINT [FK_ComunicacionDestinos_Comunicaciones_ComunicacionId]
        FOREIGN KEY([ComunicacionId]) REFERENCES [dbo].[Comunicaciones]([Id])
        ON DELETE CASCADE;
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_ComunicacionDestinos_Estudiantes_EstudianteId')
BEGIN
    ALTER TABLE [dbo].[ComunicacionDestinos] WITH CHECK
        ADD CONSTRAINT [FK_ComunicacionDestinos_Estudiantes_EstudianteId]
        FOREIGN KEY([EstudianteId]) REFERENCES [dbo].[Estudiantes]([Id])
        ON DELETE CASCADE;
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_ComunicacionDestinos_Usuarios_TutorId')
BEGIN
    ALTER TABLE [dbo].[ComunicacionDestinos] WITH CHECK
        ADD CONSTRAINT [FK_ComunicacionDestinos_Usuarios_TutorId]
        FOREIGN KEY([TutorId]) REFERENCES [dbo].[Usuarios]([Id])
        ON DELETE CASCADE;
END;
", suppressTransaction: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID('[dbo].[ComunicacionDestinos]', 'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE name = 'FK_ComunicacionDestinos_Comunicaciones_ComunicacionId')
    BEGIN
        ALTER TABLE [dbo].[ComunicacionDestinos]
            DROP CONSTRAINT [FK_ComunicacionDestinos_Comunicaciones_ComunicacionId];
    END;

    IF EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE name = 'FK_ComunicacionDestinos_Estudiantes_EstudianteId')
    BEGIN
        ALTER TABLE [dbo].[ComunicacionDestinos]
            DROP CONSTRAINT [FK_ComunicacionDestinos_Estudiantes_EstudianteId];
    END;

    IF EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE name = 'FK_ComunicacionDestinos_Usuarios_TutorId')
    BEGIN
        ALTER TABLE [dbo].[ComunicacionDestinos]
            DROP CONSTRAINT [FK_ComunicacionDestinos_Usuarios_TutorId];
    END;

    DROP TABLE [dbo].[ComunicacionDestinos];
END;

IF OBJECT_ID('[dbo].[Comunicaciones]', 'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE name = 'FK_Comunicaciones_Usuarios_RemitenteId')
    BEGIN
        ALTER TABLE [dbo].[Comunicaciones]
            DROP CONSTRAINT [FK_Comunicaciones_Usuarios_RemitenteId];
    END;

    IF EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE name = 'FK_Comunicaciones_Cursos_CursoId')
    BEGIN
        ALTER TABLE [dbo].[Comunicaciones]
            DROP CONSTRAINT [FK_Comunicaciones_Cursos_CursoId];
    END;

    DROP TABLE [dbo].[Comunicaciones];
END;
", suppressTransaction: false);
        }
    }
}
