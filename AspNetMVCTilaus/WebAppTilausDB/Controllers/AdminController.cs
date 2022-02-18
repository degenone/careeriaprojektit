using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebAppTilausDB.Models;
using WebAppTilausDB.ViewModels;

namespace WebAppTilausDB.Controllers
{
    public class AdminController : Controller
    {
        private readonly TilausDBEntities db = new TilausDBEntities();

        // GET: Kayttajat
        public ActionResult Index()
        {
            if (Session["KayttajaNimi"] != null && Session["Oikeudet"].Equals("Admin"))
            {
                var kayttajat = db.Kayttajat.Include(k => k.Roolit);
                return View(kayttajat.ToList()); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // GET: Kayttajat/Edit/5
        public ActionResult Edit(int? id)
        {
            if (Session["KayttajaNimi"] == null || !Session["Oikeudet"].Equals("Admin") || id == 1000)
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            if (id == null)
            {
                ViewBag.Error = ErrorMessages.HuonoHaku();
                return View("Error");
            }
            Kayttajat kayttajat = db.Kayttajat.Find(id);
            if (kayttajat == null)
            {
                ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
            }
            ViewBag.Rooli = new SelectList(db.Roolit, "RooliId", "Rooli", kayttajat.Rooli);
            return View(kayttajat);
        }

        // POST: Kayttajat/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "KayttajaId,KayttajaNimi,PassWord,Rooli")] Kayttajat kayttaja)
        {
            if (Session["KayttajaNimi"] == null || !Session["Oikeudet"].Equals("Admin") || kayttaja.KayttajaId.Equals(1000))
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            if (ModelState.IsValid)
            {
                db.Entry(kayttaja).State = EntityState.Modified;
                db.Entry(kayttaja).Property(x => x.KayttajaNimi).IsModified = false;
                db.Entry(kayttaja).Property(x => x.PassWord).IsModified = false;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.Rooli = new SelectList(db.Roolit, "RooliId", "Rooli", kayttaja.Rooli);
            return View(kayttaja);
        }

        // GET: Kayttajat/Delete/5
        public ActionResult Delete(int? id)
        {
            if (Session["KayttajaNimi"] == null || !Session["Oikeudet"].Equals("Admin") || id == 1000)
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            if (id == null)
            {
                ViewBag.Error = ErrorMessages.HuonoHaku();
                return View("Error");
            }
            Kayttajat kayttajat = db.Kayttajat.Find(id);
            if (kayttajat == null)
            {
                ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
            }
            return View(kayttajat);
        }

        // POST: Kayttajat/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            if (Session["KayttajaNimi"] == null || !Session["Oikeudet"].Equals("Admin") || id == 1000)
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            Kayttajat kayttajat = db.Kayttajat.Find(id);
            db.Kayttajat.Remove(kayttajat);
            db.SaveChanges();
            return RedirectToAction("Index");
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
