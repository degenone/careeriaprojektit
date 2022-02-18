using System;
using System.Globalization;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace PiLedGridWebApp.Models
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false, Inherited = false)]
    public class ValidIpAddress : ValidationAttribute
    {
        private static readonly Regex _re = new(@"^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$", RegexOptions.Compiled, TimeSpan.FromMilliseconds(250));
        public override bool IsValid(object value)
        {
            Match match = _re.Match((value as string).Trim());
            if (!match.Success)
            {
                return false;
            }
            GroupCollection groups = match.Groups;
            for (int i = 1; i < groups.Count; i++)
            {
                if (!int.TryParse(groups[i].Value, out int val) || val < 0 || val > 255)
                {
                    return false;
                }
            }
            return true;
        }

        public override string FormatErrorMessage(string name)
            => string.Format(CultureInfo.CurrentCulture, ErrorMessageString, name);
    }

    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class MinValue : ValidationAttribute
    {
        private readonly int _min;
        public int Min { get => _min; }
        public MinValue(int min) => _min = min;

        public override bool IsValid(object value) => (int)value >= _min;

        public override string FormatErrorMessage(string name)
            => string.Format(CultureInfo.CurrentCulture, ErrorMessageString, name, this.Min);
    }

    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class MinFloatValue : ValidationAttribute
    {
        private readonly float _min;
        public float Min { get => _min; }
        public MinFloatValue(float min) => _min = min;

        public override bool IsValid(object value) => (float)value >= _min;

        public override string FormatErrorMessage(string name)
            => string.Format(CultureInfo.CurrentCulture, ErrorMessageString, name, this.Min);
    }

    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class MaxValue : ValidationAttribute
    {
        private readonly int _max;
        public int Max { get => _max;  }
        public MaxValue(int max) => _max = max;

        public override bool IsValid(object value) => (int)value <= _max;
        public override string FormatErrorMessage(string name)
            => string.Format(CultureInfo.CurrentCulture, ErrorMessageString, name, this.Max);
    }

    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class MaxFloatValue : ValidationAttribute
    {
        private readonly float _max;
        public float Max { get => _max;  }
        public MaxFloatValue(float max) => _max = max;

        public override bool IsValid(object value) => (float)value <= _max;
        public override string FormatErrorMessage(string name)
            => string.Format(CultureInfo.CurrentCulture, ErrorMessageString, name, this.Max);
    }
}
