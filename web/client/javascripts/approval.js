Template.approval.helpers({
  todos: function() {
    console.log("Here")
    return Request.find({castId: Router.current().params._id}, {sort: {createdAt : -1}});
  }
});
