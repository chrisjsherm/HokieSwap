using MongoRepository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace SwapEntities
{
    [JsonObject(MemberSerialization.OptOut)]
    public class User : Entity
    {
        [Required]
        public string Pid { get; set; }

        public ICollection<string> Roles { get; set; }
    }
}