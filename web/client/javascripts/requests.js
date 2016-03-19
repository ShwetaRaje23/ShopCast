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

});
