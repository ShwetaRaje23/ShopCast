var EDITING_KEY = 'editingList';
Session.setDefault(EDITING_KEY, false);

Template.ask.onRendered(function() {

  var requesteremail = Meteor.user()['emails'][0]['address'];
  var requestername = requesteremail.substring(0, requesteremail.indexOf('@'));


  Request.insert({
    castId: '',
    userId: Meteor.userId(),
    username: requestername,
    createdAt: new Date(),
    approved: false,
    completed : false,
    received : false,
    bill : 0,
  });

  Session.set('currentrequestid', Request.findOne({username: requestername})._id); //Fix bug
});

Template.ask.helpers({
  editing: function() {
    return Session.get(EDITING_KEY);
  },

  todosReady: function() {
    return Router.current().todosHandle.ready();
    //return true;
  },

  todos: function(castId) {
    return Todos.find({$and: [{userId: Meteor.userId()},{castId: castId}]});
  },

  approved: function(castId) {
    var comp =  Request.findOne({$and: [{userId: Meteor.userId()},{castId: castId["_id"]}]});
    if(comp != null)
      return comp.approved;
  },

  received: function(castId) {
    var comp =  Request.findOne({$and: [{userId: Meteor.userId()},{castId: castId["_id"]}]});
    if(comp != null)
      return comp.received;
  }

});

var editList = function(list, template) {
  Session.set(EDITING_KEY, true);

  // force the template to redraw based on the reactive change
  Tracker.flush();
  template.$('.js-edit-form input[type=text]').focus();
};

var saveList = function(list, template) {
  Session.set(EDITING_KEY, false);
  Lists.update(list._id, {$set: {name: template.$('[name=name]').val()}});
}

var deleteList = function(list) {
  // ensure the last public list cannot be deleted.
  if (! list.userId && Lists.find({userId: {$exists: false}}).count() === 1) {
    return alert("Sorry, you cannot delete the final public list!");
  }

  var message = "Are you sure you want to delete the list " + list.name + "?";
  if (confirm(message)) {
    // we must remove each item individually from the client
    Todos.find({listId: list._id}).forEach(function(todo) {
      Todos.remove(todo._id);
    });
    Lists.remove(list._id);
    Router.go('listsShow', Lists.findOne());
    //Router.go('home');
    return true;
  } else {
    return false;
  }
};

var toggleListPrivacy = function(list) {
  if (! Meteor.user()) {
    return alert("Please sign in or create an account to make private lists.");
  }

  if (list.userId) {
    Lists.update(list._id, {$unset: {userId: true}});
  } else {
    // ensure the last public list cannot be made private
    if (Lists.find({userId: {$exists: false}}).count() === 1) {
      return alert("Sorry, you cannot make the final public list private!");
    }

    Lists.update(list._id, {$set: {userId: Meteor.userId()}});
  }
};

Template.ask.events({
  'click .js-cancel': function() {
    Session.set(EDITING_KEY, false);
  },

  'keydown input[type=text]': function(event) {
    // ESC
    if (27 === event.which) {
      event.preventDefault();
      $(event.target).blur();
    }
  },

  'blur input[type=text]': function(event, template) {
    // if we are still editing (we haven't just clicked the cancel button)
    if (Session.get(EDITING_KEY))
      saveList(this, template);
  },

  'submit .js-edit-form': function(event, template) {
    event.preventDefault();
    saveList(this, template);
  },

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-cancel, click .js-cancel': function(event) {
    event.preventDefault();
    Session.set(EDITING_KEY, false);
  },

  'change .list-edit': function(event, template) {
    if ($(event.target).val() === 'edit') {
      editList(this, template);
    } else if ($(event.target).val() === 'delete') {
      deleteList(this, template);
    } else {
      toggleListPrivacy(this, template);
    }

    event.target.selectedIndex = 0;
  },

  'click .js-edit-list': function(event, template) {
    editList(this, template);
  },

  'click .js-toggle-list-privacy': function(event, template) {
    toggleListPrivacy(this, template);
  },

  'click .js-delete-list': function(event, template) {
    deleteList(this, template);
  },

  'click .js-todo-add': function(event, template) {
    template.$('.js-todo-new input').focus();
  },

  'click .send-request': function(event){
    //alert('click!');
    Request.update(Session.get('currentrequestid'), {
      $set: {castId: this._id}
    });
    // Router.go('/feed')
  },

  'focus .class-itemprice':function(event){
      //alert('Hello there');
      console.log(Catalog.findOne({'location':this.place, 'itemname': $('#itemname').val()}));
      var itemprice = Catalog.findOne({'location':this.place, 'itemname': $('#itemname').val()}).itemprice * $('#itemquantity').val();
      $('#itemprice').val(itemprice);
  },

  'click .con-recieve': function(event){
    //alert('click!');
    Request.update(Session.get('currentrequestid'), {
      $set: {received: true}
    });
    // Router.go('/feed')
  },


  'submit .js-todo-new': function(event) {
    event.preventDefault();

    //alert('hey');
    // var pricecatalog = {'Starbucks':{'Coffee':2, 'Mocha':3},
    // 'Tindrum':{'Spicy Soba':6, 'Chowmein':7},'Publix':{'Milk':3, 'Eggs':4}};

    var itemname = $('#itemname').val();
    var itemquantity = $('#itemquantity').val();
    var itemprice = $('#itemprice').val();

    if(!itemname || !itemquantity || !itemprice){
      return;
    }

    var item = Catalog.findOne({'location': this.place, 'itemname': itemname});
    if(item != null){
      Catalog.update({'_id': item._id}, {$set: {'itemprice': itemprice/itemquantity} } );
    }
    else{
      Catalog.insert({'location':this.place, 'itemname':itemname, 'itemprice': itemprice/itemquantity});
    }

    var requesteremail = Meteor.user()['emails'][0]['address'];
    var requestername = requesteremail.substring(0, requesteremail.indexOf('@'));
    console.log(Session.get('currentrequestid'));
    Todos.insert({
      castId: this._id,
      requestId: Session.get('currentrequestid'),
      userId: Meteor.userId(),
      username: requestername,
      itemname: itemname,
      itemquantity: itemquantity,
      itemprice: itemprice,
      createdAt: new Date()
    });
    $('#itemname').val('');
    $('#itemquantity').val('');
    $('#itemprice').val('');
  }
});
