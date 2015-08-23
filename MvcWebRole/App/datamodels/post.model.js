define(['services/mongoutility', 'datacontexts/photo.datacontext'],
    function (mongoutility, photoDatacontext) {

        var dataModel = {
            Post: Post,
        };

        return dataModel;

        function Post(data) {
            /// <summary>Client-side representation of Post</summary>
            /// <param name="data" type="Object">Post data</param>

            var self = this;
            data = data || {};

            //#region Persisted properties
            self.Id = data.Id;
            self.DateTimeCreated = data.DateTimeCreated || new Date();
            self.DateTimeEdited = data.DateTimeEdited || [];
            self.Type = data.Type;
            self.Title = ko.observable(data.Title);
            self.Description = ko.observable(data.Description);
            self.Price = data.Price || 0.00;

            // Default CategoryId to miscellaneous
            self.CategoryId = data.CategoryId || '52027723a5f1a71244f7d39c';

            self.Email = data.Email;
            self.Phone = ko.observable(data.Phone);
            self.Photos = initPhotos(self, data.Photos);
            self.Height = data.Height;
            //#endregion

            //#region Non-persisted properties
            self.errorMessage = ko.observable();
            self.destroy = ko.observable(false);
            //#endregion

            //#region Public methods
            self.toJson = function () { return ko.toJSON(self); };
            //#endregion
        }

        function initPhotos(post, photoData) {
            var photoArray = ko.observableArray([]);

            if (photoData) {
                $.each(photoData, function (index, value) {
                    photoArray.push(photoDatacontext.createPhoto(value));
                });
            }

            return photoArray;
        }
    });