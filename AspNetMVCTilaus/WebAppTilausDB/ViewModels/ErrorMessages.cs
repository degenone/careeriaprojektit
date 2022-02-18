using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAppTilausDB.ViewModels
{
    public static class ErrorMessages
    {
        public static string Lupa() => "Sinulla ei ole lupaa tähän sivuun tai toimintoon.\r\nYou do not have permission to view this directory or page.";
        public static string EiLoydy() => "Hakemaasi kohdetta ei löydy, se on poistettu, sen ID muutettu tai se ei ole väliaikaisesti saatavilla.\r\nThe resource you are looking for has been removed, had its ID changed, or is temporarily unavailable.";
        public static string HuonoHaku() => "Huono pyyntö. Varmista, että URL on kirjoitettu oikein.\r\nBad request. Make sure you have an ID in the URL.";
    }
}