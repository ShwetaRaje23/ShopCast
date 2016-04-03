(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

/* Package-scope variables */
var JsonRoutes, RestMiddleware;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// packages/simple_json-routes/json-routes.js                                                    //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
/* global JsonRoutes:true */                                                                     // 1
                                                                                                 // 2
var Fiber = Npm.require('fibers');                                                               // 3
var connect = Npm.require('connect');                                                            // 4
var connectRoute = Npm.require('connect-route');                                                 // 5
                                                                                                 // 6
JsonRoutes = {};                                                                                 // 7
                                                                                                 // 8
WebApp.connectHandlers.use(connect.urlencoded({limit: '50mb'})); //Override default request size
WebApp.connectHandlers.use(connect.json({limit: '50mb'})); //Override default request size       // 10
WebApp.connectHandlers.use(connect.query());                                                     // 11
                                                                                                 // 12
// Handler for adding middleware before an endpoint (JsonRoutes.middleWare                       // 13
// is just for legacy reasons). Also serves as a namespace for middleware                        // 14
// packages to declare their middleware functions.                                               // 15
JsonRoutes.Middleware = JsonRoutes.middleWare = connect();                                       // 16
WebApp.connectHandlers.use(JsonRoutes.Middleware);                                               // 17
                                                                                                 // 18
// List of all defined JSON API endpoints                                                        // 19
JsonRoutes.routes = [];                                                                          // 20
                                                                                                 // 21
// Save reference to router for later                                                            // 22
var connectRouter;                                                                               // 23
                                                                                                 // 24
// Register as a middleware                                                                      // 25
WebApp.connectHandlers.use(connectRoute(function (router) {                                      // 26
  connectRouter = router;                                                                        // 27
}));                                                                                             // 28
                                                                                                 // 29
// Error middleware must be added last, to catch errors from prior middleware.                   // 30
// That's why we cache them and then add after startup.                                          // 31
var errorMiddlewares = [];                                                                       // 32
JsonRoutes.ErrorMiddleware = {                                                                   // 33
  use: function () {                                                                             // 34
    errorMiddlewares.push(arguments);                                                            // 35
  },                                                                                             // 36
};                                                                                               // 37
                                                                                                 // 38
Meteor.startup(function () {                                                                     // 39
  _.each(errorMiddlewares, function (errorMiddleware) {                                          // 40
    WebApp.connectHandlers.use.apply(WebApp.connectHandlers, errorMiddleware);                   // 41
  });                                                                                            // 42
                                                                                                 // 43
  errorMiddlewares = [];                                                                         // 44
});                                                                                              // 45
                                                                                                 // 46
JsonRoutes.add = function (method, path, handler) {                                              // 47
  // Make sure path starts with a slash                                                          // 48
  if (path[0] !== '/') {                                                                         // 49
    path = '/' + path;                                                                           // 50
  }                                                                                              // 51
                                                                                                 // 52
  // Add to list of known endpoints                                                              // 53
  JsonRoutes.routes.push({                                                                       // 54
    method: method,                                                                              // 55
    path: path,                                                                                  // 56
  });                                                                                            // 57
                                                                                                 // 58
  connectRouter[method.toLowerCase()](path, function (req, res, next) {                          // 59
    // Set headers on response                                                                   // 60
    setHeaders(res, responseHeaders);                                                            // 61
    Fiber(function () {                                                                          // 62
      try {                                                                                      // 63
        handler(req, res, next);                                                                 // 64
      } catch (error) {                                                                          // 65
        next(error);                                                                             // 66
      }                                                                                          // 67
    }).run();                                                                                    // 68
  });                                                                                            // 69
};                                                                                               // 70
                                                                                                 // 71
var responseHeaders = {                                                                          // 72
  'Cache-Control': 'no-store',                                                                   // 73
  Pragma: 'no-cache',                                                                            // 74
};                                                                                               // 75
                                                                                                 // 76
JsonRoutes.setResponseHeaders = function (headers) {                                             // 77
  responseHeaders = headers;                                                                     // 78
};                                                                                               // 79
                                                                                                 // 80
/**                                                                                              // 81
 * Sets the response headers, status code, and body, and ends it.                                // 82
 * The JSON response will be pretty printed if NODE_ENV is `development`.                        // 83
 *                                                                                               // 84
 * @param {Object} res Response object                                                           // 85
 * @param {Object} [options]                                                                     // 86
 * @param {Number} [options.code] HTTP status code. Default is 200.                              // 87
 * @param {Object} [options.headers] Dictionary of headers.                                      // 88
 * @param {Object|Array|null|undefined} [options.data] The object to                             // 89
 *   stringify as the response. If `null`, the response will be "null".                          // 90
 *   If `undefined`, there will be no response body.                                             // 91
 */                                                                                              // 92
JsonRoutes.sendResult = function (res, options) {                                                // 93
  options = options || {};                                                                       // 94
                                                                                                 // 95
  // We've already set global headers on response, but if they                                   // 96
  // pass in more here, we set those.                                                            // 97
  if (options.headers) setHeaders(res, options.headers);                                         // 98
                                                                                                 // 99
  // Set status code on response                                                                 // 100
  res.statusCode = options.code || 200;                                                          // 101
                                                                                                 // 102
  // Set response body                                                                           // 103
  writeJsonToBody(res, options.data);                                                            // 104
                                                                                                 // 105
  // Send the response                                                                           // 106
  res.end();                                                                                     // 107
};                                                                                               // 108
                                                                                                 // 109
function setHeaders(res, headers) {                                                              // 110
  _.each(headers, function (value, key) {                                                        // 111
    res.setHeader(key, value);                                                                   // 112
  });                                                                                            // 113
}                                                                                                // 114
                                                                                                 // 115
function writeJsonToBody(res, json) {                                                            // 116
  if (json !== undefined) {                                                                      // 117
    var shouldPrettyPrint = (process.env.NODE_ENV === 'development');                            // 118
    var spacer = shouldPrettyPrint ? 2 : null;                                                   // 119
    res.setHeader('Content-type', 'application/json');                                           // 120
    res.write(JSON.stringify(json, null, spacer));                                               // 121
  }                                                                                              // 122
}                                                                                                // 123
                                                                                                 // 124
///////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// packages/simple_json-routes/middleware.js                                                     //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
/* global RestMiddleware:true */                                                                 // 1
                                                                                                 // 2
RestMiddleware = {};                                                                             // 3
                                                                                                 // 4
///////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['simple:json-routes'] = {
  JsonRoutes: JsonRoutes,
  RestMiddleware: RestMiddleware
};

})();

//# sourceMappingURL=simple_json-routes.js.map
