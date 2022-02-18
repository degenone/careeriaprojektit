using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NorthwindApi.Models
{
    public class FrontEndUserModel
    {
        public int LoginId { get; set; }
        public string Etunimi { get; set; }
        public string Sukunimi { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }
    }
}
