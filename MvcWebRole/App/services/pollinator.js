define([],
    function () {
        var pollinator = {
            pollinate: pollinate,
        };

        return pollinator;

        function pollinate(valueCollection, observableCollection, heightCollection) {
            var addToIndex = 0;

            $.each(valueCollection, function (index, value) {
                addToIndex = heightCollection.indexOf(Math.min.apply(Math, heightCollection));

                heightCollection[addToIndex] += parseInt(value.Height, 10);
                observableCollection[addToIndex].push(value);
            });
        }
    });