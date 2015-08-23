using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SwapEntities
{
    public class SearchResult
    {
        public double score { get; set; }

        public Post obj { get; set; }
    }
}