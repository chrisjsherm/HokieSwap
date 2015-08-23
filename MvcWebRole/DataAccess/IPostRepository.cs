using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SwapEntities;
using MongoRepository;
using System.Linq.Expressions;
using MongoDB.Driver.Builders;
using MongoDB.Driver;

namespace MvcWebRole.DataAccess
{
    interface IPostRepository : IRepository<Post>
    {
        IEnumerable<Post> GetPagedListGreaterThanProperty(
            Expression<Func<Post, string>> propertyExpression,
            string valueToCompare,
            SortByBuilder sortCondition,
            int pageSize);

        IEnumerable<Post> GetPagedListLessThanProperty(
            Expression<Func<Post, string>> propertyExpression,
            string valueToCompare,
            SortByBuilder sortCondition,
            int pageSize);

        IList<SearchResult> SearchPosts(
            string searchString,
            IMongoQuery filter = null,
            int documentLimit = 100);
    }
}
