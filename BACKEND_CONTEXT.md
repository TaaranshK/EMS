# Employee Management System — Backend Context

This document describes the ASP.NET backend located at `Employee mangemnet System/` and how the frontend should call it.

## Overview

- **Runtime**: .NET 10
- **App style**: Controller-based Web API (`builder.Services.AddControllers(); app.MapControllers();`)
- **Database**: PostgreSQL via Entity Framework Core (`AppDbContext`)
- **Auth**: JWT Bearer tokens
- **Roles**: `SuperAdmin`, `Employee`
- **Base URL (dev)**: `http://localhost:5261`
- **API base**: `http://localhost:5261/api`
- **Swagger/OpenAPI (dev)**: enabled in `Development`

## Project layout (backend)

```
Employee mangemnet System/
  Program.cs
  appsettings.json
  appsettings.Development.json
  Controllers/
  Data/
    AppDbContext.cs
    SeedData.cs
    Domain/
    DTOs/
  Services/
  Migrations/
  Properties/launchSettings.json
```

## Running locally

Prereqs:
- PostgreSQL running and reachable from the connection string
- .NET SDK 10 installed

Commands:
```powershell
dotnet build "Employee mangemnet System\Employee mangemnet System.csproj"
dotnet run --project "Employee mangemnet System\Employee mangemnet System.csproj"
```

Ports / URLs:
- HTTP: `http://localhost:5261` (from `Properties/launchSettings.json`)
- HTTPS profile exists, but the app **only enables `UseHttpsRedirection()` outside Development** (`Program.cs`).

## Configuration (do not commit secrets)

`Employee mangemnet System/appsettings.json` contains:
- `ConnectionStrings:DefaultConnection`
- `Jwt:{Key,Issuer,Audience}`
- `Email:{SmtpHost,SmtpPort,SenderName,SenderEmail,SenderPassword}`

Important:
- Do **not** store real passwords/API keys in `appsettings.json` for shared repos.
- Prefer **User Secrets** (dev) or environment variables (prod). Use placeholders in committed config.

## CORS

Enabled policy name: `AllowFrontend` (see `Program.cs`).
- Allowed origins: `http://localhost:5173`, `http://localhost:5174`
- Allows any header + any method

## Authentication & authorization

### JWT claims

`AuthController` issues JWT tokens with claims:
- `ClaimTypes.NameIdentifier` = user id (GUID string)
- `ClaimTypes.Email`
- `ClaimTypes.Role` = `"SuperAdmin"` or `"Employee"`

### Frontend header

All protected calls must include:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Role rules (high level)

- **SuperAdmin**:
  - Dashboard stats
  - Employee CRUD
  - Invite (single/bulk)
  - View onboarding tasks for any employee
- **Employee**:
  - View/update own profile
  - View own onboarding tasks
  - Update own onboarding task statuses

## Seed data (development convenience)

`Data/SeedData.cs`:
- Ensures a SuperAdmin exists (by email) and, in Development, resets to a known password if needed.
  - Email: `admin@company.com`
  - Password: `AdminPass123!`
- Seeds employees if none exist (with a temporary password and `IsPasswordChanged = false`).

## Data model (EF Core)

### DbSets

`Data/AppDbContext.cs`:
- `Employees`
- `SuperAdmins`
- `OnboardingTasks`

### Entities (summary)

`Data/Domain/Employee.cs` (selected fields):
- Identity: `Id`
- Auth: `PasswordHash`, `TemporaryPassword`, `IsPasswordChanged`, `IsActive`
- Profile-ish: `Department`, `JobTitle`, `PhoneNumber`, `ProfilePhotoUrl`, `Address`, `DateOfBirth`, `Gender`, `LinkedInUrl`
- Payroll-ish: `Salary`
- `CreatedAt`

`Data/Domain/OnboardingTask.cs`:
- `Id`, `EmployeeId`, `Title`, `Description`
- `Status` (`Pending`, `InProgress`, `Completed`)
- `ScheduledAt`, `CreatedAt`, `CompletedAt`

`Data/Domain/SuperAdmin.cs`:
- `Id`, `FullName`, `Email`, `PasswordHash`, `CreatedAt`

