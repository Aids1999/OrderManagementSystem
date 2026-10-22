using System.Globalization;
using System.Net.Mail;

namespace OrderManagement.Api.Domain;

public static class Guard
{
    public static string RequiredString(string? value, string field, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException($"{field} обязательно");

        var result = value.Trim();
        if (result.Length > maxLength)
            throw new DomainException($"{field} не должно быть длиннее {maxLength} символов");

        return result;
    }

    public static string Email(string? value)
    {
        var result = RequiredString(value, "Email", 100).ToLowerInvariant();
        try
        {
            if (new MailAddress(result).Address != result)
                throw new FormatException();
        }
        catch (FormatException)
        {
            throw new DomainException("Некорректный email");
        }
        return result;
    }

    public static string Password(string? value)
    {
        var result = RequiredString(value, "Пароль", 100);
        if (result.Length < 6)
            throw new DomainException("Пароль должен содержать не меньше 6 символов");
        return result;
    }

    public static int PositiveId(int? value, string field)
    {
        if (value is null or <= 0)
            throw new DomainException($"{field} должен быть положительным числом");
        return value.Value;
    }

    public static decimal PositiveNumber(decimal? value, string field)
    {
        if (value is null or <= 0)
            throw new DomainException($"{field} должно быть положительным числом");
        return value.Value;
    }

    public static string Date(string? value)
    {
        var result = RequiredString(value, "Срок", 10);
        if (!DateOnly.TryParseExact(result, "yyyy-MM-dd", CultureInfo.InvariantCulture,
                DateTimeStyles.None, out _))
            throw new DomainException("Срок должен быть датой в формате ГГГГ-ММ-ДД");
        return result;
    }
}
