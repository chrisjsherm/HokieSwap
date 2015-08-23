using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SwapEntities
{
    public class Photo
    {
        public string Id { get; set; }

        public DateTimeOffset DateTimeCreated { get; set; }

        public string Source { get; set; }

        public int? Height { get; set; }

        public int? Width { get; set; }
    }
}