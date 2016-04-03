(function () {

/* Imports */
var check = Package.check.check;
var Match = Package.check.Match;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var EJSON = Package.ejson.EJSON;
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

/* Package-scope variables */
var HttpConnection, HttpSubscription, SimpleRest, paths, pathInfo;

(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/simple_rest/http-connection.js                                      //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
// Simulate a DDP connection from HTTP request                                  // 1
HttpConnection = function () {                                                  // 2
  // no-op now                                                                  // 3
};                                                                              // 4
                                                                                // 5
//////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/simple_rest/http-subscription.js                                    //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
var EventEmitter = Npm.require('events').EventEmitter;                          // 1
                                                                                // 2
// This file describes something like Subscription in                           // 3
// meteor/meteor/packages/ddp/livedata_server.js, but instead of sending        // 4
// over a socket it puts together an HTTP response                              // 5
HttpSubscription = function (options) {                                         // 6
  // Object where the keys are collection names, and then the keys are _ids     // 7
  this.responseData = {};                                                       // 8
                                                                                // 9
  this.connection = new HttpConnection(options.request);                        // 10
  this.userId = options.userId;                                                 // 11
};                                                                              // 12
                                                                                // 13
// So that we can listen to ready event in a reasonable way                     // 14
Meteor._inherits(HttpSubscription, EventEmitter);                               // 15
                                                                                // 16
_.extend(HttpSubscription.prototype, {                                          // 17
  added: function (collection, id, fields) {                                    // 18
    var self = this;                                                            // 19
                                                                                // 20
    check(collection, String);                                                  // 21
    if (id instanceof Mongo.Collection.ObjectID) id = id + '';                  // 22
    check(id, String);                                                          // 23
                                                                                // 24
    self._ensureCollectionInRes(collection);                                    // 25
                                                                                // 26
    // Make sure to ignore the _id in fields                                    // 27
    var addedDocument = _.extend({_id: id}, _.omit(fields, '_id'));             // 28
    self.responseData[collection][id] = addedDocument;                          // 29
  },                                                                            // 30
                                                                                // 31
  changed: function (collection, id, fields) {                                  // 32
    var self = this;                                                            // 33
                                                                                // 34
    check(collection, String);                                                  // 35
    if (id instanceof Mongo.Collection.ObjectID) id = id + '';                  // 36
    check(id, String);                                                          // 37
                                                                                // 38
    self._ensureCollectionInRes(collection);                                    // 39
                                                                                // 40
    var existingDocument = this.responseData[collection][id];                   // 41
    var fieldsNoId = _.omit(fields, '_id');                                     // 42
    _.extend(existingDocument, fieldsNoId);                                     // 43
                                                                                // 44
    // Delete all keys that were undefined in fields (except _id)               // 45
    _.each(fields, function (value, key) {                                      // 46
      if (value === undefined) {                                                // 47
        delete existingDocument[key];                                           // 48
      }                                                                         // 49
    });                                                                         // 50
  },                                                                            // 51
                                                                                // 52
  removed: function (collection, id) {                                          // 53
    var self = this;                                                            // 54
                                                                                // 55
    check(collection, String);                                                  // 56
    if (id instanceof Mongo.Collection.ObjectID) id = id + '';                  // 57
    check(id, String);                                                          // 58
                                                                                // 59
    self._ensureCollectionInRes(collection);                                    // 60
                                                                                // 61
    delete self.responseData[collection][id];                                   // 62
                                                                                // 63
    if (_.isEmpty(self.responseData[collection])) {                             // 64
      delete self.responseData[collection];                                     // 65
    }                                                                           // 66
  },                                                                            // 67
                                                                                // 68
  ready: function () {                                                          // 69
    this.emit('ready', this._generateResponse());                               // 70
  },                                                                            // 71
                                                                                // 72
  onStop: function () {                                                         // 73
    // no-op in HTTP                                                            // 74
  },                                                                            // 75
                                                                                // 76
  error: function (error) {                                                     // 77
    throw error;                                                                // 78
  },                                                                            // 79
                                                                                // 80
  _ensureCollectionInRes: function (collection) {                               // 81
    this.responseData[collection] = this.responseData[collection] || {};        // 82
  },                                                                            // 83
                                                                                // 84
  _generateResponse: function () {                                              // 85
    var output = {};                                                            // 86
                                                                                // 87
    _.each(this.responseData, function (documents, collectionName) {            // 88
      output[collectionName] = _.values(documents);                             // 89
    });                                                                         // 90
                                                                                // 91
    return output;                                                              // 92
  },                                                                            // 93
});                                                                             // 94
                                                                                // 95
//////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/simple_rest/rest.js                                                 //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
SimpleRest = {};                                                                // 1
                                                                                // 2
// Can be used to limit which collections get endpoints:                        // 3
// {                                                                            // 4
//   collections: ['widgets', 'doodles']                                        // 5
// }                                                                            // 6
// By default all do. Use empty array for none.                                 // 7
//                                                                              // 8
// Also:                                                                        // 9
//    objectIdCollections: ['widgets', 'doodles']                               // 10
SimpleRest._config = {};                                                        // 11
SimpleRest.configure = function (config) {                                      // 12
  return _.extend(SimpleRest._config, config);                                  // 13
};                                                                              // 14
                                                                                // 15
SimpleRest._methodOptions = {};                                                 // 16
                                                                                // 17
// Set options for a particular DDP method that will later be defined           // 18
SimpleRest.setMethodOptions = function (name, options) {                        // 19
  check(name, String);                                                          // 20
                                                                                // 21
  // Throw an error if the Method is already defined - too late to pass         // 22
  // options                                                                    // 23
  if (_.has(Meteor.server.method_handlers, name)) {                             // 24
    throw new Error('Must pass options before Method is defined: '              // 25
      + name);                                                                  // 26
  }                                                                             // 27
                                                                                // 28
  options = options || {};                                                      // 29
                                                                                // 30
  _.defaults(options, {                                                         // 31
    url: 'methods/' + name,                                                     // 32
    getArgsFromRequest: defaultGetArgsFromRequest,                              // 33
    httpMethod: 'post',                                                         // 34
  });                                                                           // 35
                                                                                // 36
  SimpleRest._methodOptions[name] = options;                                    // 37
};                                                                              // 38
                                                                                // 39
var oldPublish = Meteor.publish;                                                // 40
Meteor.publish = function (name, handler, options) {                            // 41
  options = options || {};                                                      // 42
                                                                                // 43
  var httpOptionKeys = [                                                        // 44
    'url',                                                                      // 45
    'getArgsFromRequest',                                                       // 46
    'httpMethod',                                                               // 47
  ];                                                                            // 48
                                                                                // 49
  var httpOptions = _.pick(options, httpOptionKeys);                            // 50
  var ddpOptions = _.omit(options, httpOptionKeys);                             // 51
                                                                                // 52
  // Register DDP publication                                                   // 53
  oldPublish(name, handler, ddpOptions);                                        // 54
                                                                                // 55
  _.defaults(httpOptions, {                                                     // 56
    url: 'publications/' + name,                                                // 57
    getArgsFromRequest: defaultGetArgsFromRequest,                              // 58
    httpMethod: 'get',                                                          // 59
  });                                                                           // 60
                                                                                // 61
  JsonRoutes.add(httpOptions.httpMethod, httpOptions.url, function (req, res) {
    var userId = req.userId || null;                                            // 63
                                                                                // 64
    var httpSubscription = new HttpSubscription({                               // 65
      request: req,                                                             // 66
      userId: userId,                                                           // 67
    });                                                                         // 68
                                                                                // 69
    httpSubscription.on('ready', function (response) {                          // 70
      JsonRoutes.sendResult(res, {data: response});                             // 71
    });                                                                         // 72
                                                                                // 73
    var handlerArgs = httpOptions.getArgsFromRequest(req);                      // 74
                                                                                // 75
    var handlerReturn = handler.apply(httpSubscription, handlerArgs);           // 76
                                                                                // 77
    // Fast track for publishing cursors - we don't even need livequery here,   // 78
    // just making a normal DB query                                            // 79
    if (handlerReturn && handlerReturn._publishCursor) {                        // 80
      httpPublishCursor(handlerReturn, httpSubscription);                       // 81
      httpSubscription.ready();                                                 // 82
    } else if (handlerReturn && _.isArray(handlerReturn)) {                     // 83
      // We don't need to run the checks to see if                              // 84
      // the cursors overlap and stuff                                          // 85
      // because calling Meteor.publish will do that for us :]                  // 86
      _.each(handlerReturn, function (cursor) {                                 // 87
        httpPublishCursor(cursor, httpSubscription);                            // 88
      });                                                                       // 89
                                                                                // 90
      httpSubscription.ready();                                                 // 91
    }                                                                           // 92
  });                                                                           // 93
};                                                                              // 94
                                                                                // 95
var oldMethods = Object.getPrototypeOf(Meteor.server).methods;                  // 96
Meteor.method = function (name, handler, options) {                             // 97
  if (!SimpleRest._methodOptions[name]) {                                       // 98
    SimpleRest.setMethodOptions(name, options);                                 // 99
  } else if (options) {                                                         // 100
    throw Error('Options already passed via setMethodOptions.');                // 101
  }                                                                             // 102
                                                                                // 103
  var methodMap = {};                                                           // 104
  methodMap[name] = handler;                                                    // 105
  oldMethods.call(Meteor.server, methodMap);                                    // 106
                                                                                // 107
  // This is a default collection mutation method, do some special things to    // 108
  // make it more RESTful                                                       // 109
  if (insideDefineMutationMethods) {                                            // 110
    var collectionName = name.split('/')[1];                                    // 111
                                                                                // 112
    if (_.isArray(SimpleRest._config.collections) &&                            // 113
       !_.contains(SimpleRest._config.collections, collectionName)) return;     // 114
                                                                                // 115
    var isObjectId = false;                                                     // 116
    if (_.isArray(SimpleRest._config.objectIdCollections) &&                    // 117
       _.contains(SimpleRest._config.objectIdCollections, collectionName)) {    // 118
      isObjectId = true;                                                        // 119
    }                                                                           // 120
                                                                                // 121
    var modifier = name.split('/')[2];                                          // 122
                                                                                // 123
    var collectionUrl = '/' + collectionName;                                   // 124
    var itemUrl = '/' + collectionName + '/:_id';                               // 125
                                                                                // 126
    if (modifier === 'insert') {                                                // 127
      // Post the entire new document                                           // 128
      addHTTPMethod(name, handler, {                                            // 129
        httpMethod: 'post',                                                     // 130
        url: collectionUrl,                                                     // 131
      });                                                                       // 132
    } else if (modifier === 'update') {                                         // 133
      // PATCH means you submit an incomplete document, to update the fields    // 134
      // you have passed                                                        // 135
      addHTTPMethod(name, handler, {                                            // 136
        url: itemUrl,                                                           // 137
        httpMethod: 'patch',                                                    // 138
        getArgsFromRequest: function (req) {                                    // 139
          var id = req.params._id;                                              // 140
          if (isObjectId) id = new Mongo.ObjectID(id);                          // 141
          return [{ _id: id }, { $set: req.body }];                             // 142
        },                                                                      // 143
      });                                                                       // 144
                                                                                // 145
      // We don't have PUT because allow/deny doesn't let you replace documents
      // you can define it manually if you want                                 // 147
    } else if (modifier === 'remove') {                                         // 148
      // Can only remove a single document by the _id                           // 149
      addHTTPMethod(name, handler, {                                            // 150
        url: itemUrl,                                                           // 151
        httpMethod: 'delete',                                                   // 152
        getArgsFromRequest: function (req) {                                    // 153
          var id = req.params._id;                                              // 154
          if (isObjectId) id = new Mongo.ObjectID(id);                          // 155
          return [{ _id: id }];                                                 // 156
        },                                                                      // 157
      });                                                                       // 158
    }                                                                           // 159
                                                                                // 160
    return;                                                                     // 161
  }                                                                             // 162
                                                                                // 163
  addHTTPMethod(name, handler, options);                                        // 164
};                                                                              // 165
                                                                                // 166
// Monkey patch _defineMutationMethods so that we can treat them specially      // 167
// inside Meteor.method                                                         // 168
var insideDefineMutationMethods = false;                                        // 169
var oldDMM = Mongo.Collection.prototype._defineMutationMethods;                 // 170
Mongo.Collection.prototype._defineMutationMethods = function () {               // 171
  insideDefineMutationMethods = true;                                           // 172
  oldDMM.apply(this, arguments);                                                // 173
  insideDefineMutationMethods = false;                                          // 174
};                                                                              // 175
                                                                                // 176
Meteor.methods = Object.getPrototypeOf(Meteor.server).methods =                 // 177
  function (methodMap) {                                                        // 178
    _.each(methodMap, function (handler, name) {                                // 179
      Meteor.method(name, handler);                                             // 180
    });                                                                         // 181
  };                                                                            // 182
                                                                                // 183
function addHTTPMethod(methodName, handler, options) {                          // 184
  options = options || SimpleRest._methodOptions[methodName] || {};             // 185
                                                                                // 186
  options = _.defaults(options, {                                               // 187
    getArgsFromRequest: defaultGetArgsFromRequest,                              // 188
  });                                                                           // 189
                                                                                // 190
  JsonRoutes.add('options', options.url, function (req, res) {                  // 191
    JsonRoutes.sendResult(res);                                                 // 192
  });                                                                           // 193
                                                                                // 194
  JsonRoutes.add(options.httpMethod, options.url, function (req, res) {         // 195
    var userId = req.userId || null;                                            // 196
    var statusCode = 200;                                                       // 197
                                                                                // 198
    // XXX replace with a real one?                                             // 199
    var methodInvocation = {                                                    // 200
      userId: userId,                                                           // 201
      setUserId: function () {                                                  // 202
        throw Error('setUserId not implemented in this ' +                      // 203
                      'version of simple:rest');                                // 204
      },                                                                        // 205
                                                                                // 206
      isSimulation: false,                                                      // 207
      unblock: function () {                                                    // 208
        // no-op                                                                // 209
      },                                                                        // 210
                                                                                // 211
      setHttpStatusCode: function (code) {                                      // 212
        statusCode = code;                                                      // 213
      },                                                                        // 214
    };                                                                          // 215
                                                                                // 216
    var handlerArgs = options.getArgsFromRequest(req);                          // 217
    var handlerReturn = handler.apply(methodInvocation, handlerArgs);           // 218
    JsonRoutes.sendResult(res, {                                                // 219
      code: statusCode,                                                         // 220
      data: handlerReturn,                                                      // 221
    });                                                                         // 222
  });                                                                           // 223
}                                                                               // 224
                                                                                // 225
function httpPublishCursor(cursor, subscription) {                              // 226
  _.each(cursor.fetch(), function (document) {                                  // 227
    subscription.added(cursor._cursorDescription.collectionName,                // 228
      document._id, document);                                                  // 229
  });                                                                           // 230
}                                                                               // 231
                                                                                // 232
function defaultGetArgsFromRequest(req) {                                       // 233
  var args = [];                                                                // 234
  if (req.method === 'POST') {                                                  // 235
    // by default, the request body is an array which is the arguments          // 236
    args = EJSON.fromJSONValue(req.body);                                       // 237
                                                                                // 238
    // If it's an object, pass the entire object as the only argument           // 239
    if (!_.isArray(args)) {                                                     // 240
      args = [args];                                                            // 241
    }                                                                           // 242
  }                                                                             // 243
                                                                                // 244
  _.each(req.params, function (value, name) {                                   // 245
    var parsed = parseInt(name, 10);                                            // 246
                                                                                // 247
    if (_.isNaN(parsed)) {                                                      // 248
      throw new Error('REST publish doesn\'t support parameters ' +             // 249
                      'whose names aren\'t integers.');                         // 250
    }                                                                           // 251
                                                                                // 252
    args[parsed] = value;                                                       // 253
  });                                                                           // 254
                                                                                // 255
  return args;                                                                  // 256
}                                                                               // 257
                                                                                // 258
//////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/simple_rest/list-api.js                                             //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
/* global JsonRoutes:false - from simple:json-routes package */                 // 1
/* global paths:true */                                                         // 2
/* global pathInfo:true */                                                      // 3
                                                                                // 4
// publish all API methods                                                      // 5
Meteor.publish('api-routes', function () {                                      // 6
  var self = this;                                                              // 7
                                                                                // 8
  // Deduplicate routes across paths                                            // 9
  paths = {};                                                                   // 10
                                                                                // 11
  _.each(JsonRoutes.routes, function (route) {                                  // 12
    pathInfo = paths[route.path] || { methods: [], path: route.path };          // 13
                                                                                // 14
    pathInfo.methods.push(route.method);                                        // 15
                                                                                // 16
    paths[route.path] = pathInfo;                                               // 17
  });                                                                           // 18
                                                                                // 19
  _.each(paths, function (pathInfo, path) {                                     // 20
    self.added('api-routes', path, pathInfo);                                   // 21
  });                                                                           // 22
                                                                                // 23
  self.ready();                                                                 // 24
});                                                                             // 25
                                                                                // 26
//////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['simple:rest'] = {
  SimpleRest: SimpleRest
};

})();

//# sourceMappingURL=simple_rest.js.map
