using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace edutrack_academy_api.Migrations
{
    /// <inheritdoc />
    public partial class SeedPasswordsRefresh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Administradores",
                keyColumn: "Id",
                keyValue: 1,
                column: "FechaRegistro",
                value: new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2483));

            migrationBuilder.UpdateData(
                table: "Administradores",
                keyColumn: "Id",
                keyValue: 2,
                column: "FechaRegistro",
                value: new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2487));

            migrationBuilder.UpdateData(
                table: "Administradores",
                keyColumn: "Id",
                keyValue: 3,
                column: "FechaRegistro",
                value: new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2488));

            migrationBuilder.UpdateData(
                table: "Profesores",
                keyColumn: "Id",
                keyValue: 1,
                column: "FechaIngreso",
                value: new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2696));

            migrationBuilder.UpdateData(
                table: "Profesores",
                keyColumn: "Id",
                keyValue: 2,
                column: "FechaIngreso",
                value: new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2701));

            migrationBuilder.UpdateData(
                table: "Profesores",
                keyColumn: "Id",
                keyValue: 3,
                column: "FechaIngreso",
                value: new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2703));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2350), "$2a$11$hUQWqGG5.yWyM/qqiHKF4uxRXLbYvGcXkXhH5u6yrSqhEvWrkN3CO" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2357), "$2a$11$qvllrbCaMbGgYllRCgvL/ewadMQK0Y0xFyPJHbKiROon3GgTB0tN2" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2359), "$2a$11$bSnUxtpacM98uXY0SX1rTOOJUXJG3OCM5UVzBaSiBLvWWW0kWfwJu" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2361), "$2a$11$oixTIg92I4Pfm5TUafTLe.D3atM/eQNY3PORqf4Z3cFFBNklcHmpq" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2362), "$2a$11$OubtyYofmljpSC0TooyC0uUR2FGPP8XrYCCRvrSiu0JZW9/BCCQU6" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2365), "$2a$11$aOVh.JyjDYjih70j9g/jwu3b4WRSFn0pfSCvCqQdLnpU5GtWtW4zC" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2366), "$2a$11$Mi70yXzDH8aqBCCn45bkk..dKm3xZmbLMBdErkWzpgzxiFG3Dhv76" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2367), "$2a$11$2cpxkHQJT/6voaIPqNFHsexie2arprDlffJxVsesaEDqwvgTj.tFK" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 56, 3, 372, DateTimeKind.Utc).AddTicks(2368), "$2a$11$vO3ZrqzQCN3pzQwGGNOq8u7fKUcrWUng80aZWb4ZpKNKqH9DW/M2e" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Administradores",
                keyColumn: "Id",
                keyValue: 1,
                column: "FechaRegistro",
                value: new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3936));

            migrationBuilder.UpdateData(
                table: "Administradores",
                keyColumn: "Id",
                keyValue: 2,
                column: "FechaRegistro",
                value: new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3941));

            migrationBuilder.UpdateData(
                table: "Administradores",
                keyColumn: "Id",
                keyValue: 3,
                column: "FechaRegistro",
                value: new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3942));

            migrationBuilder.UpdateData(
                table: "Profesores",
                keyColumn: "Id",
                keyValue: 1,
                column: "FechaIngreso",
                value: new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(4160));

            migrationBuilder.UpdateData(
                table: "Profesores",
                keyColumn: "Id",
                keyValue: 2,
                column: "FechaIngreso",
                value: new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(4164));

            migrationBuilder.UpdateData(
                table: "Profesores",
                keyColumn: "Id",
                keyValue: 3,
                column: "FechaIngreso",
                value: new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(4165));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3788), "$2a$11$b6uWBSEetnNYUt0fR2N2b.C9yA443GndOniPIOy4RqVHKfU6EXylK" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3796), "$2a$11$F40K44fW8J0gyyoWXPf4nOJRe/ZHHp6nzhAGKyolfCYW6a9xshRuu" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3798), "$2a$11$4zUFBLeIJfBJjwvGzZhYOOFseetOcdFGVQyW1NUcE9oGNzxFMlMYG" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3799), "$2a$11$TJbxu6dVaNyjhBDn7t2hS.cn32ihxTNltcSk5r97MuBZliRFbBvy." });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3801), "$2a$11$hPC66/NNzgrMtMN6odDfwer5ztJz9jRH8qPuBg9ve9NcYQJzRgnKO" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3804), "$2a$11$A7MyTpXoRR7Ijnwt/3dMqemAARofRpgBLsX0dk6IvLvqvqBc89lKO" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3805), "$2a$11$UBqkCYm1rmnMZtalVJ2EHeXCjZvcwt/Cckf731zIzIgI1fLRe/flW" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3806), "$2a$11$rRq2ylS2LrM0m2A51QQOdOiReLqOUyiGePHucAkaco4eqivUi/QYi" });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreadoEn", "PasswordHash" },
                values: new object[] { new DateTime(2025, 11, 23, 2, 10, 37, 978, DateTimeKind.Utc).AddTicks(3808), "$2a$11$.9aZfR3Pg1.B8vLwjvgxsuShtAOMxegHN9gfek0Jj.J0zUe94y7w6" });
        }
    }
}
