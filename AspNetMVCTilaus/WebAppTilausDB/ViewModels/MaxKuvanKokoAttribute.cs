using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAppTilausDB.ViewModels
{
    public class MaxKuvanKokoAttribute : ValidationAttribute
    {
        public int MaxTiedostoKoko = int.MaxValue;

        public override bool IsValid(object value)
        {
            if (!(value is HttpPostedFileBase kuva))
            {
                return true;
            }

            if (kuva.ContentLength > MaxTiedostoKoko)
            {
                ErrorMessage = $"Kuva on liian iso, kuva saa olla maximissa {MaxTiedostoKoko / 1024} KB.";
                return false;
            }

            return true;
        }
    }
}