define(['datacontexts/category.datacontext'],
    function (categoryDatacontext) {

        var cacheME = {
            cacheCategories: cacheCategories,
            getCategories: getCategories,
        };

        return cacheME;

        //#region Public methods
        function cacheCategories() {
            var categories = ko.observableArray([]);
            var error = ko.observable();
            return categoryDatacontext.getCategories(categories, error, "list")
                .done(getSucceeded)
                .fail(getFailed);

            function getSucceeded() {
                write('categories', categories());
            }

            function getFailed() {
            }
        }

        function getCategories(itemObservableArray, errorObservable) {
            var response = read('categories');

            if (response[0]) {
                itemObservableArray(response);
            } else {
                errorObservable(response);
            }
        }
        //#endregion

        //#region Private methods
        function write(key, value) {
            if (Modernizr.localstorage) {
                localStorage[key] = JSON.stringify(value);
            } else {
                return false;
            }
        }

        function read(key) {
            if (Modernizr.localstorage) {
                var value = localStorage[key] || undefined;
                if (value) {
                    return JSON.parse(value);
                }
                return 'Key not found in local storage';
            } else {
                return 'Local storage not supported by your browser';
            }
        }
        //#endregion
    });
    