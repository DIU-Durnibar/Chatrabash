using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLocationEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AreaDescription",
                table: "Hostels",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DistrictId",
                table: "Hostels",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DivisionId",
                table: "Hostels",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpazilaId",
                table: "Hostels",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Divisions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    BengaliName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Divisions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Districts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DivisionId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    BengaliName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Districts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Districts_Divisions_DivisionId",
                        column: x => x.DivisionId,
                        principalTable: "Divisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Upazilas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DistrictId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    BengaliName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Upazilas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Upazilas_Districts_DistrictId",
                        column: x => x.DistrictId,
                        principalTable: "Districts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Hostels_DistrictId",
                table: "Hostels",
                column: "DistrictId");

            migrationBuilder.CreateIndex(
                name: "IX_Hostels_DivisionId",
                table: "Hostels",
                column: "DivisionId");

            migrationBuilder.CreateIndex(
                name: "IX_Hostels_UpazilaId",
                table: "Hostels",
                column: "UpazilaId");

            migrationBuilder.CreateIndex(
                name: "IX_Districts_DivisionId",
                table: "Districts",
                column: "DivisionId");

            migrationBuilder.CreateIndex(
                name: "IX_Upazilas_DistrictId",
                table: "Upazilas",
                column: "DistrictId");

            migrationBuilder.AddForeignKey(
                name: "FK_Hostels_Districts_DistrictId",
                table: "Hostels",
                column: "DistrictId",
                principalTable: "Districts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Hostels_Divisions_DivisionId",
                table: "Hostels",
                column: "DivisionId",
                principalTable: "Divisions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Hostels_Upazilas_UpazilaId",
                table: "Hostels",
                column: "UpazilaId",
                principalTable: "Upazilas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hostels_Districts_DistrictId",
                table: "Hostels");

            migrationBuilder.DropForeignKey(
                name: "FK_Hostels_Divisions_DivisionId",
                table: "Hostels");

            migrationBuilder.DropForeignKey(
                name: "FK_Hostels_Upazilas_UpazilaId",
                table: "Hostels");

            migrationBuilder.DropTable(
                name: "Upazilas");

            migrationBuilder.DropTable(
                name: "Districts");

            migrationBuilder.DropTable(
                name: "Divisions");

            migrationBuilder.DropIndex(
                name: "IX_Hostels_DistrictId",
                table: "Hostels");

            migrationBuilder.DropIndex(
                name: "IX_Hostels_DivisionId",
                table: "Hostels");

            migrationBuilder.DropIndex(
                name: "IX_Hostels_UpazilaId",
                table: "Hostels");

            migrationBuilder.DropColumn(
                name: "AreaDescription",
                table: "Hostels");

            migrationBuilder.DropColumn(
                name: "DistrictId",
                table: "Hostels");

            migrationBuilder.DropColumn(
                name: "DivisionId",
                table: "Hostels");

            migrationBuilder.DropColumn(
                name: "UpazilaId",
                table: "Hostels");
        }
    }
}
