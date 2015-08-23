using MongoRepository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SwapEntities
{
    [JsonObject(MemberSerialization.OptOut)]
    public class Category : Entity
    {
        [MaxLength(25)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string Description { get; set; }
    }
}