using MongoRepository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using DataAnnotationsExtensions;
using System.Linq;
using System.Web;

namespace SwapEntities
{
    [JsonObject(MemberSerialization.OptOut)]
    public class Post : Entity
    {
        public DateTimeOffset DateTimeCreated { get; set; }

        public ICollection<DateTimeOffset> DateTimeEdited { get; set; }
        
        [Required]
        public Type Type { get; set; }

        [Required]
        [MaxLength(45)]
        public string Title { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        [MaxLength(100)]
        [Email]
        public string Email { get; set; }

        [MaxLength(15)]
        public string Phone { get; set; }

        public decimal? Price { get; set; }

        [Required]
        [MaxLength(24)]
        public string CategoryId { get; set; }

        public ICollection<Photo> Photos { get; set; }

        public int Height { get; set; }

        public string UserPid { get; set; }
    }
}