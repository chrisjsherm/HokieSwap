define([], function () {

    var dataModel = {
        Category: Category,
    };

    return dataModel;

    function Category(data) {
        /// <summary>Client-side representation of Category</summary>
        /// <param name="data" type="Object">Category data</param>

        var self = this;
        data = data || {};

        //#region Persisted properties
        self.Id = data.Id;
        self.Name = ko.observable(data.Name);
        self.Description = ko.observable(data.Description);
        //#endregion

        //#region Non-persisted properties
        self.errorMessage = ko.observable();
        //#endregion

        //#region Public methods
        self.toJson = function () { return ko.toJSON(self); };
        //#endregion
    }
});