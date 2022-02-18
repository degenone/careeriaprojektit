using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebAppTilausDB.Models;

namespace WebAppTilausDB.ViewModels
{
    public class MyydyimmatTuotteetModel
    {
        public int TuoteID { get; set; }
        public string Nimi { get; set; }
        public decimal? Ahinta { get; set; }
        public byte[] Kuva { get; set; }
        public decimal Myynti { get; set; }
    }
}