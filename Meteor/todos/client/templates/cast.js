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
            var casteremail = Meteor.user()['emails'][0]['address'];
            var castername = casteremail.substring(0, casteremail.indexOf('@'));

            // Insert a task into the collection
            // Add this to the database for caster
            Broadcast.insert({
               casteremail: casteremail,
               castername: castername,
               place: place,
               items: items,
               time: time,
               charge: charge,
               isDropoff: isDropoff
            });
            console.log('Broadcast inserted');
            Router.go('castsShow', Broadcast.findOne());
        }
    });
}
