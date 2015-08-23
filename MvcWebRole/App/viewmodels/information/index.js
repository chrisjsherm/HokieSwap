define(['services/logger', 'plugins/router'],
    function (logger, router) {

        var vm = {
            //#region Properties
            activate: activate,
            deactivate: deactivate,
            title: 'INFORMATION',
            error: ko.observable(),
            //#endregion

            //#region Properties
            showBackButton: ko.observable(false),
            //#endregion

            //#region Methods
            //#endregion
        };

        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('Information view activated', null, 'information/index', false);
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            return true;
        }

        function deactivate() {
            vm.error(undefined);
            return true;
        }
        //#endregion
    });