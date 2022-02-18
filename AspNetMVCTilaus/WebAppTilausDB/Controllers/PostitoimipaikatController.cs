using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebAppTilausDB.Models;
using WebAppTilausDB.ViewModels;

namespace WebAppTilausDB.Controllers
{
    public class PostitoimipaikatController : Controller
    {
        private readonly TilausDBEntities db = new TilausDBEntities();
        private readonly int numOfRows = 4 * 15;

        // GET: Postitoimipaikat
        public ActionResult Index()
        {
            if (Session["KayttajaNimi"] == null)
            {
                return RedirectToAction("Login", "Home");
            }
            return View(StoredProsedures.GetPostitoimipaikat(db, 1, numOfRows));
        }

        // GET: Postitoimipaikat/Create
        public ActionResult _CreatePartial()
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                return PartialView(); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // POST: Postitoimipaikat/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Postinumero,Postitoimipaikka")] Postitoimipaikat postitoimipaikat)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (ModelState.IsValid)
                {
                    db.Postitoimipaikat.Add(postitoimipaikat);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
                ViewBag.PtpVirhe = "Postitoimipaikan luonti epäonnistui. Yritä uudelleen.";
                return RedirectToAction("Index");
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // GET: Postitoimipaikat/Edit/5
        public ActionResult _EditOrDelete(string id)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (id == null)
                {
                    ViewBag.Error = ErrorMessages.HuonoHaku();
                    return View("Error");
                }
                Postitoimipaikat postitoimipaikat = db.Postitoimipaikat.Find(id);
                if (postitoimipaikat == null)
                {
                    ViewBag.Error = ErrorMessages.EiLoydy();
                    return View("Error");
                }
                return PartialView(postitoimipaikat); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // POST: Postitoimipaikat/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Postinumero,Postitoimipaikka")] Postitoimipaikat postitoimipaikat)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (ModelState.IsValid)
                {
                    db.Entry(postitoimipaikat).State = EntityState.Modified;
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
                ViewBag.PtpVirhe = "Postitoimipaikan muokkaaminen epäonnistui. Yritä uudelleen.";
                return RedirectToAction("Index"); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // GET: Postitoimipaikat/Delete/5
        //public ActionResult Delete(string id)
        //{
        //    if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
        //    {
        //        if (id == null)
        //        {
        //            ViewBag.Error = ErrorMessages.HuonoHaku();
        //            return View("Error");
        //        }
        //        Postitoimipaikat postitoimipaikat = db.Postitoimipaikat.Find(id);
        //        if (postitoimipaikat == null)
        //        {
        //            ViewBag.Error = ErrorMessages.EiLoydy();
        //            return View("Error");
        //        }
        //        return View(postitoimipaikat); 
        //    }
        //    ViewBag.Error = ErrorMessages.Lupa();
        //    return View("Error");
        //}

        // POST: Postitoimipaikat/Delete/5
        [HttpPost, ActionName("_EditOrDelete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                try
                {
                    Postitoimipaikat postitoimipaikat = db.Postitoimipaikat.Find(id);
                    db.Postitoimipaikat.Remove(postitoimipaikat);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
                catch (DbUpdateConcurrencyException)
                {
                    ViewBag.Error = "Postitoimipaikka ja -numero ovat käytössä, eikä niitä voida tästä syystä poistaa.";
                    return View("Error");
                }
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        public ActionResult _PostitoimipaikatPartial(List<Postitoimipaikat> ptp) => PartialView(ptp);

        [HttpPost]
        public ActionResult InfinateScroll(int page)
        {
            var ptp = StoredProsedures.GetPostitoimipaikat(db, page, numOfRows);
            JsonModel jsonModel = new JsonModel
            {
                HTMLString = RazorViewToString.RenderViewToString(this, "_PostitoimipaikatPartial", ptp),
                NoMoreData = ptp.Count < numOfRows
            };
            return Json(jsonModel);
        }

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
