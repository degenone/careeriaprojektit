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
    public class HenkilotController : Controller
    {
        private readonly TilausDBEntities db = new TilausDBEntities();

        // GET: Henkilot
        public ActionResult Index(int? page,
                                  int? pagesize,
                                  string osoiteFilter,
                                  string esimiesID)
        {
            if (Session["KayttajaNimi"] == null)
            {
                return RedirectToAction("Login", "Home");
            }
            var esimies = db.Henkilot.Select(x => x.Esimies).Distinct().ToList();
            esimies.Insert(0, null);
            ViewBag.EsimiesIDt = new SelectList(esimies, int.TryParse(esimiesID, out int eId) ? eId : 0);
            ViewBag.EsimiesID = esimiesID;
            ViewBag.OsoiteFilter = osoiteFilter;
            var henkilot = from h in db.Henkilot
                           select h;
            if (!string.IsNullOrEmpty(esimiesID) && esimiesID != " ")
            {
                int id = int.Parse(esimiesID);
                henkilot = henkilot.Where(h => h.Esimies == id);
            }
            if (!string.IsNullOrEmpty(osoiteFilter))
            {
                henkilot = henkilot.Where(h => h.Osoite.Contains(osoiteFilter));
            }
            int pageNumber = page ?? 1;
            int pageSize = pagesize ?? 15;
            return View(henkilot.OrderBy(x => x.Henkilo_id).ToPagedList(pageNumber, pageSize));
        }

        // GET: Henkilot/Details/5
        public ActionResult _DetailsPartial(int? id)
        {
            if (Session["KayttajaNimi"] == null)
            {
                return RedirectToAction("Login", "Home");
            }
            else
            if (id == null)
            {
                ViewBag.Error = ErrorMessages.HuonoHaku();
                return View("Error");
            }
            Henkilot henkilo = db.Henkilot.Find(id);
            if (henkilo == null)
            {
                ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
            }
            return PartialView(henkilo); 
        }

        // GET: Henkilot/Create
        public ActionResult _CreatePartial()
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem
                {
                    Value = x.Postinumero,
                    Text = x.Postinumero + " " + x.Postitoimipaikka
                }).ToList();
                ViewBag.Postinumero = new SelectList(ptp, "Value", "Text");
                return PartialView(); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // POST: Henkilot/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Henkilo_id,Etunimi,Sukunimi,Osoite,Esimies,Postinumero,Sahkoposti")] Henkilot henkilot)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (ModelState.IsValid)
                {
                    db.Henkilot.Add(henkilot);
                    db.SaveChanges();
                    return Redirect(Request.UrlReferrer.ToString());
                }
                ViewBag.HeniloVirhe = "Henkilön luonti epäonnistui. Yritä uudelleen.";
                return RedirectToAction("Index");
                //List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem
                //{
                //    Value = x.Postinumero,
                //    Text = x.Postinumero + " " + x.Postitoimipaikka
                //}).ToList();
                //ViewBag.Postinumero = new SelectList(ptp, "Value", "Text", henkilot.Postinumero);
                //return View(henkilot); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // GET: Henkilot/Edit/5
        public ActionResult _EditPartial(int? id)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (id == null)
                {
                    ViewBag.Error = ErrorMessages.HuonoHaku();
                return View("Error");
                }
                Henkilot henkilot = db.Henkilot.Find(id);
                if (henkilot == null)
                {
                    ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
                }
                List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem
                {
                    Value = x.Postinumero,
                    Text = x.Postinumero + " " + x.Postitoimipaikka
                }).ToList();
                ViewBag.Postinumero = new SelectList(ptp, "Value", "Text", henkilot.Postinumero);
                return PartialView(henkilot); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // POST: Henkilot/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Henkilo_id,Etunimi,Sukunimi,Osoite,Esimies,Postinumero,Sahkoposti")] Henkilot henkilot)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (ModelState.IsValid)
                {
                    db.Entry(henkilot).State = EntityState.Modified;
                    db.SaveChanges();
                    return Redirect(Request.UrlReferrer.ToString());
                }
                ViewBag.HeniloVirhe = "Henkilön muokkaus epäonnistui. Yritä uudelleen.";
                return RedirectToAction("Index");
                //List<SelectListItem> ptp = db.Postitoimipaikat.Select(x => new SelectListItem
                //{
                //    Value = x.Postinumero,
                //    Text = x.Postinumero + " " + x.Postitoimipaikka
                //}).ToList();
                //ViewBag.Postinumero = new SelectList(ptp, "Value", "Text", henkilot.Postinumero);
                //return View(henkilot); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // GET: Henkilot/Delete/5
        public ActionResult _DeletePartial(int? id)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                if (id == null)
                {
                    ViewBag.Error = ErrorMessages.HuonoHaku();
                return View("Error");
                }
                Henkilot henkilot = db.Henkilot.Find(id);
                if (henkilot == null)
                {
                    ViewBag.Error = ErrorMessages.EiLoydy();
                return View("Error");
                }
                return PartialView(henkilot); 
            }
            ViewBag.Error = ErrorMessages.Lupa();
            return View("Error");
        }

        // POST: Henkilot/Delete/5
        [HttpPost, ActionName("_DeletePartial")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            if (Session["KayttajaNimi"] != null && (Session["Oikeudet"].Equals("Muokkaa") || Session["Oikeudet"].Equals("Admin")))
            {
                Henkilot henkilot = db.Henkilot.Find(id);
                db.Henkilot.Remove(henkilot);
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
