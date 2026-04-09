using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddHostelPhotos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HostelPhotos",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Url = table.Column<string>(type: "TEXT", nullable: false),
                    IsMain = table.Column<bool>(type: "INTEGER", nullable: false),
                    HostelId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HostelPhotos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HostelPhotos_Hostels_HostelId",
                        column: x => x.HostelId,
                        principalTable: "Hostels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HostelPhotos_HostelId",
                table: "HostelPhotos",
                column: "HostelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HostelPhotos");
        }
    }
}
