using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Employee_mangemnet_System.Data;
using Employee_mangemnet_System.Data.DTOs;

namespace Employee_mangemnet_System.Controllers
{
    [ApiController]
    [Route("/api/employees")]
    [Authorize(Roles = "SuperAdmin")]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _db;
        public EmployeeController(AppDbContext db)
        {
            _db = db;
        }

        // Applying The Filtering Logic Like
        //GET /api/employees?search=Taaransh&department=Tech&sortBy=firstName&sortOrder=asc&page=1&pageSize=10

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] string? department,
            [FromQuery] string? sortBy,
            // Frontend uses `sortOrder` (camelCase); keep `SortOrder` for backward compatibility.
            [FromQuery(Name = "sortOrder")] string? sortOrder,
            [FromQuery] string? SortOrder,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            //Start With All The Employees
            var query = _db.Employees.AsQueryable();

            //Filtering 
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.ToLower();
                query = query.Where(e =>
                e.FirstName.ToLower().Contains(s) ||
                e.LastName.ToLower().Contains(s) ||
                e.Email.ToLower().Contains(s));
            }
            if (!string.IsNullOrWhiteSpace(department))
            {
                query = query.Where(e =>
                e.Department != null &&
                e.Department.ToLower() == department.ToLower());

            }
            //Sorting 
            var effectiveSortOrder = sortOrder ?? SortOrder;
            query = (sortBy?.ToLower(), effectiveSortOrder?.ToLower()) switch
            {

                ("firstname", "desc") => query.OrderByDescending(e => e.FirstName),
                ("firstname", _) => query.OrderBy(e => e.FirstName),
                ("lastname", "desc") => query.OrderByDescending(e => e.LastName),
                ("lastname", _) => query.OrderBy(e => e.LastName),
                ("createdat", "desc") => query.OrderByDescending(e => e.CreatedAt),
                ("createdat", _) => query.OrderBy(e => e.CreatedAt),
                _ => query.OrderBy(e => e.CreatedAt) // default
            };

            //  PAGINATION 
            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            var employees = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // MAP TO THE DTO
            var result = employees.Select(e => new EmployeeDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Department = e.Department,
                JobTitle = e.JobTitle,
                PhoneNumber = e.PhoneNumber,
                IsActive = e.IsActive,
                IsPasswordChanged = e.IsPasswordChanged,
                CreatedAt = e.CreatedAt
            });
            return Ok(new
            {
                totalRecords,
                totalPages,
                currentPage = page,
                pageSize,
                data = result
            });
        }

        // GET /api/employees/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var employee = await _db.Employees.FindAsync(id);

            if (employee == null)
                return NotFound(new { error = "Employee not found" });

            var dto = new EmployeeDto
            {
                Id = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Email = employee.Email,
                Department = employee.Department,
                JobTitle = employee.JobTitle,
                PhoneNumber = employee.PhoneNumber,
                IsActive = employee.IsActive,
                IsPasswordChanged = employee.IsPasswordChanged,
                CreatedAt = employee.CreatedAt
            };

            return Ok(dto);
        }

        // PUT /api/employees/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] EmployeeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var employee = await _db.Employees.FindAsync(id);

            if (employee == null)
                return NotFound(new { error = "Employee not found" });

            employee.FirstName = dto.FirstName;
            employee.LastName = dto.LastName;
            employee.Email = dto.Email;
            employee.Department = dto.Department;
            employee.JobTitle = dto.JobTitle;
            employee.PhoneNumber = dto.PhoneNumber;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Employee updated successfully" });
        }

        // DELETE /api/employees/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var employee = await _db.Employees.FindAsync(id);

            if (employee == null)
                return NotFound(new { error = "Employee not found" });

            _db.Employees.Remove(employee);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Employee deleted successfully" });
        }
    }
}
