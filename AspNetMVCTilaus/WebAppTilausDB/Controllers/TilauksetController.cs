using PagedList;
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
    public class TilauksetController : Controller
    {
        private readonly TilausDBEntities db = new TilausDBEntities();

        // GET: Tilauksets
        public ActionResult Index(int? page, int? pagesize, string asiakasFilter)
        {
            if (Session["KayttajaNimi"] == null)
            {
                return RedirectToAction("Login", "Home");
            }
            ViewBag.AsiakasFilter = asiakasFilter;
            var tilaukset = db.Tilaukset.Include(t => t.Asiakkaat).Include(t => t.Postitoimipaikat);
            if (!string.IsNullOrEmpty(asiakasFilter))
            {
                tilaukset = tilaukset.Where(t => t.Asiakkaat.Nimi.Contains(asiakasFilter));
            }
            int pageNumber = page ?? 1;
            int pageSize = pagesize ?? 10;
            return View(tilaukset.OrderBy(x => x.TilausID).ToPagedList(pageNumber, pageSize)); 
        }

        // GET: Tilauksets/Details/5
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
            Tilaukset tilaukset = db.Tilaukset.Find(id);
            if (tilaukset == null)
            {
                ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
            }
            return PartialView(tilaukset); 
        }

        // GET: Tilauksets/Create
        public ActionResult _CreatePartial()
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                ViewBag.AsiakasID = new SelectList(db.Asiakkaat, "AsiakasID", "Nimi");
                List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem 
                { 
                    Value = x.Postinumero, 
                    Text = x.Postinumero + " – " + x.Postitoimipaikka 
                }).ToList();
                ViewBag.Postinumero = new SelectList(ptp, "Value", "Text");
                return PartialView(); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // POST: Tilauksets/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "TilausID,AsiakasID,Toimitusosoite,Postinumero,Tilauspvm,Toimituspvm")] Tilaukset tilaukset)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (ModelState.IsValid)
                {
                    db.Tilaukset.Add(tilaukset);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
                ViewBag.TilausVirhe = "Tilauksen luonti epäonnsitui. Yritä uudelleen.";
                return Redirect(Request.UrlReferrer.ToString());
                //ViewBag.AsiakasID = new SelectList(db.Asiakkaat, "AsiakasID", "Nimi", tilaukset.AsiakasID);
                //List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem 
                //{ 
                //    Value = x.Postinumero, 
                //    Text = x.Postinumero + " – " + x.Postitoimipaikka 
                //}).ToList();
                //ViewBag.Postinumero = new SelectList(ptp, "Value", "Text", tilaukset.Postinumero);
                //return View(tilaukset); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // GET: Tilauksets/Edit/5
        public ActionResult _EditPartial(int? id)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (id == null)
                {
                    ViewBag.Error = ErrorMessages.HuonoHaku();
                    return View("Error");
                }
                Tilaukset tilaukset = db.Tilaukset.Find(id);
                if (tilaukset == null)
                {
                    ViewBag.Error = ErrorMessages.EiLoydy();
                    return View("Error");
                }
                ViewBag.AsiakasID = new SelectList(db.Asiakkaat, "AsiakasID", "Nimi", tilaukset.AsiakasID);
                List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem 
                { 
                    Value = x.Postinumero, 
                    Text = x.Postinumero + " – " + x.Postitoimipaikka 
                }).ToList();
                ViewBag.Postinumero = new SelectList(ptp, "Value", "Text", tilaukset.Postinumero);

                return PartialView(tilaukset); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // POST: Tilauksets/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "TilausID,AsiakasID,Toimitusosoite,Postinumero,Tilauspvm,Toimituspvm")] Tilaukset tilaukset)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (ModelState.IsValid)
                {
                    db.Entry(tilaukset).State = EntityState.Modified;
                    db.SaveChanges();
                    return Redirect(Request.UrlReferrer.ToString());
                }
                ViewBag.TilausVirhe = "Tilauksen muokkaus epäonnistui. Yritä uudelleen.";
                return RedirectToAction("Index");
                //ViewBag.AsiakasID = new SelectList(db.Asiakkaat, "AsiakasID", "Nimi", tilaukset.AsiakasID);
                //List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem 
                //{ 
                //    Value = x.Postinumero, 
                //    Text = x.Postinumero + " – " + x.Postitoimipaikka 
                //}).ToList();
                //ViewBag.Postinumero = new SelectList(ptp, "Value", "Text", tilaukset.Postinumero);
                //return View(tilaukset); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // GET: Tilauksets/Delete/5
        public ActionResult _DeletePartial(int? id)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (id == null)
                {
                    ViewBag.Error = ErrorMessages.HuonoHaku();
                    return View("Error");
                }
                Tilaukset tilaukset = db.Tilaukset.Find(id);
                if (tilaukset == null)
                {
                    ViewBag.Error = ErrorMessages.EiLoydy();
                    return View("Error");
                }
                return PartialView(tilaukset); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // POST: Tilauksets/Delete/5
        [HttpPost, ActionName("_DeletePartial")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                Tilaukset tilaukset = db.Tilaukset.Find(id);
                db.Tilaukset.Remove(tilaukset);
                db.SaveChanges();
                return Redirect(Request.UrlReferrer.ToString());
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        public ActionResult _TilausRivit(int? id)
        {
            var rivit = from tr in db.Tilausrivit
                        join tu in db.Tuotteet on tr.TuoteID equals tu.TuoteID
                        where tr.TilausID == id
                        select new TilauksenRivit
                        {
                            TilausriviID = tr.TilausriviID,
                            TilausID = (int)tr.TilausID,
                            Tuote = tu.Nimi,
                            Ahinta = (decimal)tr.Ahinta,
                            Maara = (int)tr.Maara,
                        };
            ViewBag.TilausID = id;
            return PartialView(rivit);
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
