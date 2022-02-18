using System;
using System.Collections.Generic;

namespace NorthwindApi.Models
{
    public partial class ReactLogins
    {
        public int LoginId { get; set; }
        public string Etunimi { get; set; }
        public string Sukunimi { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int Rooli { get; set; }
    }
}
