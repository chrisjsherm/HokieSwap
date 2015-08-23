define(['services/logger', 'plugins/router', 'services/pollinator',
    'datacontexts/post.datacontext', 'datacontexts/category.datacontext'],
    function (logger, router, pollinator, postDatacontext, categoryDatacontext) {
        var vm = {
            //#region Initialization
            activate: activate,
            deactivate: deactivate,
            title: 'HOKIE SWAP',
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
            noItemsToShow: ko.observable(false),
            showBackButton: ko.observable(false),
            showInfoButton: true,
            //#endregion

            //#region Methods
            getMoreItems: getMoreItems,
            selectItem: selectItem,
            //#endregion
        };

        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('Browse posts view activated', null, 'posts/browse', false);
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            clearItems();
            getItems('recent');

            return true;
        }

        function deactivate() {
            vm.error(undefined);
            return true;
        }

        function clearItems() {
            vm.items([]);
            vm.columnOneItems([]);
            vm.columnTwoItems([]);
            vm.columnThreeItems([]);
            vm.columnFourItems([]);
            vm.lastItemId(undefined);
        }

        function getItems(action) {
            postDatacontext.getPosts(
                vm.items,
                vm.error,
                action,
                {
                    lastItemId: vm.lastItemId()
                },
                [updateColumns, updateLastItemId, indicateReadyForData]
            );
        }

        function getMoreItems() {
            if (undefined !== vm.lastItemId()) {
                getItems('older');
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
            } else {
                // Prevent additional requests when zero items returned.
                vm.lastItemId(undefined);
            }
        }

        function indicateReadyForData(newItems) {
            if (newItems.length < 1 && vm.items().length < 1) {
                vm.noItemsToShow(true);
            } else {
                vm.noItemsToShow(false);
            }
        }

        function selectItem(item) {
            $('#' + item.Id +', ' + '#small' + item.Id).toggle(0);
            return true;
        }
        //#endregion
    });