define(['services/logger', 'plugins/router',
    'datacontexts/post.datacontext', 'datacontexts/category.datacontext'],
    function (logger, router, postDatacontext, categoryDatacontext) {
        var vm = {
            //#region Properties
            activate: activate,
            deactivate: deactivate,
            title: 'MANAGE',
            error: ko.observable(),
            //#endregion

            //#region Properties
            items: ko.observableArray([]),
            expiredItems: ko.observableArray([]),
            editItems: ko.observable(false),
            showBackButton: ko.observable(false),
            //#endregion

            //#region Methods
            selectItem: selectItem,
            toggleEditItems: toggleEditItems,
            renewItem: renewItem,
            //#endregion
        };

        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('Manage posts view activated', null, 'posts/manage', false);
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            clearItems();
            getItems('manage', vm.items, []);
            getItems('GetOwnExpired', vm.expiredItems);
            return true;
        }

        function deactivate() {
            vm.error(undefined);
            return true;
        }

        function clearItems() {
            vm.items([]);
        }


        function getItems(action, itemArray, successFunctions) {
            postDatacontext.getPosts(
                itemArray,
                vm.error,
                action,
                null,
                successFunctions || []
            );
        }

        function selectItem(item) {
            if (vm.editItems()) {
                if (confirm("Are you sure you want to delete this item?")) {
                    deleteItem(item);
                    return false;
                } else {
                    return false;
                }
            } else {
                return router.navigate('#/posts/edit/basics/' + item.Id);
            }
        }

        function toggleEditItems() {
            vm.editItems(!vm.editItems());
        }

        function deleteItem(item) {
            return postDatacontext.deletePost(item, vm.items, vm.error);
        }

        function renewItem(item) {
            if (vm.editItems()) {
                if (confirm("Are you sure you want to delete this item?")) {
                    deleteExpiredItem(item);
                    return false;
                } else {
                    return false;
                }
            } else {
                postDatacontext.renewPost(
                    item,
                    vm.error,
                    [refreshItems]);
            }
        }

        function deleteExpiredItem(item) {
            return postDatacontext.deleteExpiredPost(item, vm.expiredItems, vm.error);
        }

        function refreshItems(item) {
            vm.items([]);
            vm.expiredItems([]);
            getItems('manage', vm.items, []);
            getItems('GetOwnExpired', vm.expiredItems);
        }
        //#endregion
    });