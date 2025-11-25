using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace edutrack_academy_api.Migrations
{
    /// <inheritdoc />
    public partial class EnsureEstudianteUsuarioId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"IF COL_LENGTH('[dbo].[Estudiantes]', 'UsuarioId') IS NULL
BEGIN
    ALTER TABLE [dbo].[Estudiantes] ADD [UsuarioId] INT NULL;
END;

IF COL_LENGTH('[dbo].[Estudiantes]', 'UsuarioId') IS NOT NULL
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM sys.indexes
        WHERE name = 'IX_Estudiantes_UsuarioId'
          AND object_id = OBJECT_ID('[dbo].[Estudiantes]'))
    BEGIN
        CREATE INDEX [IX_Estudiantes_UsuarioId]
            ON [dbo].[Estudiantes]([UsuarioId]);
    END;

    IF NOT EXISTS (
        SELECT 1 FROM sys.foreign_keys
        WHERE name = 'FK_Estudiantes_Usuarios_UsuarioId')
    BEGIN
        ALTER TABLE [dbo].[Estudiantes]
            WITH CHECK ADD CONSTRAINT [FK_Estudiantes_Usuarios_UsuarioId]
            FOREIGN KEY([UsuarioId]) REFERENCES [dbo].[Usuarios]([Id])
            ON DELETE SET NULL;
    END;
END;",
                suppressTransaction: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"IF EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_Estudiantes_Usuarios_UsuarioId')
BEGIN
    ALTER TABLE [dbo].[Estudiantes]
        DROP CONSTRAINT [FK_Estudiantes_Usuarios_UsuarioId];
END;

IF EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_Estudiantes_UsuarioId'
      AND object_id = OBJECT_ID('[dbo].[Estudiantes]'))
BEGIN
    DROP INDEX [IX_Estudiantes_UsuarioId]
        ON [dbo].[Estudiantes];
END;

IF COL_LENGTH('[dbo].[Estudiantes]', 'UsuarioId') IS NOT NULL
BEGIN
    ALTER TABLE [dbo].[Estudiantes]
        DROP COLUMN [UsuarioId];
END;",
                suppressTransaction: false);
        }
    }
}
