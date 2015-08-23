using MongoDB;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoRepository;
using MvcWebRole.DataAccess;
using SwapEntities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace MvcWebRole.Controllers
{
    public class PostController : ApiController
    {
        private PostRepository repository = new PostRepository();
        private const int PAGE_SIZE = 25;
        private MongoCollection expiredPostCollection;
        private MongoCollection deletedPostCollection;

        public PostController()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["MongoServerSettings"].ConnectionString;
            var client = new MongoClient(connectionString);
            var server = client.GetServer();
            MongoDatabase database;
            database = server.GetDatabase(ConfigurationManager.AppSettings["MongoDatabaseName"]);
            this.expiredPostCollection = database.GetCollection<Post>("ExpiredPost");
            this.deletedPostCollection = database.GetCollection<Post>("DeletedPost");
        }

        // GET api/post/recent
        [HttpGet]
        public HttpResponseMessage Recent()
        {
            IQueryable<Post> query = repository
                .OrderByDescending(p => p.Id)
                .Take(PAGE_SIZE);

            return Request.CreateResponse<IEnumerable<Post>>(HttpStatusCode.OK, query);
        }

        // GET api/post/older
        [HttpGet]
        public HttpResponseMessage Older(string lastItemId = null)
        {
            if (lastItemId != null)
            {
                IEnumerable<Post> posts = repository.GetPagedListLessThanProperty(
                    p => p.Id,
                    lastItemId,
                    SortBy.Descending("_id"),
                    PAGE_SIZE);

                return Request.CreateResponse<IEnumerable<Post>>(HttpStatusCode.OK, posts);
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }

        // GET api/post/getbyid/5
        [HttpGet]
        public HttpResponseMessage GetById(string id)
        {
            Post post = repository.GetById(id);

            return Request.CreateResponse<Post>(HttpStatusCode.OK, post);
        }

        // GET api/post/manage
        [HttpGet]
        public HttpResponseMessage Manage()
        {
            IQueryable<Post> query = repository
                .Where(p => p.UserPid == User.Identity.Name)
                .OrderByDescending(p => p.Id);

            return Request.CreateResponse<IEnumerable<Post>>(HttpStatusCode.OK, query);
        }

        [HttpGet]
        public HttpResponseMessage GetOwnExpired()
        {
            var query = Query<Post>.EQ(p => p.UserPid, User.Identity.Name);
            var expiredPosts = new List<Post>();
            foreach (var post in expiredPostCollection.FindAs<Post>(query))
            {
                expiredPosts.Add(post);
            }

            return Request.CreateResponse<IEnumerable<Post>>(HttpStatusCode.OK, expiredPosts);
        }

        // PUT api/post/renew
        [HttpPut]
        public HttpResponseMessage Renew(string id)
        {
            var query = Query<Post>.EQ(p => p.Id, id);
            var post = expiredPostCollection.FindOneAs<Post>(query);
            if (this.CanModifyPost(post))
            {
                post.DateTimeCreated = new DateTimeOffset(DateTime.UtcNow);
                repository.Add(post);

                this.expiredPostCollection.Remove(query);

                return Request.CreateResponse<Post>(HttpStatusCode.OK, post);
            }

            throw new HttpResponseException(HttpStatusCode.Unauthorized);
        }

        // GET api/post/filterrecentbytype
        [HttpGet]
        public HttpResponseMessage FilterRecentByType(int type = 0)
        {
            if (type != 0)
            {
                IQueryable<Post> query = repository
                    .Where(p => (int)p.Type == type)
                    .OrderByDescending(p => p.Id)
                    .Take(PAGE_SIZE);
                return Request.CreateResponse<IEnumerable<Post>>(HttpStatusCode.OK, query);
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }

        // GET api/post/filterolderbytype
        [HttpGet]
        public HttpResponseMessage FilterOlderByType(
            int type = 0,
            string lastItemId = null)
        {
            if (type != 0 && lastItemId != null)
            {
                List<IMongoQuery> mongoQueries = new List<IMongoQuery>();
                mongoQueries.Add(Query<Post>.LT(p => p.Id, lastItemId));
                mongoQueries.Add(Query<Post>.EQ(p => (int)p.Type, type));

                var mongoQuery = Query.And(mongoQueries.ToArray());
                var cursor = repository.Collection.Find(mongoQuery);
                cursor.SetSortOrder(SortBy.Descending("_id"));
                cursor.Limit = PAGE_SIZE;

                return Request.CreateResponse<IEnumerable<Post>>(HttpStatusCode.OK, cursor);
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }

        // GET api/post/filterrecentbycategory
        [HttpGet]
        public HttpResponseMessage FilterRecentByCategory(string categoryId)
        {
            if (!String.IsNullOrEmpty(categoryId))
            {
                IQueryable<Post> query = repository
                    .Where(p => p.CategoryId == categoryId)
                    .OrderByDescending(p => p.Id)
                    .Take(PAGE_SIZE);

                return Request.CreateResponse<IEnumerable<Post>>(HttpStatusCode.OK, query);
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }

        // GET api/post/filterolderbycategory
        [HttpGet]
        public HttpResponseMessage FilterOlderByCategory(
            string categoryId,
            string lastItemId = null)
        {
            if (!String.IsNullOrEmpty(categoryId) && lastItemId != null)
            {
                List<IMongoQuery> mongoQueries = new List<IMongoQuery>();
                mongoQueries.Add(Query<Post>.LT(p => p.Id, lastItemId));
                mongoQueries.Add(Query<Post>.EQ(p => p.CategoryId, categoryId));

                var mongoQuery = Query.And(mongoQueries.ToArray());
                var cursor = repository.Collection.Find(mongoQuery);
                cursor.SetSortOrder(SortBy.Descending("_id"));
                cursor.Limit = PAGE_SIZE;

                return Request.CreateResponse<IEnumerable<Post>>(HttpStatusCode.OK, cursor);
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }

        // GET api/post/search
        [HttpGet]
        public HttpResponseMessage Search(
            string searchString,
            int type = 0,
            string categoryId = null)
        {
            if (searchString.Length > 0)
            {
                var query = repository.SearchPosts(searchString);
                return Request.CreateResponse<IList<SearchResult>>(HttpStatusCode.OK, query);
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }

        // GET api/post/searchbytype
        [HttpGet]
        public HttpResponseMessage SearchByType(
            string searchString,
            int type = 0)
        {
            if (searchString.Length > 0 && type != 0)
            {
                var filter = Query<Post>.EQ(p => (int)p.Type, type);
                var query = repository.SearchPosts(searchString, filter);
                return Request.CreateResponse<IList<SearchResult>>(HttpStatusCode.OK, query);
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }

        // GET api/post/searchbycategory
        [HttpGet]
        public HttpResponseMessage SearchByCategory(
            string searchString,
            string categoryId = null)
        {
            if (searchString.Length > 0 && categoryId != null)
            {
                var filter = Query<Post>.EQ(p => p.CategoryId, categoryId);
                var query = repository.SearchPosts(searchString, filter);
                return Request.CreateResponse<IList<SearchResult>>(HttpStatusCode.OK, query);
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }

        // POST api/post/post
        [HttpPost]
        public HttpResponseMessage Post([FromBody]Post post)
        {
            post.DateTimeCreated = new DateTimeOffset(DateTime.UtcNow);
            post.UserPid = User.Identity.Name;
            Post newPost = repository.Add(post);

            return Request.CreateResponse<Post>(HttpStatusCode.Created, newPost);
        }

        // PUT api/post/put/5
        [HttpPut]
        public HttpResponseMessage Put(string id, [FromBody]Post post)
        {
            if (this.CanModifyPost(repository.GetById(id)))
            {
                post.DateTimeEdited.Add(new DateTimeOffset(DateTime.UtcNow));
                post.Id = id;
                post.UserPid = User.Identity.Name;

                Post updatedPost = repository.Update(post);

                return Request.CreateResponse<Post>(HttpStatusCode.OK, updatedPost);
            }

            throw new HttpResponseException(HttpStatusCode.Unauthorized);
        }

        // DELETE api/post/delete/5
        [HttpDelete]
        public HttpResponseMessage Delete(string id)
        {
            var post = repository.GetById(id);
            if (this.CanModifyPost(post))
            {
                deletedPostCollection.Insert(post);
                repository.Delete(id);
                return Request.CreateResponse(HttpStatusCode.NoContent, "application/json");
            }

            throw new HttpResponseException(HttpStatusCode.Unauthorized);
        }

        // DELETE api/post/deleteexpired/5
        [HttpDelete]
        public HttpResponseMessage DeleteExpired(string id)
        {
            var query = Query<Post>.EQ(p => p.Id, id);
            var post = expiredPostCollection.FindOneAs<Post>(query);
            if (this.CanModifyPost(post))
            {
                deletedPostCollection.Insert(post);
                this.expiredPostCollection.Remove(query);
                return Request.CreateResponse(HttpStatusCode.NoContent, "application/json");
            }

            throw new HttpResponseException(HttpStatusCode.Unauthorized);
        }

        #region Helpers
        private bool CanModifyPost(Post post)
        {
            if (post.UserPid == User.Identity.Name)
            {
                return true;
            }

            return false;
        }
        #endregion
    }
}
