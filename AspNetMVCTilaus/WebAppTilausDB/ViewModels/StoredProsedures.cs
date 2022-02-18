using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using WebAppTilausDB.Models;

namespace WebAppTilausDB.ViewModels
{
    public static class StoredProsedures
    {
        public static List<Postitoimipaikat> GetPostitoimipaikat(TilausDBEntities db, int page, int numOfRows)
        {
            var idx = new SqlParameter("@PageIndex", page);
            var size = new SqlParameter("@PageSize", numOfRows);
            return db.Database.SqlQuery<Postitoimipaikat>("dbo.usp_PostitoimipaikatLaiskaLataus @PageIndex, @PageSize", idx, size).ToList();
        }

        public static List<Tuotteet> GetTuotteet(TilausDBEntities db, int page, int numOfRows, string productFilter)
        {
            var idx = new SqlParameter("@PageIndex", page);
            var size = new SqlParameter("@PageSize", numOfRows);
            if (string.IsNullOrEmpty(productFilter))
            {
                return db.Database.SqlQuery<Tuotteet>("dbo.usp_TuotteetLaiskaLataus @PageIndex, @PageSize", idx, size).ToList();
            }
            var filter = new SqlParameter("@Filter", productFilter);
            return db.Database.SqlQuery<Tuotteet>("dbo.usp_TuotteetLaiskaLataus @PageIndex, @PageSize, @Filter", idx, size, filter).ToList();
        }

        public static List<TuoteenViikkoMyynti> GetViikkoMyynti(TilausDBEntities db, int tuoteID)
        {
            var id = new SqlParameter("@TuoteID", tuoteID);
            return db.Database.SqlQuery<TuoteenViikkoMyynti>("dbo.usp_TuoteViikkoMyynti @TuoteID", id).ToList();
        }
    }
}