define(['services/logger', 'plugins/router', 'viewmodels/posts/browse',
    'datacontexts/post.datacontext'],
    function (logger, router, browseVM, datacontext) {
        var vm = {
            //#region Initialization
            activate: activate,
            deactivate: deactivate,
            title: 'DETAILS',
            error: ko.observable(),
            //#endregion

            //#region Properties
            item: ko.observable(),
            selectedPhoto: ko.observable(),
            showBackButton: ko.observable(true),
            //#endregion

            //#region Methods
            selectPhoto: selectPhoto,
            //#endregion
        };

        return vm;

        //#region Internal Methods
        function activate(id) {
            logger.log('Details view activated', null, 'posts/details', false);
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            getPost(id);
            return true;
        }

        function deactivate() {
            vm.item(undefined);
            vm.error(undefined);

            return true;
        }

        function selectPhoto(photo) {
            vm.selectedPhoto(photo);
        }

        function getPost(postId) {
            return datacontext.getPost(postId, vm.item, vm.error)
                .done(function (result) {
                    selectPhoto(vm.item().Photos()[0]);
                    indicateReadyForData(result);
                });
        }

        function indicateReadyForData(newItems) {
            if (newItems.length < 1) {
                vm.noItemsToShow(true);
            }
        }
        //#endregion
    });