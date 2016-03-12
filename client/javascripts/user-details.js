if (Meteor.isClient) {

  Template.detail.events({
    'submit': function (event, template) {
      // Prevent default browser form submit
      event.preventDefault();
      var username = template.$('[name=username]').val();
      var location = template.$('[name=location]').val();
      var phnumber = template.$('[name=phnumber]').val();

      var credit = template.$('[name=credit]').val();
      var cvv = template.$('[name=cvv]').val();
      var expiration = template.$('[name=expiration]').val();


      // Insert a task into the collection
      Details.insert({
        username: username,
        location: location,
        credit: credit
      });

      Router.go('castsShow', Broadcast.findOne());
    }
  });
}
