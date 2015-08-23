define(['services/logger', 'plugins/router', 'viewmodels/posts/create/basics',
        'datacontexts/photo.datacontext'],
    function (logger, router, createVM, photoDatacontext) {

        var vm = {
            //#region Initialization
            activate: activate,
            deactivate: deactivate,
            compositionComplete: compositionComplete,
            title: 'CREATE',
            error: ko.observable(),
            //#endregion

            //#region Properties
            item: createVM.item,
            showBackButton: ko.observable(true),
            //#endregion

            //#region Methods
            removePhoto: removePhoto,
            postPhotos: postPhotos,
            continueNavigation: continueNavigation,
            //#endregion
        };

        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('Create post images view activated',
                null, 'posts/create/images',
                false);
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            return true;
        }

        function deactivate() {
            vm.error(undefined);
            return true;
        }

        function compositionComplete() {
            // Hide the icon-bar when an input element has focus to prevent buggy mobile behavior
            var iconBar = $('.icon-bar');
            $(':input').focus(function () {
                iconBar.hide();
            }).focusout(function () {
                iconBar.show();
            });
        }

        function postPhotos(data, evt) {
            vm.error(undefined);
            vm.item().Photos([]);
            photoDatacontext.saveNewPhotos(data, evt, vm.item, vm.error);
        }

        function removePhoto(item) {
            photoDatacontext.deletePhoto(item, vm.item().Photos, vm.error);
        }

        function continueNavigation() {
            router.navigate('#/posts/create/contact');
        }
        //#endregion
    });