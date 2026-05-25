using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Employee_mangemnet_System.Data;
using Employee_mangemnet_System.Data.Domain;
using Employee_mangemnet_System.Services;
using BCrypt.Net;

//USe Builder
var builder = WebApplication.CreateBuilder(args);


//Add Controllers
builder.Services.AddControllers();
//Add OpenAPI
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

/// Add PostgreSQL Connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? ""))
        };

        // This allows SignalR to read JWT from query string
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/chat"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

//  Add CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

//  Register Services
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<OnboardingService>();

// Add SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// Middleware 
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

//  Enable CORS BEFORE UseHttpsRedirection
app.UseCors("AllowFrontend");

// Avoid redirecting frontend http://localhost:5261 calls to https during development
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseAuthentication(); // Must come before Authorization
app.UseAuthorization();
app.MapControllers();

// Map SignalR Hub
app.MapHub<ChatHub>("/hubs/chat");

// Initialize database with seed data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    SeedData.Initialize(db, app.Environment.IsDevelopment());
}

app.Run();
