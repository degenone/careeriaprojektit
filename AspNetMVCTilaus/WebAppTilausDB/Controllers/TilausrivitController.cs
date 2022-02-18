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
    public class TilausrivitController : Controller
    {
        private readonly TilausDBEntities db = new TilausDBEntities();
        #region VanhaaKontrolleria
        // GET: Tilausrivit
        //public ActionResult Index()
        //{
        //    if (Session["KayttajaNimi"] == null)
        //    {
        //        return RedirectToAction("Login", "Home");
        //    }
        //    var tilausrivit = db.Tilausrivit.Include(t => t.Tilaukset).Include(t => t.Tuotteet);
        //    return View(tilausrivit.ToList());
        //}

        // GET: Tilausrivit/Details/5
        //public ActionResult _DetailsPartial(int? id)
        //{
        //    if (Session["KayttajaNimi"] == null)
        //    {
        //        return RedirectToAction("Login", "Home");
        //    }
        //    if (id == null)
        //    {
        //        ViewBag.Error = ErrorMessages.HuonoHaku();
        //        return View("Error");
        //    }
        //    Tilausrivit tilausrivit = db.Tilausrivit.Find(id);
        //    if (tilausrivit == null)
        //    {
        //        ViewBag.Error = ErrorMessages.EiLoydy();
        //        return View("Error");
        //    }
        //    return PartialView(tilausrivit);
        //}
        #endregion        
        // GET: Tilausrivit/Create
        public ActionResult _CreatePartial(int tilausId)
        {
            if (Session["KayttajaNimi"] == null || Session["Oikeudet"].Equals("Näytä"))
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            ViewBag.TilausID = new SelectList(db.Tilaukset, "TilausID", "Toimitusosoite", new Tilausrivit { TilausID = tilausId });
            List<SelectListItem> tuotteetHinnat = db.Tuotteet.AsEnumerable().Select(x => new SelectListItem
            {
                Value = x.TuoteID.ToString(),
                Text = String.Format("{0:C2} – {1}",  x.Ahinta, x.Nimi) 
            }).ToList();
            ViewBag.TuoteID = new SelectList(tuotteetHinnat, "Value", "Text");
            ViewBag.TilausID = tilausId;
            return PartialView();
        }

        // POST: Tilausrivit/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "TilausriviID,TilausID,TuoteID,Maara")] Tilausrivit tilausrivit)
        {
            if (Session["KayttajaNimi"] == null || Session["Oikeudet"].Equals("Näytä"))
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            if (ModelState.IsValid)
            {
                decimal? ahinta = (from a in db.Tuotteet
                                   where a.TuoteID == tilausrivit.TuoteID
                                   select a.Ahinta).FirstOrDefault();
                tilausrivit.Ahinta = ahinta;
                db.Tilausrivit.Add(tilausrivit);
                db.SaveChanges();
                return Redirect(Request.UrlReferrer.ToString());
            }
            ViewBag.TilausriviVirhe = "Tilausrivin luonti epäonnistui. Yritä uudelleen";
            return RedirectToAction("Index", "Tilaukset");
            //ViewBag.TilausID = new SelectList(db.Tilaukset, "TilausID", "Toimitusosoite", tilausrivit.TilausID);
            //List<SelectListItem> tuotteetHinnat = db.Tuotteet.AsEnumerable().Select(x => new SelectListItem
            //{
            //    Value = x.TuoteID.ToString(),
            //    Text = String.Format("{0:C2} – {1}", x.Ahinta, x.Nimi)
            //}).ToList();
            //ViewBag.TuoteID = new SelectList(tuotteetHinnat, "Value", "Text", tilausrivit.TuoteID);
            //return View(tilausrivit);
        }

        // GET: Tilausrivit/Edit/5
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
            Tilausrivit tilausrivit = db.Tilausrivit.Find(id);
            if (tilausrivit == null)
            {
                ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
            }
            ViewBag.TilausID = new SelectList(db.Tilaukset, "TilausID", "Toimitusosoite", tilausrivit.TilausID);
            List<SelectListItem> tuotteetHinnat = db.Tuotteet.AsEnumerable().Select(x => new SelectListItem
            {
                Value = x.TuoteID.ToString(),
                Text = String.Format("{0:C2} – {1}", x.Ahinta, x.Nimi)
            }).ToList();
            ViewBag.TuoteID = new SelectList(tuotteetHinnat, "Value", "Text", tilausrivit.TuoteID);
            return PartialView(tilausrivit);
        }

        // POST: Tilausrivit/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "TilausriviID,TilausID,TuoteID,Maara")] Tilausrivit tilausrivit)
        {
            if (Session["KayttajaNimi"] == null || Session["Oikeudet"].Equals("Näytä"))
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            if (ModelState.IsValid)
            {
                decimal? ahinta = (from a in db.Tuotteet
                                   where a.TuoteID == tilausrivit.TuoteID
                                   select a.Ahinta).FirstOrDefault();
                tilausrivit.Ahinta = ahinta;
                db.Entry(tilausrivit).State = EntityState.Modified;
                db.SaveChanges();
                return Redirect(Request.UrlReferrer.ToString());
            }
            ViewBag.TilausriviVirhe = "Tilausrivin muokkaus epäonnistui. Yritä uudelleen.";
            return RedirectToAction("Index", "Tuotteet");
            //ViewBag.TilausID = new SelectList(db.Tilaukset, "TilausID", "Toimitusosoite", tilausrivit.TilausID);
            //List<SelectListItem> tuotteetHinnat = db.Tuotteet.AsEnumerable().Select(x => new SelectListItem
            //{
            //    Value = x.TuoteID.ToString(),
            //    Text = String.Format("{0:C2} – {1}", x.Ahinta, x.Nimi)
            //}).ToList();
            //ViewBag.TuoteID = new SelectList(tuotteetHinnat, "Value", "Text", tilausrivit.TuoteID);
            //return View(tilausrivit);
        }

        // GET: Tilausrivit/Delete/5
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
            Tilausrivit tilausrivit = db.Tilausrivit.Find(id);
            if (tilausrivit == null)
            {
                ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
            }
            return PartialView(tilausrivit);
        }

        // POST: Tilausrivit/Delete/5
        [HttpPost, ActionName("_DeletePartial")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            if (Session["KayttajaNimi"] == null || Session["Oikeudet"].Equals("Näytä"))
            {
                ViewBag.Error = ErrorMessages.Lupa();
                return View("Error");
            }
            Tilausrivit tilausrivit = db.Tilausrivit.Find(id);
            db.Tilausrivit.Remove(tilausrivit);
            db.SaveChanges();
            return Redirect(Request.UrlReferrer.ToString());
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
