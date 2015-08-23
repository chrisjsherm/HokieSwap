using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SwapEntities
{
    public class PostSearch
    {
        public Type Type { get; set; }

        public Category Category { get; set; }

        public string SearchString { get; set; }
    }
}