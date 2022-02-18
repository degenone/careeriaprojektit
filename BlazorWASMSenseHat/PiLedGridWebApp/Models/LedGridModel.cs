using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PiLedGridWebApp.Models
{
    public class LedGridModel
    {
        //[Required]
        //[Display(Name = "Raspberry Pi IP address")]
        //[StringLength(15, ErrorMessage = "Ip address too long (max 15).")]
        //[ValidIpAddress(ErrorMessage = "{0} is invalid.")]
        //public string PiIpAddress { get; set; }
        //[Required]
        //[Display(Name = "Api Port")]
        //[MinValue(1, ErrorMessage = "{0} must be at least {1}")]
        //[MaxValue(65_535, ErrorMessage = "{0} cannot be higher than {1}")]
        //public int ApiPort { get; set; } = 8000;
        public string[] Colors { get; set; }
        public LedGridModel()
        {
            Colors = new string[64];
            DefaultGrid();
        }

        public void DefaultGrid()
        {
            for (int i = 0; i < Colors.Length; i++)
            {
                Colors[i] = "#000000";
            }
        }
    }
}
