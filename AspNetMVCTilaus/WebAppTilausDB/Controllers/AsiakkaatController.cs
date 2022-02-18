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
    public class AsiakkaatController : Controller
    {
        private readonly TilausDBEntities db = new TilausDBEntities();

        // GET: Asiakkaat
        public ActionResult Index(int? page,
                                  int? pagesize,
                                  string asiakasNimiFilter,
                                  string sortDirection)
        {
            if (Session["KayttajaNimi"] == null)
            {
                return RedirectToAction("Login", "Home");
            }
            ViewBag.CurrentSort = sortDirection;
            ViewBag.SortDirection = sortDirection == "asc" ? "desc" : "asc";
            ViewBag.AsiakasNimiFilter = asiakasNimiFilter;
            var asiakkaat = db.Asiakkaat.Include(a => a.Henkilot).Include(a => a.Postitoimipaikat);
            if (!string.IsNullOrEmpty(asiakasNimiFilter))
            {
                asiakkaat = asiakkaat.Where(a => a.Nimi.Contains(asiakasNimiFilter));
            }
            switch (sortDirection)
            {
                case "desc":
                    asiakkaat = asiakkaat.OrderByDescending(a => a.Luottoraja);
                    break;
                case "asc":
                    asiakkaat = asiakkaat.OrderBy(a => a.Luottoraja);
                    break;
                default:
                asiakkaat = asiakkaat.OrderBy(a => a.AsiakasID);
                    break;
            }
            int pageNumber = page ?? 1;
            int pageSize = pagesize ?? 15;
            return View(asiakkaat.ToPagedList(pageNumber, pageSize));
        }

        // GET: Asiakkaat/Details/5
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
            Asiakkaat asiakas = db.Asiakkaat.Find(id);
            if (asiakas == null)
            {
                ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
            }
            ViewBag.Vastuu = $"{asiakas.Henkilot.Etunimi} {asiakas.Henkilot.Sukunimi}";
            return PartialView(asiakas); 
        }

        // GET: Asiakkaat/Create
        public ActionResult _CreatePartial()
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem
                {
                    Value = x.Postinumero,
                    Text = x.Postinumero + " " + x.Postitoimipaikka
                }).ToList();
                List<SelectListItem> vastuu = db.Henkilot.Select(x => new SelectListItem
                {
                    Value = x.Henkilo_id.ToString(),
                    Text = x.Etunimi + " " + x.Sukunimi
                }).ToList();
                ViewBag.Vastuumyyja = new SelectList(vastuu, "Value", "Text");
                ViewBag.Postinumero = new SelectList(ptp, "Value", "Text");
                return PartialView();
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // POST: Asiakkaat/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "AsiakasID,Nimi,Osoite,Postinumero,Vastuumyyja,Luottoraja,www_sivut")] Asiakkaat asiakkaat)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (ModelState.IsValid)
                {
                    db.Asiakkaat.Add(asiakkaat);
                    db.SaveChanges();
                    return Redirect(Request.UrlReferrer.ToString());
                }
                ViewBag.AsiakasVirhe = "Asiakkaan luonti epäonnistui. Yritä uudellee.";
                return RedirectToAction("Index");
                //List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem
                //{
                //    Value = x.Postinumero,
                //    Text = x.Postinumero + " " + x.Postitoimipaikka
                //}).ToList();
                //List<SelectListItem> vastuu = db.Henkilot.Select(x => new SelectListItem
                //{
                //    Value = x.Henkilo_id.ToString(),
                //    Text = x.Etunimi + " " + x.Sukunimi
                //}).ToList();
                //ViewBag.Vastuumyyja = new SelectList(vastuu, "Value", "Text", asiakkaat.Vastuumyyja);
                //ViewBag.Postinumero = new SelectList(ptp, "Value", "Text", asiakkaat.Postinumero);
                //return View(asiakkaat);
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // GET: Asiakkaat/Edit/5
        public ActionResult _EditPartial(int? id)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (id == null)
                {
                    ViewBag.Error = ErrorMessages.HuonoHaku();
                    return View("Error");
                }
                Asiakkaat asiakkaat = db.Asiakkaat.Find(id);
                if (asiakkaat == null)
                {
                    ViewBag.Error = ErrorMessages.EiLoydy();
                    return View("Error");
                }

                List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem
                {
                    Value = x.Postinumero,
                    Text = x.Postinumero + " " + x.Postitoimipaikka
                }).ToList();
                List<SelectListItem> vastuu = db.Henkilot.Select(x => new SelectListItem
                {
                    Value = x.Henkilo_id.ToString(),
                    Text = x.Etunimi + " " + x.Sukunimi
                }).ToList();
                ViewBag.Vastuumyyja = new SelectList(vastuu, "Value", "Text", asiakkaat.Vastuumyyja);
                ViewBag.Postinumero = new SelectList(ptp, "Value", "Text", asiakkaat.Postinumero);
                return PartialView(asiakkaat); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // POST: Asiakkaat/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "AsiakasID,Nimi,Osoite,Postinumero,Vastuumyyja,Luottoraja,www_sivut")] Asiakkaat asiakkaat)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (ModelState.IsValid)
                {
                    db.Entry(asiakkaat).State = EntityState.Modified;
                    db.SaveChanges();
                    return Redirect(Request.UrlReferrer.ToString());
                }
                ViewBag.AsiakasVirhe = "Asiakkaan muokkaaminen epäonnistui. Yritä uudelleen.";
                return RedirectToAction("Index");
                //List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem
                //{
                //    Value = x.Postinumero,
                //    Text = x.Postinumero + " " + x.Postitoimipaikka
                //}).ToList();
                //List<SelectListItem> vastuu = db.Henkilot.Select(x => new SelectListItem
                //{
                //    Value = x.Henkilo_id.ToString(),
                //    Text = x.Etunimi + " " + x.Sukunimi
                //}).ToList();
                //ViewBag.Vastuumyyja = new SelectList(vastuu, "Value", "Text", asiakkaat.Vastuumyyja);
                //ViewBag.Postinumero = new SelectList(ptp, "Value", "Text", asiakkaat.Postinumero);
                //return View(asiakkaat); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // GET: Asiakkaat/Delete/5
        public ActionResult _DeletePartial(int? id)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (id == null)
                {
                    ViewBag.Error = ErrorMessages.HuonoHaku();
                    return View("Error");
                }
                Asiakkaat asiakkaat = db.Asiakkaat.Find(id);
                if (asiakkaat == null)
                {
                    ViewBag.Error = ErrorMessages.EiLoydy();
                    return View("Error");
                }
                return PartialView(asiakkaat); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // POST: Asiakkaat/Delete/5
        [HttpPost, ActionName("_DeletePartial")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                Asiakkaat asiakkaat = db.Asiakkaat.Find(id);
                db.Asiakkaat.Remove(asiakkaat);
                db.SaveChanges();
                return RedirectToAction("Index"); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
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
