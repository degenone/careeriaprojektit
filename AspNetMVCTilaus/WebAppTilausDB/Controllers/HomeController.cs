using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebAppTilausDB.Models;
using WebAppTilausDB.ViewModels;

namespace WebAppTilausDB.Controllers
{
    public class HomeController : Controller
    {
        private readonly TilausDBEntities db = new TilausDBEntities();

        public ActionResult Index()
        {
            ViewBag.Uri = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3943.006924350755!2d25.653579!3d60.387361999999996!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4691f5d5182ac701%3A0x4d708dd7d7d60249!2sHevosenkeng%C3%A4nkatu%202%2C%2006100%20Porvoo!5e0!3m2!1sfi!2sfi!4v1576767064645!5m2!1sfi!2sfi";
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Authorize(Kayttajat kayttaja)
        {
            var kirjautunut = db.Kayttajat.SingleOrDefault(x => x.KayttajaNimi == kayttaja.KayttajaNimi && x.PassWord == kayttaja.PassWord);
            if (kirjautunut != null)
            {
                Session["KayttajaNimi"] = kirjautunut.KayttajaNimi;
                Session["Oikeudet"] = kirjautunut.Roolit != null ? kirjautunut.Roolit.Rooli : "Näytä";
                return RedirectToAction("Index");
            }
            kayttaja.KirjautumisVirheViesti = "Tuntemation käyttäjänimi tai salasana.";
            return View("Login", kayttaja);
        }

        public ActionResult Signup()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Signup([Bind(Include = "KayttajaNimi,Salasana,VarmistaSalasana")] KirjautumisModel kayttaja)
        {
            if (ModelState.IsValid)
            {
                var user = db.Kayttajat.SingleOrDefault(x => x.KayttajaNimi == kayttaja.KayttajaNimi);
                if (user != null)
                {
                    kayttaja.KirjautumisVirheViesti = "Käyttäjänimi on jo käytössä.";
                    return View(kayttaja);
                }
                if (!(kayttaja.Salasana.Equals(kayttaja.VarmistaSalasana)))
                {
                    kayttaja.KirjautumisVirheViesti = "Salasanojen on täsmättävä.";
                    return View(kayttaja);
                }
                var uusiskayttaja = db.Kayttajat.Add(new Kayttajat() 
                { 
                    KayttajaNimi = kayttaja.KayttajaNimi,
                    PassWord = kayttaja.Salasana,
                });
                db.SaveChanges();
                return Authorize(uusiskayttaja);
            }
            return View(kayttaja);
        }


        public ActionResult Logout()
        {
            Session.Abandon();
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