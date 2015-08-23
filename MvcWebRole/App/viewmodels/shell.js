define(['plugins/router', 'durandal/app'],
    function (router, app) {

        var shell = {
            activate: activate,
            attached: attached,
            router: router,
        };

        return shell;

        //#region Internal Methods
        function activate() {
            router.map([

                {
                    route: ['', 'posts/browse'],
                    title: 'Browse',
                    moduleId: 'viewmodels/posts/browse',
                    nav: true,
                    icon: 'fi-home',
                    hash: '/#/posts/browse'
                },
                {
                    route: 'posts/search',
                    moduleId: 'viewmodels/posts/search',
                    nav: true,
                    title: 'Search',
                    icon: 'fi-magnifying-glass',
                    hash: '/#/posts/search'
                },
                {
                    route: 'posts/create/basics',
                    moduleId: 'viewmodels/posts/create/basics',
                    nav: true,
                    title: 'Create',
                    icon: 'fi-page-add',
                    hash: '/#/posts/create/basics'
                },
                {
                    route: 'posts/manage',
                    moduleId: 'viewmodels/posts/manage',
                    nav: true,
                    title: 'Manage',
                    icon: 'fi-wrench',
                    hash: '/#/posts/manage'
                },

                { route: 'posts/create/contact', moduleId: 'viewmodels/posts/create/contact' },
                { route: 'posts/create/details', moduleId: 'viewmodels/posts/create/details' },
                { route: 'posts/create/photos', moduleId: 'viewmodels/posts/create/photos' },
                { route: 'posts/details/:id', moduleId: 'viewmodels/posts/details' },
                { route: 'posts/edit/basics/:id', moduleId: 'viewmodels/posts/edit/basics' },
                { route: 'posts/edit/contact/:id', moduleId: 'viewmodels/posts/edit/contact' },
                { route: 'posts/edit/details/:id', moduleId: 'viewmodels/posts/edit/details' },
                { route: 'posts/edit/photos/:id', moduleId: 'viewmodels/posts/edit/photos' },
                { route: 'posts/filter-by-category', moduleId: 'viewmodels/posts/filter-by-category' },
                { route: 'posts/filter-by-type', moduleId: 'viewmodels/posts/filter-by-type' },
                { route: 'posts/search-results', moduleId: 'viewmodels/posts/search-results' },
                { route: 'posts/terms', moduleId: 'viewmodels/posts/terms' },
                { route: 'posts/instructions', moduleId: 'viewmodels/posts/instructions' },

                { route: 'information/index', moduleId: 'viewmodels/information/index' },
                { route: 'information/instructions', moduleId: 'viewmodels/information/instructions' },
                { route: 'information/terms', moduleId: 'viewmodels/information/terms' }
            ]).buildNavigationModel();

            return router.activate();
        }

        function attached() {
            // Initialize Foundation scripts.
            $(document).foundation();

            // Check for cookie designating whether a user has visited before.
            if ($.cookie('prior-visit') !== 'true') {
                // Add cookie to designate user has visited.
                $.cookie('prior-visit', true, { expires: 365, path: '/', secure: true });

                // Open modal to alert user of app terms.
                $('#modalAlertWindow').foundation('reveal', 'open');

                // Hook up the 'Continue' button to close button in alert modal.
                $('span.button-close-reveal-modal').on('click', function () {
                    $('a.close-reveal-modal').trigger('click');
                });
            }

            // Create Counter object
            var countdown = new chrisjsherm.Counter({
                seconds: 1170,

                onUpdateStatus: function (second) {
                    // Hit the dummy controller to extend the session.
                    if (parseInt(second, 10) < 91) {
                        $.get('/api/session/extend');
                    }
                }
            });

            // Start counter
            countdown.start();

            // Restart the counter after successful Ajax requests.
            $(document).ajaxSuccess(function () {
                countdown.restart();
            });
        }
        //#endregion
    });
