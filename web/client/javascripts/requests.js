Template.request.events({

  'click .js-approve': function() {
    Request.update(
      {_id: this._id},
      {$set: {
      approved: true
    }});
  },

  'click .js-reject': function() {

    Request.remove(this._id);
  },

  'click .js-complete': function() {
    Request.update(
      {_id: this._id},
      {$set: {
      completed: true
    }});
  },

});

Template.request.helpers({
  approved: function() {
    return this.approved;
  }
});
