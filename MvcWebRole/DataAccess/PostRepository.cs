using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoRepository;
using SwapEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;

namespace MvcWebRole.DataAccess
{
    public class PostRepository : MongoRepository<Post>, IPostRepository
    {
        public IEnumerable<Post> GetPagedListGreaterThanProperty(
            Expression<Func<Post, string>> propertyExpression,
            string valueToCompare,
            SortByBuilder sortCondition,
            int pageSize)
        {
            IMongoQuery query = Query<Post>.GT(propertyExpression, valueToCompare);
            var cursor = this.Collection.Find(query);
            cursor.SetSortOrder(sortCondition);
            cursor.Limit = pageSize;
            return cursor;
        }

        public IEnumerable<Post> GetPagedListLessThanProperty(
            Expression<Func<Post, string>> propertyExpression,
            string valueToCompare,
            SortByBuilder sortCondition,
            int pageSize)
        {
            IMongoQuery query = Query<Post>.LT(propertyExpression, valueToCompare);
            var cursor = this.Collection.Find(query);
            cursor.SetSortOrder(sortCondition);
            cursor.Limit = pageSize;
            return cursor;
        }

        public IList<SearchResult> SearchPosts(
            string searchString,
            IMongoQuery filter = null,
            int documentLimit = 100)
        {
            var textSearchCommand = new CommandDocument
            {
                {"text", this.Collection.Name},
                {"search", searchString},
                {"filter", BsonValue.Create(filter)},
                {"limit", documentLimit}
            };

            var commandResult = this.Collection.Database.RunCommand(textSearchCommand);
            var results = commandResult.Response["results"].AsBsonArray;
            IList<SearchResult> postList = new List<SearchResult>();
            foreach (BsonDocument document in results)
            {
                postList.Add(BsonSerializer.Deserialize<SearchResult>(document));
            }
            return postList;
        }
    }
}