using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebAppTilausDB.Models;
using WebAppTilausDB.ViewModels;

namespace WebAppTilausDB.Controllers
{
    public class TuotteetController : Controller
    {
        private readonly TilausDBEntities db = new TilausDBEntities();
        private readonly int numOfRows = 3 * 3; 
        // GET: Tuotteet
        public ActionResult Index(string tuoteFilter)
        {
            if (Session["KayttajaNimi"] == null)
            {
                return RedirectToAction("Login", "Home");
            }
            ViewBag.TuoteFilter = tuoteFilter;
            return View(StoredProsedures.GetTuotteet(db, 1, numOfRows, tuoteFilter));
        }

        // GET: Tuotteet/Details/5
        public ActionResult _DetailsPartial(int? id)
        {
            if (Session["KayttajaNimi"] == null)
            {
                return RedirectToAction("Login", "Home");
            }
            if (id == null)
            {
                ViewBag.Error = ErrorMessages.HuonoHaku();
                return View("Error");
            }
            Tuotteet tuotteet = db.Tuotteet.Find(id);
            if (tuotteet == null)
            {
                ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
            }
            return PartialView(tuotteet);
        }

        // GET: Tuotteet/Create
        public ActionResult _CreatePartial()
        {
            if (Session["KayttajaNimi"] == null || Session["Oikeudet"].Equals("Näytä"))
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            return PartialView();
        }

        // POST: Tuotteet/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "TuoteTieto,KuvaTiedosto")] TuoteModel tuote)
        {
            if (Session["KayttajaNimi"] == null || Session["Oikeudet"].Equals("Näytä"))
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            if (ModelState.IsValid)
            {
                if (tuote.KuvaTiedosto != null && tuote.KuvaTiedosto.ContentLength > 0)
                {
                    KuvanMuokkausModel kmm = new KuvanMuokkausModel();
                    db.Tuotteet.Add(new Tuotteet()
                    {
                        Nimi = tuote.TuoteTieto.Nimi,
                        Ahinta = tuote.TuoteTieto.Ahinta,
                        Kuva = kmm.KuvaBiteiksi(tuote.KuvaTiedosto)
                    });
                }
                else
                {
                    db.Tuotteet.Add(new Tuotteet()
                    {
                        Nimi = tuote.TuoteTieto.Nimi,
                        Ahinta = tuote.TuoteTieto.Ahinta,
                    }); 
                }
                db.SaveChanges();
                return Redirect(Request.UrlReferrer.ToString());
            }
            ViewBag.TuoteVirhe = "Tuotteen luonti epäonnistui. Yritä uudelleen.";
            return RedirectToAction("Index");
        }

        // GET: Tuotteet/Edit/5
        public ActionResult _EditPartial(int? id)
        {
            if (Session["KayttajaNimi"] == null || Session["Oikeudet"].Equals("Näytä"))
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            if (id == null)
            {
                ViewBag.Error = ErrorMessages.HuonoHaku();
                return View("Error");
            }
            Tuotteet tuotteet = db.Tuotteet.Find(id);
            if (tuotteet == null)
            {
                ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
            }
            TuoteModel tuote = new TuoteModel() { TuoteTieto = tuotteet };
            return PartialView(tuote);
        }

        // POST: Tuotteet/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "TuoteTieto,KuvaTiedosto")] TuoteModel tuote)
        {
            if (Session["KayttajaNimi"] == null || Session["Oikeudet"].Equals("Näytä"))
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            if (ModelState.IsValid)
            {
                if (tuote.KuvaTiedosto != null && tuote.KuvaTiedosto.ContentLength > 0)
                {
                    KuvanMuokkausModel kmm = new KuvanMuokkausModel();
                    tuote.TuoteTieto.Kuva = kmm.KuvaBiteiksi(tuote.KuvaTiedosto);
                    db.Entry(tuote.TuoteTieto).State = EntityState.Modified;
                }
                else
                {
                    db.Entry(tuote.TuoteTieto).State = EntityState.Modified;
                    db.Entry(tuote.TuoteTieto).Property(x => x.Kuva).IsModified = false; 
                }
                db.SaveChanges();
                return Redirect(Request.UrlReferrer.ToString());
            }
            ViewBag.TuoteVirhe = "Tuotteen muokkaus epäonnistui. Yritä uudelleen.";
            return RedirectToAction("Index");
        }

        // GET: Tuotteet/Delete/5
        public ActionResult _DeletePartial(int? id)
        {
            if (Session["KayttajaNimi"] == null || Session["Oikeudet"].Equals("Näytä"))
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            if (id == null)
            {
                ViewBag.Error = ErrorMessages.HuonoHaku();
                return View("Error");
            }
            Tuotteet tuotteet = db.Tuotteet.Find(id);
            if (tuotteet == null)
            {
                ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
            }
            return PartialView(tuotteet);
        }

        // POST: Tuotteet/Delete/5
        [HttpPost, ActionName("_DeletePartial")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            if (Session["KayttajaNimi"] == null || Session["Oikeudet"].Equals("Näytä"))
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            Tuotteet tuotteet = db.Tuotteet.Find(id);
            db.Tuotteet.Remove(tuotteet);
            db.SaveChanges();
            return Redirect(Request.UrlReferrer.ToString());
        }

        public ActionResult _TuotteetPartial(List<Tuotteet> tuotteet) => PartialView(tuotteet);

        [HttpPost]
        public ActionResult InfinateScroll(int page, string tuoteFilter)
        {
            var ptp = StoredProsedures.GetTuotteet(db, page, numOfRows, tuoteFilter);
            JsonModel jsonModel = new JsonModel
            {
                HTMLString = RazorViewToString.RenderViewToString(this, "_TuotteetPartial", ptp),
                NoMoreData = ptp.Count < numOfRows
            };
            return Json(jsonModel);
        }

        public ActionResult _JsonViikkoMyynti(int id)
        {
            decimal[] myynti = { 0, 0, 0, 0, 0, 0, 0 };
            foreach (var tvm in StoredProsedures.GetViikkoMyynti(db, id))
            {
                if (tvm.PvNumero < 1)
                {
                    break;
                }
                myynti[tvm.PvNumero - 1] = tvm.Myynti;
            }
            return Json(myynti, JsonRequestBehavior.AllowGet);
        }

        public ActionResult _JsonMyydymmatTuotteet() 
            => Json(db.Database.SqlQuery<MyydyimmatTuotteetModel>("dbo.usp_MyydyimmatTuotteet").ToList(), JsonRequestBehavior.AllowGet);

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
