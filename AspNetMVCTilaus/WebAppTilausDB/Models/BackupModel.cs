using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAppTilausDB.Models
{
    public class BackupModel
    {
    }

    public partial class Asiakkaat
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Asiakkaat()
        {
            this.Tilaukset = new HashSet<Tilaukset>();
        }

        public int AsiakasID { get; set; }
        [Display(Name = "Asiakas")]
        public string Nimi { get; set; }
        public string Osoite { get; set; }
        [DataType(DataType.PostalCode)]
        public string Postinumero { get; set; }
        public Nullable<int> Vastuumyyja { get; set; }
        [Range(1, 999999)]
        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(18, 2)")]
        public Nullable<decimal> Luottoraja { get; set; }
        [DataType(DataType.Url)]
        [Display(Name = "Www-sivut")]
        public string www_sivut { get; set; }

        public virtual Henkilot Henkilot { get; set; }
        public virtual Postitoimipaikat Postitoimipaikat { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Tilaukset> Tilaukset { get; set; }
    }

    public partial class Henkilot
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Henkilot()
        {
            this.Asiakkaat = new HashSet<Asiakkaat>();
        }

        public int Henkilo_id { get; set; }
        public string Etunimi { get; set; }
        public string Sukunimi { get; set; }
        public string Osoite { get; set; }
        public Nullable<int> Esimies { get; set; }
        [DataType(DataType.PostalCode)]
        public string Postinumero { get; set; }
        [DataType(DataType.EmailAddress)]
        public string Sahkoposti { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Asiakkaat> Asiakkaat { get; set; }
    }

    public partial class Postitoimipaikat
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Postitoimipaikat()
        {
            this.Asiakkaat = new HashSet<Asiakkaat>();
            this.Tilaukset = new HashSet<Tilaukset>();
        }
        [DataType(DataType.PostalCode)]
        public string Postinumero { get; set; }
        public string Postitoimipaikka { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Asiakkaat> Asiakkaat { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Tilaukset> Tilaukset { get; set; }
    }

    public partial class Tilaukset
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Tilaukset()
        {
            this.Tilausrivit = new HashSet<Tilausrivit>();
        }

        public int TilausID { get; set; }
        public Nullable<int> AsiakasID { get; set; }
        public string Toimitusosoite { get; set; }
        [DataType(DataType.PostalCode)]
        public string Postinumero { get; set; }
        [Display(Name = "Tilauspäivämäärä")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [DataType(DataType.Date)]
        public Nullable<System.DateTime> Tilauspvm { get; set; }
        [Display(Name = "Toimituspäivämäärä")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]

        [DataType(DataType.Date)]
        public Nullable<System.DateTime> Toimituspvm { get; set; }

        public virtual Asiakkaat Asiakkaat { get; set; }
        public virtual Postitoimipaikat Postitoimipaikat { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Tilausrivit> Tilausrivit { get; set; }
    }

    public partial class Tilausrivit
    {
        public int TilausriviID { get; set; }
        public Nullable<int> TilausID { get; set; }
        public Nullable<int> TuoteID { get; set; }
        [Display(Name = "Määrä")]
        public Nullable<int> Maara { get; set; }
        [Display(Name = "A-Hinta")]
        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(18, 2)")]
        public Nullable<decimal> Ahinta { get; set; }

        public virtual Tilaukset Tilaukset { get; set; }
        public virtual Tuotteet Tuotteet { get; set; }
    }

    public partial class Tuotteet
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Tuotteet()
        {
            this.Tilausrivit = new HashSet<Tilausrivit>();
        }

        public int TuoteID { get; set; }
        [Display(Name = "Tuote")]
        public string Nimi { get; set; }
        [Display(Name = "A-Hinta")]
        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(18, 2)")]
        public Nullable<decimal> Ahinta { get; set; }
        public byte[] Kuva { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Tilausrivit> Tilausrivit { get; set; }
    }

}