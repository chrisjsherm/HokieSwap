define([],
    function () {
        var utility = {
            getTimestamp: getTimestamp
        };

        return utility;

        function getTimestamp(objectId) {
            if (undefined === undefined) {
                return null;
            }
            return new Date(parseInt(objectId.toString().substring(0, 8), 16) * 1000);
        }
    });