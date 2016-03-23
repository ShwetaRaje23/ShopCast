if (Meteor.isClient) {

  Template.detail.helpers({
    userEnter: function() {
      return Details.findOne({userId: Meteor.userId()});
    },
    userDetail: function() {
      return Details.findOne({userId: Meteor.userId()});
    }
  });

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
      var userId = Meteor.user()['_id'];

      var person = Details.findOne({userId: Meteor.userId()});
      // Insert a task into the collection

      if(username && location && phnumber && credit && cvv && expiration){
        console.log(username);
        Details.insert({
          userId : userId,
          username: username,
          location: location,
          phone: phnumber,
          credit : credit,
          cvv : cvv,
          expiration : expiration
        });
      }

      else {

      if(username){
        Details.update(
          {_id: person._id},
          {$set: {
          username: username
        }});
      }
      if(location){
        Details.update(
          {_id: person._id},
          {$set: {
          location: location
        }});
      }
      if(phnumber){
        Details.update(
          {_id: person._id},
          {$set: {
          phone: phnumber
        }});
      }
      if(credit){
        Details.update(
          {_id: person._id},
          {$set: {
          credit: credit
        }});
      }
      if(cvv){
        Details.update(
          {_id: person._id},
          {$set: {
          cvv: cvv
        }});
      }
      if(expiration){
        Details.update(
          {_id: person._id},
          {$set: {
          expiration: expiration
        }});
      }

    }
      Router.go('feed');
    }
  });
}
