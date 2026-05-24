using Employee_mangemnet_System.Data;
using Employee_mangemnet_System.Data.Domain;

namespace Employee_mangemnet_System.Services
{
    public class OnboardingService
    {
        private readonly AppDbContext _db;

        public OnboardingService(AppDbContext db)
        {
            _db = db;
        }

        // Called automatically when employee is invited
        public async Task CreateDefaultTasksAsync(Guid employeeId)
        {
            var now = DateTime.UtcNow;

            // Default tasks every employee gets on onboarding
            var defaultTasks = new List<OnboardingTask>
            {
                new OnboardingTask
                {
                    EmployeeId  = employeeId,
                    Title       = "Interview",
                    Description = "Initial interview with HR",
                    ScheduledAt = now.AddDays(1)
                },
                new OnboardingTask
                {
                    EmployeeId  = employeeId,
                    Title       = "Training Session",
                    Description = "Complete mandatory company training",
                    ScheduledAt = now.AddDays(3)
                },
                new OnboardingTask
                {
                    EmployeeId  = employeeId,
                    Title       = "Project Kickoff",
                    Description = "Meet your team and understand your project",
                    ScheduledAt = now.AddDays(5)
                },
                new OnboardingTask
                {
                    EmployeeId  = employeeId,
                    Title       = "Discuss UX Goals",
                    Description = "Discuss goals and expectations with your manager",
                    ScheduledAt = now.AddDays(7)
                },
                new OnboardingTask
                {
                    EmployeeId  = employeeId,
                    Title       = "Equipment Setup",
                    Description = "Set up your laptop and required software",
                    ScheduledAt = now.AddDays(2)
                },
                new OnboardingTask
                {
                    EmployeeId  = employeeId,
                    Title       = "Meet The Team",
                    Description = "Introduction session with your department",
                    ScheduledAt = now.AddDays(4)
                },
                new OnboardingTask
                {
                    EmployeeId  = employeeId,
                    Title       = "Complete Profile",
                    Description = "Fill in your profile details and upload photo",
                    ScheduledAt = now.AddDays(2)
                },
                new OnboardingTask
                {
                    EmployeeId  = employeeId,
                    Title       = "HR Policy Review",
                    Description = "Read and acknowledge company HR policies",
                    ScheduledAt = now.AddDays(7)
                }
            };

            await _db.OnboardingTasks.AddRangeAsync(defaultTasks);
            await _db.SaveChangesAsync();
        }
    }
}