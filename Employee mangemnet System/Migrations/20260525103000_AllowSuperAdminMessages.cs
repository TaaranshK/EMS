using Employee_mangemnet_System.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Employee_mangemnet_System.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(AppDbContext))]
    [Migration("20260525103000_AllowSuperAdminMessages")]
    public partial class AllowSuperAdminMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Messages" DROP CONSTRAINT IF EXISTS "FK_Messages_Employees_SenderId";
                ALTER TABLE "Messages" DROP CONSTRAINT IF EXISTS "FK_Messages_Employees_ReceiverId";
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
