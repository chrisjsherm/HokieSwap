using MongoRepository;
using SwapEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MvcWebRole.Controllers
{
    public class CategoryController : ApiController
    {
        private MongoRepository<Category> repository = new MongoRepository<Category>();

        // GET api/category
        [HttpGet]
        public HttpResponseMessage List()
        {
            IQueryable<Category> categories = repository
                .OrderBy(c => c.Name);

            return Request.CreateResponse<IEnumerable<Category>>(HttpStatusCode.OK, categories);
        }

        // GET api/category/5
        public HttpResponseMessage GetById(string id)
        {
            Category category = repository.GetById(id);

            return Request.CreateResponse<Category>(HttpStatusCode.OK, category);
        }
    }
}
