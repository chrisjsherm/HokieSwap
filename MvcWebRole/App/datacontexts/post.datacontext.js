define(['plugins/router', 'datamodels/post.model', 'services/contexthelper',
    'datacontexts/photo.datacontext'],
    function (router, model, contextHelper, photoDatacontext) {

        // Public api
        var datacontext = {
            createPost: createPost,
            getPost: getPost,
            getPosts: getPosts,
            saveNewPost: saveNewPost,
            saveChangedPost: saveChangedPost,
            deletePost: deletePost,
            searchPosts: searchPosts,
            renewPost: renewPost,
            deleteExpiredPost: deleteExpiredPost,
        };

        return datacontext;

        //#region Public methods
        function createPost(data) {
            /// <summary>Create new Post</summary>
            /// <param name="data" type="Object">Post data from server</param>

            return new model.Post(data);
        }

        function getPost(id, itemObservable, errorObservable) {
            return contextHelper.ajaxRequest("get", postApi("getbyid", id))
                .done(getSucceeded)
                .fail(getFailed);

            function getSucceeded(data) {
                itemObservable(new createPost(data));
            }

            function getFailed(result) {
                itemObservable(undefined);
                errorObservable("Error retrieving post: " + result.statusText);
            }
        }

        function getPosts(itemObservableArray, errorObservable, action, data, callbackFunctions) {
            return $.getJSON(postApi(action), data)
                .done(getSucceeded)
                .fail(getFailed);

            function getSucceeded(data) {
                var mappedItems = $.map(data, function (item) {
                    var newItem = new createPost(item);
                    itemObservableArray.push(newItem);
                    return newItem;
                });

                $.each(callbackFunctions || [], function (index, value) {
                    value(mappedItems);
                });
            }

            function getFailed(result) {
                itemObservableArray([]);
                errorObservable("Error retrieving posts: " + result.statusText);
            }
        }

        function searchPosts(itemObservableArray, errorObservable, action, data, callbackFunctions) {
            return $.getJSON(postApi(action), data)
                .done(getSucceeded)
                .fail(getFailed);

            function getSucceeded(data) {
                var mappedItems = $.map(data, function (item) {
                    var newItem = new createPost(item.obj);
                    itemObservableArray.push(newItem);
                    return newItem;
                });

                $.each(callbackFunctions || [], function (index, value) {
                    value(mappedItems);
                });
            }

            function getFailed(result) {
                itemObservableArray([]);
                errorObservable("Error retrieving posts: " + result.statusText);
            }
        }

        function saveNewPost(item, successFunctions) {
            contextHelper.clearErrorMessage(item);
            item.Height = getHeight(item.Photos());

            return contextHelper.ajaxRequest("post", postApi("post"), item)
                .done(getSucceeded)
                .fail(getFailed);

            function getSucceeded(result) {
                $.each(successFunctions || [], function (index, value) {
                    value(result);
                });
            }

            function getFailed(result) {
                var errorText = 'Error adding the new item: ' +
                    result.statusText + '.';
                item.errorMessage(contextHelper.getModelStateErrors(result, errorText));
            }
        }

        function saveChangedPost(item, errorObservable, successFunctions) {
            contextHelper.clearErrorMessage(item);
            item.Height = getHeight(item.Photos());

            $.each(item.Photos(), function (index, value) {
                if (value.destroy()) {
                    photoDatacontext.deletePhoto(value, item.Photos, errorObservable);
                    item.Photos.remove(value);
                }
            });

            return contextHelper.ajaxRequest("put", postApi("put", item.Id), item)
                .done(getSucceeded)
                .fail(getFailed);

            function getSucceeded(result) {
                $.each(successFunctions || [], function (index, value) {
                    value(result);
                });
            }

            function getFailed(result) {
                var errorText = 'Error updating the item: ' +
                    result.statusText + '.';
                item.errorMessage(contextHelper.getModelStateErrors(result, errorText));
            }
        }

        function deletePost(item, itemObservableArray, errorObservable) {
            return contextHelper.ajaxRequest("delete", postApi("delete", item.Id))
                .done(function () {
                    itemObservableArray.remove(item);
                    $.each(item.Photos(), function (index, value) {
                        photoDatacontext.deletePhoto(value, item.Photos, errorObservable);
                    });
                })
                .fail(function (result) {
                    errorObservable("Error removing your post: " + result.statusText);
                });
        }

        function renewPost(item, errorObservable, successFunctions) {
            return contextHelper.ajaxRequest("put", postApi("renew", item.Id))
                .done(getSucceeded)
                .fail(getFailed);

            function getSucceeded(result) {
                $.each(successFunctions || [], function (index, value) {
                    value(result);
                });
            }

            function getFailed(result) {
                var errorText = 'Error renewing the item: ' +
                    result.statusText + '.';
                item.errorMessage(contextHelper.getModelStateErrors(result, errorText));
            }
        }

        function deleteExpiredPost(item, itemObservableArray, errorObservable) {
            return contextHelper.ajaxRequest("delete", postApi("deleteexpired", item.Id))
                .done(function () {
                    itemObservableArray.remove(item);
                    $.each(item.Photos(), function (index, value) {
                        photoDatacontext.deletePhoto(value, item.Photos, errorObservable);
                    });
                })
                .fail(function (result) {
                    errorObservable("Error removing your post: " + result.statusText);
                });
        }
        //#endregion

        //#region Private properties
        function getHeight(photoArray) {
            var height = 90;

            $.each(photoArray || [], function (index, value) {
                height += value.Height;
            });

            return height;
        }

        // Routes
        function postApi(action, id) { return "/api/post/" + action + "/" + (id || ""); }
        //#endregion

    });