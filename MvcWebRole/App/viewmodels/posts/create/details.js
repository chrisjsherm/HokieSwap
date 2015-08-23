define(['services/logger', 'plugins/router', 'viewmodels/posts/create/basics'],
    function (logger, router, createVM) {

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
            descriptionMaxLength: 1000,
            showBackButton: ko.observable(false),
            //#endregion

            //#region Methods
            validateDetails: validateDetails,
            //#endregion
        };

        vm.descriptionCountdown = ko.computed(function () {
            if (vm.item() && vm.item().Description()) {
                return (vm.descriptionMaxLength - vm.item().Description().length);
            }
            return vm.descriptionMaxLength;
        });

        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('Create post details view activated', null, 'posts/create/item-details', false);
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

        function validateDetails() {
            var errorMessage = "Enter a description to continue";
            try {
                if (!vm.item().Description().trim()) {
                    return vm.error(errorMessage);
                }
            } catch (err) {
                return vm.error(errorMessage);
            }

            errorMessage = "Enter a valid price to continue";
            if (vm.item().Price !== '') {
                try {
                    var price = parseFloat(vm.item().Price);
                    if (isNaN(price) || !price.validatePrice()) {
                        return vm.error(errorMessage);
                    }
                } catch (err) {
                    return vm.error(errorMessage);
                }
            }
            router.navigate('#/posts/create/photos');
        }
        //#endregion
    });