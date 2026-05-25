using Microsoft.EntityFrameworkCore;
using Employee_mangemnet_System.Data.Domain;

namespace Employee_mangemnet_System.Data
{
    public class AppDbContext : DbContext
    {
        // This Is A Constructor That Is passing options to the Base Class 
        public AppDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
        }

        // These Represent The Tables In Postgre SQL 
        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<SuperAdmin> SuperAdmins { get; set; } = null!;
        public DbSet<OnboardingTask> OnboardingTasks { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Message>()
                .HasIndex(m => m.SenderId);

            modelBuilder.Entity<Message>()
                .HasIndex(m => m.ReceiverId);
        }
    }
}
