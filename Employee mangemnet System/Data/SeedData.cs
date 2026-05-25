using Employee_mangemnet_System.Data.Domain;
using BCrypt.Net;

namespace Employee_mangemnet_System.Data
{
    public static class SeedData
    {
        public static void Initialize(AppDbContext dbContext, bool isDevelopment = false)
        {
            // Seed / ensure SuperAdmin (dev-friendly: upsert by email)
            var adminEmail = "admin@company.com";
            var adminPassword = "AdminPass123!";
            var existingAdmin = dbContext.SuperAdmins.FirstOrDefault(s => s.Email == adminEmail);
            if (existingAdmin == null)
            {
                var superAdmin = new SuperAdmin
                {
                    FullName = "Raj Kumar",
                    Email = adminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                    CreatedAt = DateTime.UtcNow
                };

                dbContext.SuperAdmins.Add(superAdmin);
                dbContext.SaveChanges();
            }
            else if (isDevelopment && !BCrypt.Net.BCrypt.Verify(adminPassword, existingAdmin.PasswordHash))
            {
                // In development, keep the known password working to avoid lock-outs after reseeds/tests
                existingAdmin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword);
                dbContext.SaveChanges();
            }

            // Seed Taaransh Kapoor as SuperAdmin
            var taaranshEmail = "taaransh.kapoor@gmail.com";
            var taaranshPassword = "Guddiguddi13@";
            var existingTaaransh = dbContext.SuperAdmins.FirstOrDefault(s => s.Email == taaranshEmail);
            if (existingTaaransh == null)
            {
                var superAdminTaaransh = new SuperAdmin
                {
                    FullName = "Taaransh Kapoor",
                    Email = taaranshEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(taaranshPassword),
                    CreatedAt = DateTime.UtcNow
                };

                dbContext.SuperAdmins.Add(superAdminTaaransh);
                dbContext.SaveChanges();
            }
            else if (isDevelopment && !BCrypt.Net.BCrypt.Verify(taaranshPassword, existingTaaransh.PasswordHash))
            {
                // In development, keep the known password working to avoid lock-outs after reseeds/tests
                existingTaaransh.PasswordHash = BCrypt.Net.BCrypt.HashPassword(taaranshPassword);
                dbContext.SaveChanges();
            }

            // Seed Employees with Indian Names
            if (!dbContext.Employees.Any())
            {
                var employees = new[]
                {
                    new Employee
                    {
                        FirstName = "Arjun",
                        LastName = "Sharma",
                        Email = "arjun.sharma@company.com",
                        TemporaryPassword = "TempPass123!",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("TempPass123!"),
                        Department = "Engineering",
                        JobTitle = "Senior Software Developer",
                        PhoneNumber = "+91-9876543210",
                        IsPasswordChanged = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Employee
                    {
                        FirstName = "Priya",
                        LastName = "Patel",
                        Email = "priya.patel@company.com",
                        TemporaryPassword = "TempPass123!",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("TempPass123!"),
                        Department = "Human Resources",
                        JobTitle = "HR Manager",
                        PhoneNumber = "+91-9876543211",
                        IsPasswordChanged = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Employee
                    {
                        FirstName = "Rohan",
                        LastName = "Verma",
                        Email = "rohan.verma@company.com",
                        TemporaryPassword = "TempPass123!",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("TempPass123!"),
                        Department = "Sales",
                        JobTitle = "Sales Executive",
                        PhoneNumber = "+91-9876543212",
                        IsPasswordChanged = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Employee
                    {
                        FirstName = "Neha",
                        LastName = "Singh",
                        Email = "neha.singh@company.com",
                        TemporaryPassword = "TempPass123!",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("TempPass123!"),
                        Department = "Finance",
                        JobTitle = "Finance Analyst",
                        PhoneNumber = "+91-9876543213",
                        IsPasswordChanged = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Employee
                    {
                        FirstName = "Vikram",
                        LastName = "Gupta",
                        Email = "vikram.gupta@company.com",
                        TemporaryPassword = "TempPass123!",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("TempPass123!"),
                        Department = "Engineering",
                        JobTitle = "Full Stack Developer",
                        PhoneNumber = "+91-9876543214",
                        IsPasswordChanged = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Employee
                    {
                        FirstName = "Anjali",
                        LastName = "Reddy",
                        Email = "anjali.reddy@company.com",
                        TemporaryPassword = "TempPass123!",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("TempPass123!"),
                        Department = "Marketing",
                        JobTitle = "Marketing Manager",
                        PhoneNumber = "+91-9876543215",
                        IsPasswordChanged = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                dbContext.Employees.AddRange(employees);
                dbContext.SaveChanges();
            }
            else if (isDevelopment)
            {
                // Ensure at least one known employee account exists with a known password
                var empEmail = "arjun.sharma@company.com";
                var empPassword = "TempPass123!";
                var emp = dbContext.Employees.FirstOrDefault(e => e.Email == empEmail);
                if (emp == null)
                {
                    emp = new Employee
                    {
                        FirstName = "Arjun",
                        LastName = "Sharma",
                        Email = empEmail,
                        TemporaryPassword = empPassword,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(empPassword),
                        Department = "Engineering",
                        JobTitle = "Senior Software Developer",
                        PhoneNumber = "+91-9876543210",
                        IsPasswordChanged = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    dbContext.Employees.Add(emp);
                    dbContext.SaveChanges();
                }
                else
                {
                    // Make sure the account can login
                    if (!BCrypt.Net.BCrypt.Verify(empPassword, emp.PasswordHash))
                        emp.PasswordHash = BCrypt.Net.BCrypt.HashPassword(empPassword);
                    emp.TemporaryPassword ??= empPassword;
                    emp.IsActive = true;
                    dbContext.SaveChanges();
                }
            }
        }
    }
}
