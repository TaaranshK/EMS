using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Hosting;
using MimeKit;
using System.Net;

public class EmailService
{
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;

    public EmailService(IConfiguration configuration, IWebHostEnvironment environment)
    {
        _configuration = configuration;
        _environment = environment;
    }

    public async Task SendInviteEmailAsync(
        string toEmail,
        string firstName,
        string temporaryPassword,
        string? frontendBaseUrlOverride = null)
    {
        var email = new MimeMessage();

        email.From.Add(new MailboxAddress(
            _configuration["Email:SenderName"] ?? "Employee Management",
            _configuration["Email:SenderEmail"] ?? "noreply@example.com"
        ));

        email.To.Add(new MailboxAddress(firstName, toEmail));

        var appName = _configuration["Email:AppName"] ?? "Employee Management System";
        email.Subject = $"You have been invited to {appName}";

        var frontendBaseUrl = ResolveFrontendBaseUrl(frontendBaseUrlOverride);
        var loginUrl = $"{frontendBaseUrl}/login?email={Uri.EscapeDataString(toEmail)}";
        var changePasswordUrl = $"{frontendBaseUrl}/change-password?email={Uri.EscapeDataString(toEmail)}";

        var templatePath = Path.Combine(_environment.ContentRootPath, "EmailTemplates", "InviteEmployee.html");
        var templateHtml = await File.ReadAllTextAsync(templatePath);
        var html = ApplyTemplate(templateHtml, new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["APP_NAME"] = appName,
            ["FIRST_NAME"] = firstName,
            ["USER_EMAIL"] = toEmail,
            ["TEMP_PASSWORD"] = temporaryPassword,
            ["LOGIN_URL"] = loginUrl,
            ["CHANGE_PASSWORD_URL"] = changePasswordUrl,
            ["YEAR"] = DateTime.UtcNow.Year.ToString()
        });

        var body = new TextPart("html")
        {
            Text = html
        };
        body.ContentType.Charset = "utf-8";
        email.Body = body;

        using var smtp = new SmtpClient();

        var smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
        var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
        var senderEmail = _configuration["Email:SenderEmail"] ?? "";
        var senderPassword = _configuration["Email:SenderPassword"] ?? "";

        await smtp.ConnectAsync(smtpHost, smtpPort, false);

        await smtp.AuthenticateAsync(senderEmail, senderPassword);

        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }

    private string ResolveFrontendBaseUrl(string? overrideValue)
    {
        var candidate = (overrideValue ?? string.Empty).Trim().TrimEnd('/');
        if (Uri.TryCreate(candidate, UriKind.Absolute, out var parsed) &&
            (parsed.Scheme == Uri.UriSchemeHttp || parsed.Scheme == Uri.UriSchemeHttps))
        {
            return $"{parsed.Scheme}://{parsed.Authority}";
        }

        var configured = (_configuration["Frontend:BaseUrl"] ?? "http://localhost:3000").Trim().TrimEnd('/');
        if (Uri.TryCreate(configured, UriKind.Absolute, out var configuredParsed) &&
            (configuredParsed.Scheme == Uri.UriSchemeHttp || configuredParsed.Scheme == Uri.UriSchemeHttps))
        {
            return $"{configuredParsed.Scheme}://{configuredParsed.Authority}";
        }

        return "http://localhost:3000";
    }

    private static string ApplyTemplate(string templateHtml, IReadOnlyDictionary<string, string> tokens)
    {
        var result = templateHtml;
        foreach (var (key, rawValue) in tokens)
        {
            var safeValue = WebUtility.HtmlEncode(rawValue ?? string.Empty);
            result = result.Replace($"{{{{{key}}}}}", safeValue, StringComparison.OrdinalIgnoreCase);
        }
        return result;
    }

    public async Task SendMeetingInviteEmailAsync(
        string toEmail,
        string firstName,
        string meetingTitle,
        string meetingUrl,
        DateTime scheduledAt,
        string? mode)
    {
        var email = new MimeMessage();

        email.From.Add(new MailboxAddress(
            _configuration["Email:SenderName"] ?? "Employee Management",
            _configuration["Email:SenderEmail"] ?? "noreply@example.com"
        ));

        email.To.Add(new MailboxAddress(firstName, toEmail));

        email.Subject = $"Meeting scheduled: {meetingTitle}";

        var modeLine = string.IsNullOrWhiteSpace(mode) ? "" : $"<p><strong>Mode:</strong> {mode}</p>";

        email.Body = new TextPart("html")
        {
            Text = $@"
                <h2>Hi {firstName},</h2>
                <p>You have been invited to a meeting.</p>
                <p><strong>Title:</strong> {meetingTitle}</p>
                {modeLine}
                <p><strong>Scheduled At:</strong> {scheduledAt.ToLocalTime():f}</p>
                <p><strong>Meeting Link:</strong> <a href='{meetingUrl}'>Join meeting</a></p>
                <br/>
                <p>— Employee Management System</p>
            "
        };

        using var smtp = new SmtpClient();

        var smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
        var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
        var senderEmail = _configuration["Email:SenderEmail"] ?? "";
        var senderPassword = _configuration["Email:SenderPassword"] ?? "";

        await smtp.ConnectAsync(smtpHost, smtpPort, false);
        await smtp.AuthenticateAsync(senderEmail, senderPassword);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}
