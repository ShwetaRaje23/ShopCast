if (Meteor.isClient) {

    Template.cast.events({
        'submit': function (event, template) {
            // Prevent default browser form submit
            event.preventDefault();
            var place = template.$('[name=place]').val();
            var items = template.$('[name=items]').val();
            var time = template.$('[name=time]').val();
            var charge = template.$('[name=charge]').val();
            var isDropoff  = template.$('[name=dropoff]').val();

            // Insert a task into the collection
            // Add this to the database for caster
            console.log("Here we are!!");

            Broadcast.insert({
               place: place,
               items: items,
               time: time,
               charge: charge,
               isDropoff: isDropoff
            });

            Router.go('listsShow', Lists.findOne());
        }
    });
}
