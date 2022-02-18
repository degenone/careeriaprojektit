using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebAppTilausDB.ViewModels
{
    public class TilauksenRivit
    {
        public int TilausriviID { get; set; }
        public int TilausID { get; set; }
        [Display(Name = "Tuotteen nimi")]
        public string Tuote { get; set; }
        [Display(Name = "Määrä")]
        public int Maara { get; set; }
        [Display(Name = "A-hinta")]
        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Ahinta { get; set; }
        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Summa 
        {
            get
            {
                return Ahinta * Maara;
            }
        }
    }
}