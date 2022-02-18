using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebAppTilausDB.Models;

namespace WebAppTilausDB.ViewModels
{
    public class TuoteModel
    {
        public Tuotteet TuoteTieto { get; set; }
        [MaxKuvanKoko(MaxTiedostoKoko = 1024 * 1024 / 10, ErrorMessage = "Tiedosto ei kelpaa.")]
        public HttpPostedFileBase KuvaTiedosto { get; set; }
    }
}