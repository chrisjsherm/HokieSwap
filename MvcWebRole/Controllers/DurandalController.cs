using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcWebRole.Controllers
{
    public class DurandalController : Controller
    {
        //
        // GET: /Durandal/
        public ActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult NotAuthorized()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult CookiesRequired()
        {
            return View();
        }
    }
}
