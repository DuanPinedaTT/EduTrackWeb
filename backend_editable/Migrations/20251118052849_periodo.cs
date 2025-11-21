using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace edutrack_academy_api.Migrations
{
    /// <inheritdoc />
    public partial class periodo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Periodo",
                table: "NotaConfigs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Periodo",
                table: "NotaConfigs");
        }
    }
}
