define(['services/logger', 'plugins/router', 'services/pollinator',
    'datacontexts/category.datacontext', 'datacontexts/post.datacontext'],
    function (logger, router, pollinator, categoryDatacontext, postDatacontext) {
        var vm = {
            //#region Initialization
            activate: activate,
            deactivate: deactivate,
            title: ko.observable(),
            error: ko.observable(),
            //#endregion

            //#region Properties
            items: ko.observableArray([]),
            columnOneItems: ko.observableArray([]),
            columnTwoItems: ko.observableArray([]),
            columnThreeItems: ko.observableArray([]),
            columnFourItems: ko.observableArray([]),
            columnHeights: [0, 0, 0, 0],
            lastItemId: ko.observable(),
            filterCategoryId: ko.observable(),
            searchString: ko.observable(),
            noItemsToShow: ko.observable(false),
            showBackButton: ko.observable(true),
            //#endregion

            //#region Methods
            getMoreItems: getMoreItems,
            selectItem: selectItem,
            //#endregion
        };

        vm.throttledSearchString = ko.computed(vm.searchString).extend({ throttle: 1200 });

        vm.throttledSearchString.subscribe(function (newValue) {
            if (newValue) {
                searchItems();
            }
        });

        return vm;

        //#region Internal Methods
        function activate(queryString) {
            logger.log('Filter by category view activated', null, 'posts/filter-by-category', false);
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            vm.title(decodeURIComponent(queryString.filter.toUpperCase()));
            vm.filterCategoryId(queryString.categoryid);

            initItemList();

            return true;
        }

        function deactivate() {
            vm.error(undefined);
            return true;
        }

        function initItemList() {
            var activeModule = getActiveModuleId();

            if (activeModule !== 'viewmodels/posts/details') {
                clearItems();
                vm.searchString(undefined);
                getItems('filterrecentbycategory');
            }
        }

        function getActiveModuleId() {
            if (router.activeItem()) {
                return router.activeItem().__moduleId__;
            }
            return null;
        }

        function clearItems() {
            vm.items([]);
            vm.columnOneItems([]);
            vm.columnTwoItems([]);
            vm.columnThreeItems([]);
            vm.columnFourItems([]);
            vm.lastItemId(undefined);
        }

        function searchItems(searchInput) {
            clearItems();
            postDatacontext.searchPosts(
                vm.items,
                vm.error,
                'searchbycategory',
                {
                    categoryId: vm.filterCategoryId(),
                    searchString: vm.throttledSearchString()
                },
                [updateColumns, updateLastItemId, indicateReadyForData]
            );
        }

        function getMoreItems() {
            if (undefined !== vm.lastItemId()) {
                if (vm.throttledSearchString()) {
                    // TODO: return older searchbytype
                    //getItems('searchbycategory');
                } else {
                    getItems('filterolderbycategory');
                }
            }
        }

        function getItems(action) {
            postDatacontext.getPosts(
                vm.items,
                vm.error,
                action,
                {
                    categoryId: vm.filterCategoryId(),
                    searchString: vm.throttledSearchString(),
                    lastItemId: vm.lastItemId()
                },
                [updateColumns, updateLastItemId, indicateReadyForData]
            );
        }



        function indicateReadyForData(newItems) {
            if (newItems.length < 1 && vm.items().length < 1) {
                vm.noItemsToShow(true);
            } else {
                vm.noItemsToShow(false);
            }
        }

        function updateColumns(newItems) {
            pollinator.pollinate(newItems,
                [vm.columnOneItems, vm.columnTwoItems, vm.columnThreeItems, vm.columnFourItems],
                vm.columnHeights);
        }

        function updateLastItemId(newItems) {
            if (newItems.length > 0) {
                vm.lastItemId(newItems[newItems.length - 1].Id);
            }
        }

        function selectItem(item) {
            $('#' + item.Id + ', ' + '#small' + item.Id).toggle(0);
            return true;
        }
        //#endregion
    });