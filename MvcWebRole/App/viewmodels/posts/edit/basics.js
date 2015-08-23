define(['services/logger', 'plugins/router',
    'viewmodels/posts/manage', 'datacontexts/post.datacontext', 'datacontexts/category.datacontext'],
    function (logger, router, manageVM, datacontext, categoryDatacontext) {

        var vm = {
            //#region Initialization
            activate: activate,
            deactivate: deactivate,
            compositionComplete: compositionComplete,
            title: 'EDIT',
            error: ko.observable(),
            //#endregion

            //#region Properties
            id : ko.observable(),
            item: ko.observable(),
            categories: ko.observableArray([]),
            titleMaxLength: 45,
            showBackButton: ko.observable(true),
            //#endregion

            //#region Methods
            validateBasics: validateBasics,
            //#endregion
        };

        vm.titleCountdown = ko.computed(function () {
            if (vm.item() && vm.item().Title()) {
                return (vm.titleMaxLength - vm.item().Title().length);
            }
            return vm.titleMaxLength;
        });

        return vm;

        //#region Internal Methods
        function activate(id) {
            logger.log('Edit post basic info view activated', null, 'posts/edit/basic-info', false);
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            vm.id(id);
            return categoryDatacontext.getCategories(
                vm.categories,
                vm.error,
                "list",
                [getPost],
                []);
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

        function getPost() {
            return datacontext.getPost(vm.id(), vm.item, vm.error);
        }

        function validateBasics() {
            var errorMessage = "Enter a title to continue";
            try {
                if (!vm.item().Title().trim()) {
                    return vm.error(errorMessage);
                }
            } catch (err) {
                return vm.error(errorMessage);
            }
            router.navigate('#/posts/edit/details/' + vm.item().Id);
        }
        //#endregion
    });