## Controllers & endpoints

All routes are under `/api/...` (some controllers use absolute routes but still map there).

### AuthController (`/api/auth`)

- `POST /api/auth/superadmin-login`
  - Body: `{ email, password }`
  - Response: `{ token }`
- `POST /api/auth/employee-login`
  - Body: `{ email, password }`
  - Response:
    - If first login: `{ requiresPasswordChange: true, message: "..." }`
    - Else: `{ token }`
- `POST /api/auth/change-password`
  - Body: `{ email, temporaryPassword, newPassword }`
  - Response: `{ token, message }`

### DashboardController (`/api/dashboard`) — SuperAdmin

- `GET /api/dashboard/stats`
  - Response includes:
    - `totalEmployees`, `activeEmployees`, `inactiveEmployees`
    - `pendingOnboarding`, `onboardingComplete`
    - `byDepartment`: `[{ department, count }]`
    - `recentEmployees`: last 5 by `CreatedAt`

### EmployeeController (`/api/employees`) — SuperAdmin

- `GET /api/employees`
  - Query params:
    - `search` (matches first/last/email; contains; case-insensitive)
    - `department` (case-insensitive exact match)
    - `sortBy`: `firstName` | `lastName` | `createdAt`
    - `sortOrder`: `asc` | `desc`
      - Backend accepts both `sortOrder` and legacy `SortOrder`
    - `page` (default 1), `pageSize` (default 10)
  - Response: `{ totalRecords, totalPages, currentPage, pageSize, data: EmployeeDto[] }`
- `GET /api/employees/{id}`
  - Response: `EmployeeDto`
- `PUT /api/employees/{id}`
  - Body: `EmployeeDto` (used to update core fields)
  - Response: `{ message }`
- `DELETE /api/employees/{id}`
  - Response: `{ message }`

### InviteController (`/api/invite`) — SuperAdmin

- `POST /api/invite/Single` (single invite)
  - Body: `InviteEmployeeDto`
  - Side effects:
    - Creates employee with generated temporary password
    - Creates default onboarding tasks via `OnboardingService`
    - Sends email via `EmailService`
- `POST /api/invite/bulk` (bulk invite)
  - Content-Type: `multipart/form-data` with `file` (Excel)
  - Response: `{ results: string[] }`

Notes:
- The single-invite route uses `"Single"` (capital S). Routing is generally case-insensitive, but keep this in mind when debugging.
- Email template currently links to `http://localhost:3000/login` inside `EmailService.cs` (may not match the Vite dev server port).

### OnboardingTaskController (`/api/onboarding-tasks`)

- `GET /api/onboarding-tasks/my-tasks` — Employee
  - Response: `{ total, completed, progress, tasks: OnboardingTaskDto[] }`
- `PATCH /api/onboarding-tasks/{id}/status` — Employee
  - Body: `{ status }`
  - Response: `{ message }`
- `GET /api/onboarding-tasks/employee/{employeeId}` — SuperAdmin
  - Response: `{ total, completed, progress, tasks: OnboardingTaskDto[] }`

### ProfileController (`/api/profile`) — Employee

- `GET /api/profile/me`
  - Response: `EmployeeDto` (includes profile fields like address/dob/gender/linkedin/photoUrl/salary)
- `PUT /api/profile/update`
  - Body: `UpdateProfileDto`
  - Only non-null fields are applied.
  - Response: `{ message }`

## Services

### OnboardingService

`Services/OnboardingService.cs` creates the default onboarding tasks on invite:
- Interview
- Training Session
- Project Kickoff
- Discuss UX Goals
- Equipment Setup
- Meet The Team
- Complete Profile
- HR Policy Review

### EmailService

`Services/EmailService.cs` sends invite emails using SMTP (MailKit).

## Frontend integration notes (current)

- Frontend calls use base `http://localhost:5261/api` and includes the JWT token.
- Employees list filtering/sorting must send query params matching the backend:
  - `search`, `department`, `sortBy`, `sortOrder`, `page`, `pageSize`
- In this repo, the frontend service lives at:
  - `employee-management-frontend/src/services/Dashboard.js`
  - `employee-management-frontend/src/services/authServics.js`

