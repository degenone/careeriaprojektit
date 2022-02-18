using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAppTilausDB.ViewModels
{
    public class KirjautumisModel
    {
        [Required(ErrorMessage = "Käyttäjänimi tarvitaan kirjautumiseen")]
        [Display(Name = "Käyttäjänimi")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Käyttäjänimen pitää olla vähintään 3 merkkiä pitkä.")]
        public string KayttajaNimi { get; set; }
        [Required(ErrorMessage = "Salasana tarvitaan kirjautumiseen")]
        [Display(Name = "Salasana")]
        [DataType(DataType.Password)]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Salasana pitää olla vähintään 3 merkkiä pitkä.")]
        public string Salasana { get; set; }
        [Display(Name = "Vahvista salasana")]
        [DataType(DataType.Password)]
        [Compare("Salasana", ErrorMessage = "Salasanojen pitää täsmätä.")]
        public string VarmistaSalasana { get; set; }
        public string KirjautumisVirheViesti { get; set; }
    }
}