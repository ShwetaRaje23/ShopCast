Template.casterFeed.helpers({
  broadcasts: function() {
    return Broadcast.find({userId : Meteor.user()['_id']});
  }
})
