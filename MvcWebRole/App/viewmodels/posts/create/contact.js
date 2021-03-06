﻿define(['services/logger', 'plugins/router',
    'viewmodels/posts/create/basics', 'datacontexts/post.datacontext'],
    function (logger, router, createVM, datacontext) {

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
            validateContact: validateContact,
            //#endregion
        };

        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('Create post contact info view activated', null, 'posts/create/contact-info', false);
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

        function saveItem() {
            datacontext.saveNewPost(vm.item(), [clearItem, navigateToDetailView]);
        }

        function navigateToDetailView(newItem) {
            router.navigate('#/posts/details/' + newItem.Id);
        }

        function clearItem(newItem) {
            vm.item(undefined);
        }

        function validateContact() {
            var errorMessage = "Enter a valid email address to continue";
            try {
                if (!vm.item().Email.validateEmail()) {
                    return vm.error(errorMessage);
                }
            } catch (err) {
                return vm.error(errorMessage);
            }

            errorMessage = "The phone number provided is not valid";
            if (vm.item().Phone() !== '' && vm.item().Phone() !== undefined &&
                vm.item().Phone() !== null) {
                try {
                    var generatedPhone = vm.item().Phone().generatePhoneNumber();
                    if (!generatedPhone) {
                        return vm.error(errorMessage);
                    } else {
                        vm.item().Phone(generatedPhone);
                    }
                } catch (err) {
                    return vm.error(errorMessage);
                }
            }
            return saveItem();
        }
        //#endregion
    });