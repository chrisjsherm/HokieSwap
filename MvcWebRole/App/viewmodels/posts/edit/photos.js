define(['services/logger', 'plugins/router', 'viewmodels/posts/edit/basics',
        'datacontexts/photo.datacontext'],
    function (logger, router, createVM, photoDatacontext) {

        var vm = {
            //#region Initialization
            activate: activate,
            deactivate: deactivate,
            compositionComplete: compositionComplete,
            title: 'EDIT',
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
            logger.log('Edit post images view activated',
                null, 'posts/edit/images',
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
            vm.item().Photos()[vm.item().Photos().indexOf(item)].destroy(true);
        }

        function continueNavigation() {
            router.navigate('#/posts/edit/contact/' + vm.item().Id);
        }
        //#endregion
    });