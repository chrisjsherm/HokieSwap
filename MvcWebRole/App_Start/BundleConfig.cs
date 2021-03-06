﻿using System;
using System.Web;
using System.Web.Optimization;

namespace MvcWebRole
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);

            bundles.Add(
              new StyleBundle("~/Content/css").Include(
                "~/Content/durandal.css",
                "~/Content/toastr.css",
                "~/Content/Site.css")
              );

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/Scripts/modernizr").Include(
                    "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/Scripts/main-built").Include(
                    "~/App/main-built.js"));

            bundles.Add(
                  new ScriptBundle("~/Scripts/vendor").Include(
                      "~/Scripts/app/javascript.custom.functions.js",
                      "~/Scripts/app/google.fastbutton.js",
                      "~/Scripts/jquery-{version}.js",
                      "~/Scripts/knockout-{version}.js",
                      "~/Scripts/app/knockout.custom.bindings.js",
                      "~/Scripts/sammy-{version}.js",
                      "~/Scripts/toastr.js",
                      "~/Scripts/moment.js",
                      "~/Scripts/pace.js",
                      "~/Scripts/jquery.cookie-{version}.js",
                      "~/Scripts/app/chrisjsherm.counter.js",
                      "~/Scripts/foundation/foundation.js",
                      "~/Scripts/foundation/foundation.reveal.js")
                  );
        }

        public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
            {
                throw new ArgumentNullException("ignoreList");
            }

            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");
            ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }
    }
}