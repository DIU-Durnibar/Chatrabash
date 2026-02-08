using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    RoomNumber = table.Column<string>(type: "TEXT", nullable: false),
                    FloorNo = table.Column<int>(type: "INTEGER", nullable: false),
                    SeatCapacity = table.Column<int>(type: "INTEGER", nullable: false),
                    SeatAvailable = table.Column<int>(type: "INTEGER", nullable: false),
                    IsAttachedBathroomAvailable = table.Column<int>(type: "INTEGER", nullable: false),
                    IsBalconyAvailable = table.Column<int>(type: "INTEGER", nullable: false),
                    IsAcAvailable = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastModifiedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rooms");
        }
    }
}
