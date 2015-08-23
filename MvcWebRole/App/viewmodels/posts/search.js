define(['services/logger', 'plugins/router', 'datacontexts/category.datacontext'],
    function (logger, router, categoryDatacontext) {
        var vm = {
            //#region Initialization
            activate: activate,
            deactivate: deactivate,
            title: ko.observable('SEARCH'),
            error: ko.observable(),
            //#endregion

            //#region Properties
            categories: ko.observableArray([]),
            filterCategoryId: ko.observable(''),
            searchString: ko.observable(),
            noItemsToShow: ko.observable(false),
            showBackButton: ko.observable(false),
            //#endregion

            //#region Methods
            //#endregion
        };

        vm.throttledSearchString = ko.computed(vm.searchString).extend({ throttle: 1200 });

        vm.throttledSearchString.subscribe(function (newValue) {
            if (newValue) {
                router.navigate('#/posts/search-results?searchstring=' + encodeURIComponent(newValue));
            }
        });

        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('Search view activated', null, 'posts/search', false);
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            vm.searchString('');

            if (undefined === vm.categories()[0]) {
                return categoryDatacontext.getCategories(vm.categories, vm.error, "list");
            }
        }

        function deactivate() {
            vm.error(undefined);

            return true;
        }
        //#endregion
    });