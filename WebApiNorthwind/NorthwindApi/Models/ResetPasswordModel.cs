using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NorthwindApi.Models
{
    public class ResetPasswordModel
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
