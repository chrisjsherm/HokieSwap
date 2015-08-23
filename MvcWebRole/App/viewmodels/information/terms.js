define(['services/logger', 'plugins/router'],
    function (logger, router) {

        var vm = {
            //#region Properties
            activate: activate,
            deactivate: deactivate,
            title: 'TERMS',
            error: ko.observable(),
            //#endregion

            //#region Properties
            showBackButton: ko.observable(true),
            //#endregion

            //#region Methods
            //#endregion
        };

        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('Terms and conditions view activated', null, 'information/terms', false);
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            return true;
        }

        function deactivate() {
            vm.error(undefined);
            return true;
        }
        //#endregion
    });