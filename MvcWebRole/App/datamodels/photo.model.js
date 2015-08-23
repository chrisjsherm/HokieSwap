define([], function () {

    var dataModel = {
        Photo: Photo,
    };

    return dataModel;

    function Photo(data) {
        /// <summary>Client-side representation of Photo</summary>
        /// <param name="data" type="Object">Photo data</param>

        var self = this;
        data = data || {};

        //#region Persisted properties
        self.Id = data.Id;
        self.DateTimeCreated = new Date(data.DateTimeCreated);
        self.Source = data.Source;
        self.Height = data.Height;
        self.Width = data.Width;
        //#endregion

        //#region Non-persisted properties
        self.errorMessage = ko.observable();
        self.destroy = ko.observable(false);
        //#endregion

        //#region Public methods
        self.toJson = function () { return ko.toJSON(self); };
        //#endregion
    }
});