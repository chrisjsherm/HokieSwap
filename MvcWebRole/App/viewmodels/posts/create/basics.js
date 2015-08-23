define(['services/logger', 'plugins/router',
    'datacontexts/post.datacontext', 'datacontexts/category.datacontext'],
    function (logger, router, datacontext, categoryDatacontext) {

        var vm = {
            //#region Initialization
            activate: activate,
            deactivate: deactivate,
            compositionComplete: compositionComplete,
            title: 'CREATE',
            error: ko.observable(),
            //#endregion

            //#region Properties
            item: ko.observable(),
            categories: ko.observableArray([]),
            titleMaxLength: 45,
            showBackButton: ko.observable(false),
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
        function activate() {
            logger.log('Create post basic info view activated', null, 'posts/create/basic-info', false);
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
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
            if (router.activeItem()) {
                var activeModule = router.activeItem().__moduleId__;
                if (activeModule.substring(0, 23) === 'viewmodels/posts/create') {
                    return vm.item(vm.item());
                }
            }
            vm.item(datacontext.createPost({}));
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
            router.navigate('#/posts/create/details');
        }
        //#endregion
    });