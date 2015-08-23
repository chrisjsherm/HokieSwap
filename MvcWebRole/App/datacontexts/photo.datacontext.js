define(['plugins/router', 'datamodels/photo.model', 'services/contexthelper'],
    function (router, model, contextHelper) {

        // Public api
        var datacontext = {
            createPhoto: createPhoto,
            saveNewPhotos: saveNewPhotos,
            deletePhoto: deletePhoto,
        };

        return datacontext;

        //#region Public methods
        function createPhoto(data) {
            /// <summary>Create new Photo</summary>
            /// <param name="data" type="Object">Photo data from server</param>

            return new model.Photo(data);
        }

        function saveNewPhotos(data, evt, itemObservable, errorObservable) {
            var files = evt.target.files;
            var numberOfFiles = files.length;

            for (var z = 0; z < numberOfFiles; ++z) {
                var mimeType = files[z].type;

                switch (mimeType) {
                    case 'image/jpeg':
                        break;
                    case 'image/png':
                        break;
                    default:
                        return errorObservable('File ' + (z + 1) + ' of ' + numberOfFiles +
                            ' is invalid. Valid file types include JPEG and PNG.');
                }

                var fileSize = files[z].size;
                if (fileSize > 5243000) {
                    return errorObservable('File ' + (z + 1) + ' of ' + numberOfFiles +
                        ' is too large. Maximum file size is 5 MB.');
                }
            }

            if (files.length < 4) {
                var formData = new FormData();
                var url = photoApi('post');

                for (var i = 0, file; file = files[i]; ++i) {
                    var formData = new FormData();
                    formData.append(file.name, file);
                    postPhoto(formData, url, itemObservable);
                }
            } else {
                return errorObservable("You may upload a maximum of three photos. Please reselect the photos you wish to add");
            }
        }

        function deletePhoto(item, itemObservableArray, errorObservable) {
            return contextHelper.ajaxRequest('delete', photoApi('delete', item.Id))
                .done(function () {
                    itemObservableArray.remove(item);
                })
                .fail(function (result) {
                    errorObservable("Error removing your photo: " + result.statusText);
                });
        }
        //#endregion

        //#region Private properties
        // Routes
        function photoApi(action, id) { return "/api/photo/" + action + "/" + (id || ""); }

        function postPhoto(formData, url, itemObservable) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.onload = function (e) {
                var result = JSON.parse(xhr.response);

                var img = new Image();
                img.onload = function () {
                    result.Height = img.height;
                    result.Width = img.width;
                    itemObservable().Photos.push(createPhoto(result));
                };
                img.src = result.Source;
            };
            xhr.send(formData);
        }
        //#endregion

    });