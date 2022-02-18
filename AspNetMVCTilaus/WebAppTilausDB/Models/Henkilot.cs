//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebAppTilausDB.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

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
        [Display(Name = "S�hk�posti")]
        public string Sahkoposti { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Asiakkaat> Asiakkaat { get; set; }
    }
}