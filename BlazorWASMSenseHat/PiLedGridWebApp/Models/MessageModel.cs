using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PiLedGridWebApp.Models
{
    public class MessageModel
    {
        [Required]
        public string Message { get; set; }
        [MinFloatValue(0.01f, ErrorMessage = "{0} must be at least {1}")]
        [MaxFloatValue(1.0f, ErrorMessage = "{0} cannot be higher than {1}")]
        public float Speed { get; set; } = 0.1f;
        public string ForegroundColor { get; set; } = "#EEEEEE";
        public string BackgroundColor { get; set; } = "#000000";
    }
}
