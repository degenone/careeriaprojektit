using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace WebAppTilausDB.ViewModels
{
    public class KuvanMuokkausModel
    {
        public byte[] KuvaBiteiksi(HttpPostedFileBase tiedosto)
        {
            byte[] kuva;
            using (Stream stream = tiedosto.InputStream)
            {
                if (!(stream is MemoryStream memoryStream))
                {
                    memoryStream = new MemoryStream();
                    stream.CopyTo(memoryStream);
                }
                kuva = memoryStream.ToArray();
            }
            return kuva;
        }
    }
}