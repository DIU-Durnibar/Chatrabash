using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSubscriptionAndSuperAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Hostels",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "SubscriptionPackageId",
                table: "Hostels",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SubscriptionPackages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    MonthlyPrice = table.Column<decimal>(type: "TEXT", nullable: false),
                    MaxBoarders = table.Column<int>(type: "INTEGER", nullable: false),
                    Features = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionPackages", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Hostels_SubscriptionPackageId",
                table: "Hostels",
                column: "SubscriptionPackageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Hostels_SubscriptionPackages_SubscriptionPackageId",
                table: "Hostels",
                column: "SubscriptionPackageId",
                principalTable: "SubscriptionPackages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hostels_SubscriptionPackages_SubscriptionPackageId",
                table: "Hostels");

            migrationBuilder.DropTable(
                name: "SubscriptionPackages");

            migrationBuilder.DropIndex(
                name: "IX_Hostels_SubscriptionPackageId",
                table: "Hostels");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Hostels");

            migrationBuilder.DropColumn(
                name: "SubscriptionPackageId",
                table: "Hostels");
        }
    }
}
