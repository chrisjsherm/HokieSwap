define(['services/logger', 'plugins/router'],
    function (logger, router) {

        var vm = {
            //#region Properties
            activate: activate,
            deactivate: deactivate,
            title: 'INSTRUCTIONS',
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
            logger.log('Instructions view activated', null, 'information/instructions', false);
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            return true;
        }

        function deactivate() {
            vm.error(undefined);
            return true;
        }
        //#endregion
    });