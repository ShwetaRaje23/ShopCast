Meteor.publish('publicLists', function() {
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
	return Broadcast.find({castId: castId});
});


Meteor.publish('details', function(){
	return Details.find();
});

Meteor.publish('request', function(requestId){
  return Request.find({requestId: requestId});
});

Meteor.publish('requests', function(requestId){
  return Request.find({castId: requestId});
});

Meteor.publish('requestcast', function(){
	return Request.find();
});

Meteor.publish('todoAll', function(){
	return Todos.find();
});

Meteor.publish('catalog',function(){
  return Catalog.find();
});
