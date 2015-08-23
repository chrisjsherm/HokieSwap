using System.Web;
using System.Web.Mvc;

namespace MvcWebRole
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            // Validate request against model attributes by default.
            filters.Add(new HandleErrorAttribute());

            // Force requests to use Https.
            if (!HttpContext.Current.IsDebuggingEnabled)
            {
                filters.Add(new RequireHttpsAttribute());
            }

            // Force requests into role authorization pipeline.
            if (!HttpContext.Current.IsDebuggingEnabled)
            {
                filters.Add(new AuthorizeAttribute() { Roles = "VT-EMPLOYEE, VT-STUDENT-WAGE" });
            }
        }
    }
}