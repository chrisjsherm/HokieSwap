define(['plugins/router', 'datamodels/category.model', 'services/contexthelper'],
    function (router, model, contextHelper) {

    // Public api
    var datacontext = {
        createCategory: createCategory,
        getCategory: getCategory,
        getCategories: getCategories,
    };

    return datacontext;

    //#region Public methods
    function createCategory(data) {
        /// <summary>Create new Category</summary>
        /// <param name="data" type="Object">Category data from server</param>

        return new model.Category(data);
    }

    function getCategory(id, itemObservable, errorObservable) {
        return contextHelper.ajaxRequest("get", categoryApi("getbyid", id))
            .done(getSucceeded)
            .fail(getFailed);

        function getSucceeded(data) {
            itemObservable(new createCategory(data));
        }

        function getFailed(result) {
            itemObservable(undefined);
            errorObservable("Error retrieving category: " + result.statusText);
        }
    }

    function getCategories(itemObservableArray, errorObservable, action, successFunctions,
        alwaysFunctions) {
        return contextHelper.ajaxRequest("get", categoryApi(action))
            .done(getSucceeded)
            .fail(getFailed)
            .always(getAlways);

        function getSucceeded(data) {
            var mappedItems = $.map(data, function (item) { return new createCategory(item); });
            itemObservableArray(mappedItems);

            $.each(successFunctions || [], function (index, value) {
                value(mappedItems);
            });
        }

        function getFailed(result) {
            itemObservableArray([]);
            errorObservable("Error retrieving categories: " + result.statusText);
        }

        function getAlways() {
            $.each(alwaysFunctions || [], function (index, value) {
                value();
            });
        }
    }
    //#endregion

    //#region Private properties
    // Routes
    function categoryApi(action, id) { return "/api/category/" + action + "/" + (id || ""); }
    //#endregion

});