(function(){Meteor.publish('publicLists', function() {
  return Lists.find({userId: {$exists: false}});
});

Meteor.publish('privateLists', function() {
  if (this.userId) {
    return Lists.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(castId) {
  check(castId, String);

  return Todos.find({castId: castId});
});

Meteor.publish('casts', function(castId){
	console.log(Broadcast.find(castId));
	return Broadcast.find({castId: castId});
});

Meteor.publish('request', function(requestId){
  console.log(Request.find(requestId));
  return Request.find({requestId: requestId});
});
}).call(this);

//# sourceMappingURL=publish.js.map
