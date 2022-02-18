using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebAppTilausDB.Models;
using WebAppTilausDB.ViewModels;

namespace WebAppTilausDB.Controllers
{
    public class VirheController : Controller
    {
        // GET: Virhe
        public ActionResult Index()
        {
            return View("Error");
        }
        
        public ActionResult Sivu404()
        {
            ViewBag.Error = ErrorMessages.HuonoHaku();
            return View("Error");
        }
    }
}