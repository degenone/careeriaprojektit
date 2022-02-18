using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PiLedGridWebApp.Models
{
    public class TelemetryModel
    {
        public float Humidity { get; set; }
        public float Temperature { get; set; }
        public float Pressure { get; set; }
        public float North { get; set; }
    }
}
