using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Diagnostics;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.Diagnostics;

namespace MvcWebRole
{ 
    public class WebRole : RoleEntryPoint
    {
        public override bool OnStart()
        {
            return base.OnStart();
        }

        public override void OnStop()
        {
            Trace.TraceInformation("OnStop called from WebRole");
            var rcCounter = new PerformanceCounter("ASP.NET", "Requests Current", "");
            while (rcCounter.NextValue() > 0)
            {
                Trace.TraceInformation("ASP.NET Requests Current = " +
                    rcCounter.NextValue().ToString());
                System.Threading.Thread.Sleep(1000);
            }
        }
    }
}
