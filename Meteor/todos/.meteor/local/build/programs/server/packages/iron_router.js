(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var Utils, hasOld, Route, paramParts, RouteController, IronRouter, Router;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/iron_router/packages/iron_router.js                                                             //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
(function () {                                                                                              // 1
                                                                                                            // 2
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                                   //     // 4
// packages/iron:router/lib/utils.js                                                                 //     // 5
//                                                                                                   //     // 6
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                                     //     // 8
/**                                                                                                  // 1   // 9
 * Utility methods available privately to the package.                                               // 2   // 10
 */                                                                                                  // 3   // 11
                                                                                                     // 4   // 12
Utils = {};                                                                                          // 5   // 13
                                                                                                     // 6   // 14
/**                                                                                                  // 7   // 15
 * global object on node or window object in the browser.                                            // 8   // 16
 */                                                                                                  // 9   // 17
                                                                                                     // 10  // 18
Utils.global = (function () { return this; })();                                                     // 11  // 19
                                                                                                     // 12  // 20
/**                                                                                                  // 13  // 21
 * Assert that the given condition is truthy.                                                        // 14  // 22
 *                                                                                                   // 15  // 23
 * @param {Boolean} condition The boolean condition to test for truthiness.                          // 16  // 24
 * @param {String} msg The error message to show if the condition is falsy.                          // 17  // 25
 */                                                                                                  // 18  // 26
                                                                                                     // 19  // 27
Utils.assert = function (condition, msg) {                                                           // 20  // 28
  if (!condition)                                                                                    // 21  // 29
    throw new Error(msg);                                                                            // 22  // 30
};                                                                                                   // 23  // 31
                                                                                                     // 24  // 32
var warn = function (msg) {                                                                          // 25  // 33
  if (!Router || Router.options.supressWarnings !== true) {                                          // 26  // 34
    console && console.warn && console.warn(msg);                                                    // 27  // 35
  }                                                                                                  // 28  // 36
};                                                                                                   // 29  // 37
                                                                                                     // 30  // 38
Utils.warn = function (condition, msg) {                                                             // 31  // 39
  if (!condition)                                                                                    // 32  // 40
    warn(msg);                                                                                       // 33  // 41
};                                                                                                   // 34  // 42
                                                                                                     // 35  // 43
/**                                                                                                  // 36  // 44
 * deprecatation notice to the user which can be a string or object                                  // 37  // 45
 * of the form:                                                                                      // 38  // 46
 *                                                                                                   // 39  // 47
 * {                                                                                                 // 40  // 48
 *  name: 'somePropertyOrMethod',                                                                    // 41  // 49
 *  where: 'RouteController',                                                                        // 42  // 50
 *  instead: 'someOtherPropertyOrMethod',                                                            // 43  // 51
 *  message: ':name is deprecated. Please use :instead instead'                                      // 44  // 52
 * }                                                                                                 // 45  // 53
 */                                                                                                  // 46  // 54
Utils.notifyDeprecated = function (info) {                                                           // 47  // 55
  var name;                                                                                          // 48  // 56
  var instead;                                                                                       // 49  // 57
  var message;                                                                                       // 50  // 58
  var where;                                                                                         // 51  // 59
  var defaultMessage = "[:where] ':name' is deprecated. Please use ':instead' instead.";             // 52  // 60
                                                                                                     // 53  // 61
  if (_.isObject(info)) {                                                                            // 54  // 62
    name = info.name;                                                                                // 55  // 63
    instead = info.instead;                                                                          // 56  // 64
    message = info.message || defaultMessage;                                                        // 57  // 65
    where = info.where || 'IronRouter';                                                              // 58  // 66
  } else {                                                                                           // 59  // 67
    message = info;                                                                                  // 60  // 68
    name = '';                                                                                       // 61  // 69
    instead = '';                                                                                    // 62  // 70
    where = '';                                                                                      // 63  // 71
  }                                                                                                  // 64  // 72
                                                                                                     // 65  // 73
  warn(                                                                                              // 66  // 74
      '<deprecated> ' +                                                                              // 67  // 75
      message                                                                                        // 68  // 76
      .replace(':name', name)                                                                        // 69  // 77
      .replace(':instead', instead)                                                                  // 70  // 78
      .replace(':where', where) +                                                                    // 71  // 79
      ' ' +                                                                                          // 72  // 80
      (new Error).stack                                                                              // 73  // 81
  );                                                                                                 // 74  // 82
};                                                                                                   // 75  // 83
                                                                                                     // 76  // 84
Utils.withDeprecatedNotice = function (info, fn, thisArg) {                                          // 77  // 85
  return function () {                                                                               // 78  // 86
    Utils.notifyDeprecated(info);                                                                    // 79  // 87
    return fn && fn.apply(thisArg || this, arguments);                                               // 80  // 88
  };                                                                                                 // 81  // 89
};                                                                                                   // 82  // 90
                                                                                                     // 83  // 91
/**                                                                                                  // 84  // 92
 * Given the name of a property, resolves to the value. Works with namespacing                       // 85  // 93
 * too. If first parameter is already a value that isn't a string it's returned                      // 86  // 94
 * immediately.                                                                                      // 87  // 95
 *                                                                                                   // 88  // 96
 * Examples:                                                                                         // 89  // 97
 *  'SomeClass' => window.SomeClass || global.someClass                                              // 90  // 98
 *  'App.namespace.SomeClass' => window.App.namespace.SomeClass                                      // 91  // 99
 *                                                                                                   // 92  // 100
 * @param {String|Object} nameOrValue                                                                // 93  // 101
 */                                                                                                  // 94  // 102
                                                                                                     // 95  // 103
Utils.resolveValue = function (nameOrValue) {                                                        // 96  // 104
  var global = Utils.global;                                                                         // 97  // 105
  var parts;                                                                                         // 98  // 106
  var ptr;                                                                                           // 99  // 107
                                                                                                     // 100
  if (_.isString(nameOrValue)) {                                                                     // 101
    parts = nameOrValue.split('.')                                                                   // 102
    ptr = global;                                                                                    // 103
    for (var i = 0; i < parts.length; i++) {                                                         // 104
      ptr = ptr[parts[i]];                                                                           // 105
      if (!ptr)                                                                                      // 106
        return undefined;                                                                            // 107
    }                                                                                                // 108
  } else {                                                                                           // 109
    ptr = nameOrValue;                                                                               // 110
  }                                                                                                  // 111
                                                                                                     // 112
  // final position of ptr should be the resolved value                                              // 113
  return ptr;                                                                                        // 114
};                                                                                                   // 115
                                                                                                     // 116
Utils.hasOwnProperty = function (obj, key) {                                                         // 117
  var prop = {}.hasOwnProperty;                                                                      // 118
  return prop.call(obj, key);                                                                        // 119
};                                                                                                   // 120
                                                                                                     // 121
/**                                                                                                  // 122
 * Don't mess with this function. It's exactly the same as the compiled                              // 123
 * coffeescript mechanism. If you change it we can't guarantee that our code                         // 124
 * will work when used with Coffeescript. One exception is putting in a runtime                      // 125
 * check that both child and parent are of type Function.                                            // 126
 */                                                                                                  // 127
                                                                                                     // 128
Utils.inherits = function (child, parent) {                                                          // 129
  if (Utils.typeOf(child) !== '[object Function]')                                                   // 130
    throw new Error('First parameter to Utils.inherits must be a function');                         // 131
                                                                                                     // 132
  if (Utils.typeOf(parent) !== '[object Function]')                                                  // 133
    throw new Error('Second parameter to Utils.inherits must be a function');                        // 134
                                                                                                     // 135
  for (var key in parent) {                                                                          // 136
    if (Utils.hasOwnProperty(parent, key))                                                           // 137
      child[key] = parent[key];                                                                      // 138
  }                                                                                                  // 139
                                                                                                     // 140
  function ctor () {                                                                                 // 141
    this.constructor = child;                                                                        // 142
  }                                                                                                  // 143
                                                                                                     // 144
  ctor.prototype = parent.prototype;                                                                 // 145
  child.prototype = new ctor();                                                                      // 146
  child.__super__ = parent.prototype;                                                                // 147
  return child;                                                                                      // 148
};                                                                                                   // 149
                                                                                                     // 150
Utils.toArray = function (obj) {                                                                     // 151
  if (!obj)                                                                                          // 152
    return [];                                                                                       // 153
  else if (Utils.typeOf(obj) !== '[object Array]')                                                   // 154
    return [obj];                                                                                    // 155
  else                                                                                               // 156
    return obj;                                                                                      // 157
};                                                                                                   // 158
                                                                                                     // 159
Utils.typeOf = function (obj) {                                                                      // 160
  if (obj && obj.typeName)                                                                           // 161
    return obj.typeName;                                                                             // 162
  else                                                                                               // 163
    return Object.prototype.toString.call(obj);                                                      // 164
};                                                                                                   // 165
                                                                                                     // 166
Utils.extend = function (Super, definition, onBeforeExtendPrototype) {                               // 167
  if (arguments.length === 1)                                                                        // 168
    definition = Super;                                                                              // 169
  else {                                                                                             // 170
    definition = definition || {};                                                                   // 171
    definition.extend = Super;                                                                       // 172
  }                                                                                                  // 173
                                                                                                     // 174
  return Utils.create(definition, {                                                                  // 175
    onBeforeExtendPrototype: onBeforeExtendPrototype                                                 // 176
  });                                                                                                // 177
};                                                                                                   // 178
                                                                                                     // 179
Utils.create = function (definition, options) {                                                      // 180
  var Constructor                                                                                    // 181
    , extendFrom                                                                                     // 182
    , savedPrototype;                                                                                // 183
                                                                                                     // 184
  options = options || {};                                                                           // 185
  definition = definition || {};                                                                     // 186
                                                                                                     // 187
  if (Utils.hasOwnProperty(definition, 'constructor'))                                               // 188
    Constructor = definition.constructor;                                                            // 189
  else {                                                                                             // 190
    Constructor = function () {                                                                      // 191
      if (Constructor.__super__ && Constructor.__super__.constructor)                                // 192
        return Constructor.__super__.constructor.apply(this, arguments);                             // 193
    }                                                                                                // 194
  }                                                                                                  // 195
                                                                                                     // 196
  extendFrom = definition.extend;                                                                    // 197
                                                                                                     // 198
  if (definition.extend) delete definition.extend;                                                   // 199
                                                                                                     // 200
  var inherit = function (Child, Super, prototype) {                                                 // 201
    Utils.inherits(Child, Utils.resolveValue(Super));                                                // 202
    if (prototype) _.extend(Child.prototype, prototype);                                             // 203
  };                                                                                                 // 204
                                                                                                     // 205
  if (extendFrom) {                                                                                  // 206
    inherit(Constructor, extendFrom);                                                                // 207
  }                                                                                                  // 208
                                                                                                     // 209
  if (options.onBeforeExtendPrototype)                                                               // 210
    options.onBeforeExtendPrototype.call(Constructor, definition);                                   // 211
                                                                                                     // 212
  _.extend(Constructor.prototype, definition);                                                       // 213
                                                                                                     // 214
  return Constructor;                                                                                // 215
};                                                                                                   // 216
                                                                                                     // 217
Utils.capitalize = function (str) {                                                                  // 218
  return str.charAt(0).toUpperCase() + str.slice(1, str.length);                                     // 219
};                                                                                                   // 220
                                                                                                     // 221
Utils.upperCamelCase = function (str) {                                                              // 222
  var re = /_|-|\./;                                                                                 // 223
                                                                                                     // 224
  if (!str)                                                                                          // 225
    return '';                                                                                       // 226
                                                                                                     // 227
  return _.map(str.split(re), function (word) {                                                      // 228
    return Utils.capitalize(word);                                                                   // 229
  }).join('');                                                                                       // 230
};                                                                                                   // 231
                                                                                                     // 232
Utils.camelCase = function (str) {                                                                   // 233
  var output = Utils.upperCamelCase(str);                                                            // 234
  output = output.charAt(0).toLowerCase() + output.slice(1, output.length);                          // 235
  return output;                                                                                     // 236
};                                                                                                   // 237
                                                                                                     // 238
Utils.pick = function (/* args */) {                                                                 // 239
  var args = _.toArray(arguments)                                                                    // 240
    , arg;                                                                                           // 241
  for (var i = 0; i < args.length; i++) {                                                            // 242
    arg = args[i];                                                                                   // 243
    if (typeof arg !== 'undefined' && arg !== null)                                                  // 244
      return arg;                                                                                    // 245
  }                                                                                                  // 246
                                                                                                     // 247
  return null;                                                                                       // 248
};                                                                                                   // 249
                                                                                                     // 250
Utils.StringConverters = {                                                                           // 251
  'none': function(input) {                                                                          // 252
    return input;                                                                                    // 253
  },                                                                                                 // 254
                                                                                                     // 255
  'upperCamelCase': function (input) {                                                               // 256
    return Utils.upperCamelCase(input);                                                              // 257
  },                                                                                                 // 258
                                                                                                     // 259
  'camelCase': function (input) {                                                                    // 260
    return Utils.camelCase(input);                                                                   // 261
  }                                                                                                  // 262
};                                                                                                   // 263
                                                                                                     // 264
Utils.rewriteLegacyHooks = function (obj) {                                                          // 265
  var legacyToNew = IronRouter.LEGACY_HOOK_TYPES;                                                    // 266
                                                                                                     // 267
  _.each(legacyToNew, function (newHook, oldHook) {                                                  // 268
    // only look on the immediate object, not its                                                    // 269
    // proto chain                                                                                   // 270
    if (_.has(obj, oldHook)) {                                                                       // 271
      hasOld = true;                                                                                 // 272
      obj[newHook] = obj[oldHook];                                                                   // 273
                                                                                                     // 274
      Utils.notifyDeprecated({                                                                       // 275
        where: 'RouteController',                                                                    // 276
        name: oldHook,                                                                               // 277
        instead: newHook                                                                             // 278
      });                                                                                            // 279
    }                                                                                                // 280
  });                                                                                                // 281
};                                                                                                   // 282
                                                                                                     // 283
                                                                                                     // 284
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 293
                                                                                                            // 294
}).call(this);                                                                                              // 295
                                                                                                            // 296
                                                                                                            // 297
                                                                                                            // 298
                                                                                                            // 299
                                                                                                            // 300
                                                                                                            // 301
(function () {                                                                                              // 302
                                                                                                            // 303
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 304
//                                                                                                   //     // 305
// packages/iron:router/lib/route.js                                                                 //     // 306
//                                                                                                   //     // 307
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 308
                                                                                                     //     // 309
/*                                                                                                   // 1   // 310
 * Inspiration and some code for the compilation of routes comes from pagejs.                        // 2   // 311
 * The original has been modified to better handle hash fragments, and to store                      // 3   // 312
 * the regular expression on the Route instance. Also, the resolve method has                        // 4   // 313
 * been added to return a resolved path given a parameters object.                                   // 5   // 314
 */                                                                                                  // 6   // 315
                                                                                                     // 7   // 316
Route = function (router, name, options) {                                                           // 8   // 317
  var path;                                                                                          // 9   // 318
                                                                                                     // 10  // 319
  Utils.assert(                                                                                      // 11  // 320
    router instanceof IronRouter,                                                                    // 12  // 321
    "Route constructor first parameter must be a Router");                                           // 13  // 322
                                                                                                     // 14  // 323
  Utils.assert(                                                                                      // 15  // 324
    _.isString(name),                                                                                // 16  // 325
    "Route constructor second parameter must be a String name");                                     // 17  // 326
                                                                                                     // 18  // 327
  if (_.isFunction(options))                                                                         // 19  // 328
    options = { handler: options };                                                                  // 20  // 329
                                                                                                     // 21  // 330
  options = this.options = options || {};                                                            // 22  // 331
  path = options.path || ('/' + name);                                                               // 23  // 332
                                                                                                     // 24  // 333
  this.router = router;                                                                              // 25  // 334
  this.originalPath = path;                                                                          // 26  // 335
                                                                                                     // 27  // 336
  if (_.isString(this.originalPath) && this.originalPath.charAt(0) !== '/')                          // 28  // 337
    this.originalPath = '/' + this.originalPath;                                                     // 29  // 338
                                                                                                     // 30  // 339
  this.name = name;                                                                                  // 31  // 340
  this.where = options.where || 'client';                                                            // 32  // 341
  this.controller = options.controller;                                                              // 33  // 342
  this.action = options.action;                                                                      // 34  // 343
                                                                                                     // 35  // 344
  if (typeof options.reactive !== 'undefined')                                                       // 36  // 345
    this.isReactive = options.reactive;                                                              // 37  // 346
  else                                                                                               // 38  // 347
    this.isReactive = true;                                                                          // 39  // 348
                                                                                                     // 40  // 349
  Utils.rewriteLegacyHooks(this.options);                                                            // 41  // 350
                                                                                                     // 42  // 351
  this.compile();                                                                                    // 43  // 352
};                                                                                                   // 44  // 353
                                                                                                     // 45  // 354
Route.prototype = {                                                                                  // 46  // 355
  constructor: Route,                                                                                // 47  // 356
                                                                                                     // 48  // 357
  /**                                                                                                // 49  // 358
   * Compile the path.                                                                               // 50  // 359
   *                                                                                                 // 51  // 360
   *  @return {Route}                                                                                // 52  // 361
   *  @api public                                                                                    // 53  // 362
   */                                                                                                // 54  // 363
                                                                                                     // 55  // 364
  compile: function () {                                                                             // 56  // 365
    var self = this;                                                                                 // 57  // 366
    var path;                                                                                        // 58  // 367
    var options = self.options;                                                                      // 59  // 368
                                                                                                     // 60  // 369
    this.keys = [];                                                                                  // 61  // 370
                                                                                                     // 62  // 371
    if (self.originalPath instanceof RegExp) {                                                       // 63  // 372
      self.re = self.originalPath;                                                                   // 64  // 373
    } else {                                                                                         // 65  // 374
      path = self.originalPath                                                                       // 66  // 375
        .replace(/(.)\/$/, '$1')                                                                     // 67  // 376
        .concat(options.strict ? '' : '/?')                                                          // 68  // 377
        .replace(/\/\(/g, '(?:/')                                                                    // 69  // 378
        .replace(/#/, '/?#')                                                                         // 70  // 379
        .replace(                                                                                    // 71  // 380
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                    // 72  // 381
          function (match, slash, format, key, capture, optional){                                   // 73  // 382
            self.keys.push({ name: key, optional: !! optional });                                    // 74  // 383
            slash = slash || '';                                                                     // 75  // 384
            return ''                                                                                // 76  // 385
              + (optional ? '' : slash)                                                              // 77  // 386
              + '(?:'                                                                                // 78  // 387
              + (optional ? slash : '')                                                              // 79  // 388
              + (format || '')                                                                       // 80  // 389
              + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'                             // 81  // 390
              + (optional || '');                                                                    // 82  // 391
          }                                                                                          // 83  // 392
        )                                                                                            // 84  // 393
        .replace(/([\/.])/g, '\\$1')                                                                 // 85  // 394
        .replace(/\*/g, '(.*)');                                                                     // 86  // 395
                                                                                                     // 87  // 396
      self.re = new RegExp('^' + path + '$', options.sensitive ? '' : 'i');                          // 88  // 397
    }                                                                                                // 89  // 398
                                                                                                     // 90  // 399
    return this;                                                                                     // 91  // 400
  },                                                                                                 // 92  // 401
                                                                                                     // 93  // 402
  /**                                                                                                // 94  // 403
   * Returns an array of parameters given a path. The array may have named                           // 95  // 404
   * properties in addition to indexed values.                                                       // 96  // 405
   *                                                                                                 // 97  // 406
   * @param {String} path                                                                            // 98  // 407
   * @return {Array}                                                                                 // 99  // 408
   * @api public                                                                                     // 100
   */                                                                                                // 101
                                                                                                     // 102
  params: function (path) {                                                                          // 103
    if (!path)                                                                                       // 104
      return null;                                                                                   // 105
                                                                                                     // 106
    var params = [];                                                                                 // 107
    var m = this.exec(path);                                                                         // 108
    var queryString;                                                                                 // 109
    var keys = this.keys;                                                                            // 110
    var key;                                                                                         // 111
    var value;                                                                                       // 112
                                                                                                     // 113
    if (!m)                                                                                          // 114
      throw new Error('The route named "' + this.name + '" does not match the path "' + path + '"'); // 115
                                                                                                     // 116
    for (var i = 1, len = m.length; i < len; ++i) {                                                  // 117
      key = keys[i - 1];                                                                             // 118
      value = typeof m[i] == 'string' ? decodeURIComponent(m[i]) : m[i];                             // 119
      if (key) {                                                                                     // 120
        params[key.name] = params[key.name] !== undefined ?                                          // 121
          params[key.name] : value;                                                                  // 122
      } else                                                                                         // 123
        params.push(value);                                                                          // 124
    }                                                                                                // 125
                                                                                                     // 126
    path = decodeURI(path);                                                                          // 127
                                                                                                     // 128
    queryString = path.split('?')[1];                                                                // 129
    if (queryString)                                                                                 // 130
      queryString = queryString.split('#')[0];                                                       // 131
                                                                                                     // 132
    params.hash = path.split('#')[1];                                                                // 133
                                                                                                     // 134
    if (queryString) {                                                                               // 135
      _.each(queryString.split('&'), function (paramString) {                                        // 136
        paramParts = paramString.split('=');                                                         // 137
        params[paramParts[0]] = decodeURIComponent(paramParts[1]);                                   // 138
      });                                                                                            // 139
    }                                                                                                // 140
                                                                                                     // 141
    return params;                                                                                   // 142
  },                                                                                                 // 143
                                                                                                     // 144
  normalizePath: function (path) {                                                                   // 145
    var origin = Meteor.absoluteUrl();                                                               // 146
                                                                                                     // 147
    path = path.replace(origin, '');                                                                 // 148
                                                                                                     // 149
    var queryStringIndex = path.indexOf('?');                                                        // 150
    path = ~queryStringIndex ? path.slice(0, queryStringIndex) : path;                               // 151
                                                                                                     // 152
    var hashIndex = path.indexOf('#');                                                               // 153
    path = ~hashIndex ? path.slice(0, hashIndex) : path;                                             // 154
                                                                                                     // 155
    if (path.charAt(0) !== '/')                                                                      // 156
      path = '/' + path;                                                                             // 157
                                                                                                     // 158
    return path;                                                                                     // 159
  },                                                                                                 // 160
                                                                                                     // 161
  /**                                                                                                // 162
   * Returns true if the path matches and false otherwise.                                           // 163
   *                                                                                                 // 164
   * @param {String} path                                                                            // 165
   * @return {Boolean}                                                                               // 166
   * @api public                                                                                     // 167
   */                                                                                                // 168
  test: function (path) {                                                                            // 169
    return this.re.test(this.normalizePath(path));                                                   // 170
  },                                                                                                 // 171
                                                                                                     // 172
  exec: function (path) {                                                                            // 173
    return this.re.exec(this.normalizePath(path));                                                   // 174
  },                                                                                                 // 175
                                                                                                     // 176
  resolve: function (params, options) {                                                              // 177
    var value;                                                                                       // 178
    var isValueDefined;                                                                              // 179
    var result;                                                                                      // 180
    var wildCardCount = 0;                                                                           // 181
    var path = this.originalPath;                                                                    // 182
    var hash;                                                                                        // 183
    var query;                                                                                       // 184
    var isMissingParams = false;                                                                     // 185
                                                                                                     // 186
    options = options || {};                                                                         // 187
    params = params || [];                                                                           // 188
    query = options.query;                                                                           // 189
    hash = options.hash && options.hash.toString();                                                  // 190
                                                                                                     // 191
    if (path instanceof RegExp) {                                                                    // 192
      throw new Error('Cannot currently resolve a regular expression path');                         // 193
    } else {                                                                                         // 194
      path = this.originalPath                                                                       // 195
        .replace(                                                                                    // 196
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                    // 197
          function (match, slash, format, key, capture, optional, offset) {                          // 198
            slash = slash || '';                                                                     // 199
            value = params[key];                                                                     // 200
            isValueDefined = typeof value !== 'undefined';                                           // 201
                                                                                                     // 202
            if (optional && !isValueDefined) {                                                       // 203
              value = '';                                                                            // 204
            } else if (!isValueDefined) {                                                            // 205
              isMissingParams = true;                                                                // 206
              return;                                                                                // 207
            }                                                                                        // 208
                                                                                                     // 209
            value = _.isFunction(value) ? value.call(params) : value;                                // 210
            var escapedValue = _.map(String(value).split('/'), function (segment) {                  // 211
              return encodeURIComponent(segment);                                                    // 212
            }).join('/');                                                                            // 213
            return slash + escapedValue                                                              // 214
          }                                                                                          // 215
        )                                                                                            // 216
        .replace(                                                                                    // 217
          /\*/g,                                                                                     // 218
          function (match) {                                                                         // 219
            if (typeof params[wildCardCount] === 'undefined') {                                      // 220
              throw new Error(                                                                       // 221
                'You are trying to access a wild card parameter at index ' +                         // 222
                wildCardCount +                                                                      // 223
                ' but the value of params at that index is undefined');                              // 224
            }                                                                                        // 225
                                                                                                     // 226
            var paramValue = String(params[wildCardCount++]);                                        // 227
            return _.map(paramValue.split('/'), function (segment) {                                 // 228
              return encodeURIComponent(segment);                                                    // 229
            }).join('/');                                                                            // 230
          }                                                                                          // 231
        );                                                                                           // 232
                                                                                                     // 233
      if (_.isObject(query)) {                                                                       // 234
        query = _.map(_.pairs(query), function (queryPart) {                                         // 235
          return queryPart[0] + '=' + encodeURIComponent(queryPart[1]);                              // 236
        }).join('&');                                                                                // 237
      }                                                                                              // 238
                                                                                                     // 239
      if (query && query.length)                                                                     // 240
        path = path + '?' + query;                                                                   // 241
                                                                                                     // 242
      if (hash) {                                                                                    // 243
        hash = encodeURI(hash.replace('#', ''));                                                     // 244
        path = query ?                                                                               // 245
          path + '#' + hash : path + '/#' + hash;                                                    // 246
      }                                                                                              // 247
    }                                                                                                // 248
                                                                                                     // 249
    // Because of optional possibly empty segments we normalize path here                            // 250
    path = path.replace(/\/+/g, '/'); // Multiple / -> one /                                         // 251
    path = path.replace(/^(.+)\/$/g, '$1'); // Removal of trailing /                                 // 252
                                                                                                     // 253
    return isMissingParams ? null : path;                                                            // 254
  },                                                                                                 // 255
                                                                                                     // 256
  path: function (params, options) {                                                                 // 257
    return this.resolve(params, options);                                                            // 258
  },                                                                                                 // 259
                                                                                                     // 260
  url: function (params, options) {                                                                  // 261
    var path = this.path(params, options);                                                           // 262
    if (path) {                                                                                      // 263
      if (path.charAt(0) === '/')                                                                    // 264
        path = path.slice(1, path.length);                                                           // 265
      return Meteor.absoluteUrl() + path;                                                            // 266
    } else {                                                                                         // 267
      return null;                                                                                   // 268
    }                                                                                                // 269
  },                                                                                                 // 270
                                                                                                     // 271
  findController: function (path, options) {                                                         // 272
    var self = this;                                                                                 // 273
    var handler;                                                                                     // 274
    var controllerClass;                                                                             // 275
    var controller;                                                                                  // 276
    var action;                                                                                      // 277
    var routeName;                                                                                   // 278
                                                                                                     // 279
    var resolveValue = Utils.resolveValue;                                                           // 280
    var toArray = Utils.toArray;                                                                     // 281
                                                                                                     // 282
    var resolveController = function (name) {                                                        // 283
      var controller = resolveValue(name);                                                           // 284
      if (typeof controller === 'undefined') {                                                       // 285
        throw new Error(                                                                             // 286
          'controller "' + name + '" is not defined');                                               // 287
      }                                                                                              // 288
                                                                                                     // 289
      return controller;                                                                             // 290
    };                                                                                               // 291
                                                                                                     // 292
    // controller option is a string specifying the name                                             // 293
    // of a controller somewhere                                                                     // 294
    if (_.isString(this.controller))                                                                 // 295
      controller = resolveController(this.controller);                                               // 296
    else if (_.isFunction(this.controller))                                                          // 297
      controller = this.controller;                                                                  // 298
    else if (this.name)                                                                              // 299
      controller = resolveValue(Router.convertRouteControllerName(this.name + 'Controller'));        // 300
                                                                                                     // 301
    if (!controller)                                                                                 // 302
      controller = RouteController;                                                                  // 303
                                                                                                     // 304
    return controller;                                                                               // 305
  },                                                                                                 // 306
                                                                                                     // 307
  newController: function (path, options) {                                                          // 308
    var C = this.findController(path, options);                                                      // 309
                                                                                                     // 310
    options = _.extend({}, options, {                                                                // 311
      path: path,                                                                                    // 312
      params: this.params(path),                                                                     // 313
      where: this.where,                                                                             // 314
      action: this.action                                                                            // 315
    });                                                                                              // 316
                                                                                                     // 317
    return new C(this.router, this, options);                                                        // 318
  },                                                                                                 // 319
                                                                                                     // 320
  getController: function (path, options) {                                                          // 321
    return this.newController(path, options);                                                        // 322
  }.deprecate({where: 'Route', name: 'getController', instead: 'newController'})                     // 323
};                                                                                                   // 324
                                                                                                     // 325
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 635
                                                                                                            // 636
}).call(this);                                                                                              // 637
                                                                                                            // 638
                                                                                                            // 639
                                                                                                            // 640
                                                                                                            // 641
                                                                                                            // 642
                                                                                                            // 643
(function () {                                                                                              // 644
                                                                                                            // 645
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 646
//                                                                                                   //     // 647
// packages/iron:router/lib/route_controller.js                                                      //     // 648
//                                                                                                   //     // 649
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 650
                                                                                                     //     // 651
RouteController = function (router, route, options) {                                                // 1   // 652
  var self = this;                                                                                   // 2   // 653
                                                                                                     // 3   // 654
  if (!(router instanceof IronRouter))                                                               // 4   // 655
    throw new Error('RouteController requires a router');                                            // 5   // 656
                                                                                                     // 6   // 657
  if (!(route instanceof Route))                                                                     // 7   // 658
    throw new Error('RouteController requires a route');                                             // 8   // 659
                                                                                                     // 9   // 660
  options = this.options = options || {};                                                            // 10  // 661
                                                                                                     // 11  // 662
  this.router = router;                                                                              // 12  // 663
  this.route = route;                                                                                // 13  // 664
                                                                                                     // 14  // 665
  this.path = options.path || '';                                                                    // 15  // 666
  this.params = options.params || [];                                                                // 16  // 667
  this.where = options.where || 'client';                                                            // 17  // 668
  this.action = options.action || this.action;                                                       // 18  // 669
                                                                                                     // 19  // 670
  Utils.rewriteLegacyHooks(this.options);                                                            // 20  // 671
  Utils.rewriteLegacyHooks(this);                                                                    // 21  // 672
};                                                                                                   // 22  // 673
                                                                                                     // 23  // 674
RouteController.prototype = {                                                                        // 24  // 675
  constructor: RouteController,                                                                      // 25  // 676
                                                                                                     // 26  // 677
  /**                                                                                                // 27  // 678
   * Returns the value of a property, searching for the property in this lookup                      // 28  // 679
   * order:                                                                                          // 29  // 680
   *                                                                                                 // 30  // 681
   *   1. RouteController options                                                                    // 31  // 682
   *   2. RouteController prototype                                                                  // 32  // 683
   *   3. Route options                                                                              // 33  // 684
   *   4. Router options                                                                             // 34  // 685
   */                                                                                                // 35  // 686
  lookupProperty: function (key) {                                                                   // 36  // 687
    var value;                                                                                       // 37  // 688
                                                                                                     // 38  // 689
    if (!_.isString(key))                                                                            // 39  // 690
      throw new Error('key must be a string');                                                       // 40  // 691
                                                                                                     // 41  // 692
    // 1. RouteController options                                                                    // 42  // 693
    if (typeof (value = this.options[key]) !== 'undefined')                                          // 43  // 694
      return value;                                                                                  // 44  // 695
                                                                                                     // 45  // 696
    // 2. RouteController instance                                                                   // 46  // 697
    if (typeof (value = this[key]) !== 'undefined')                                                  // 47  // 698
      return value;                                                                                  // 48  // 699
                                                                                                     // 49  // 700
    var opts;                                                                                        // 50  // 701
                                                                                                     // 51  // 702
    // 3. Route options                                                                              // 52  // 703
    opts = this.route.options;                                                                       // 53  // 704
    if (opts && typeof (value = opts[key]) !== 'undefined')                                          // 54  // 705
      return value;                                                                                  // 55  // 706
                                                                                                     // 56  // 707
    // 4. Router options                                                                             // 57  // 708
    opts = this.router.options;                                                                      // 58  // 709
    if (opts && typeof (value = opts[key]) !== 'undefined')                                          // 59  // 710
      return value;                                                                                  // 60  // 711
                                                                                                     // 61  // 712
    // 5. Oops couldn't find property                                                                // 62  // 713
    return undefined;                                                                                // 63  // 714
  },                                                                                                 // 64  // 715
                                                                                                     // 65  // 716
  runHooks: function (hookName, more, cb) {                                                          // 66  // 717
    var self = this;                                                                                 // 67  // 718
    var ctor = this.constructor;                                                                     // 68  // 719
                                                                                                     // 69  // 720
    if (!_.isString(hookName))                                                                       // 70  // 721
      throw new Error('hookName must be a string');                                                  // 71  // 722
                                                                                                     // 72  // 723
    if (more && !_.isArray(more))                                                                    // 73  // 724
      throw new Error('more must be an array of functions');                                         // 74  // 725
                                                                                                     // 75  // 726
    var isPaused = false;                                                                            // 76  // 727
                                                                                                     // 77  // 728
    var lookupHook = function (nameOrFn) {                                                           // 78  // 729
      var fn = nameOrFn;                                                                             // 79  // 730
                                                                                                     // 80  // 731
      // if we already have a func just return it                                                    // 81  // 732
      if (_.isFunction(fn))                                                                          // 82  // 733
        return fn;                                                                                   // 83  // 734
                                                                                                     // 84  // 735
      // look up one of the out-of-box hooks like                                                    // 85  // 736
      // 'loaded or 'dataNotFound' if the nameOrFn is a                                              // 86  // 737
      // string                                                                                      // 87  // 738
      if (_.isString(fn)) {                                                                          // 88  // 739
        if (_.isFunction(Router.hooks[fn]))                                                          // 89  // 740
          return Router.hooks[fn];                                                                   // 90  // 741
      }                                                                                              // 91  // 742
                                                                                                     // 92  // 743
      // we couldn't find it so throw an error                                                       // 93  // 744
      throw new Error("No hook found named: ", nameOrFn);                                            // 94  // 745
    };                                                                                               // 95  // 746
                                                                                                     // 96  // 747
    // concatenate together hook arrays from the inheritance                                         // 97  // 748
    // heirarchy, starting at the top parent down to the child.                                      // 98  // 749
    var collectInheritedHooks = function (ctor) {                                                    // 99  // 750
      var hooks = [];                                                                                // 100
                                                                                                     // 101
      if (ctor.__super__)                                                                            // 102
        hooks = hooks.concat(collectInheritedHooks(ctor.__super__.constructor));                     // 103
                                                                                                     // 104
      return Utils.hasOwnProperty(ctor.prototype, hookName) ?                                        // 105
        hooks.concat(ctor.prototype[hookName]) : hooks;                                              // 106
    };                                                                                               // 107
                                                                                                     // 108
                                                                                                     // 109
    // get a list of hooks to run in the following order:                                            // 110
    // 1. RouteController option hooks                                                               // 111
    // 2. RouteController proto hooks (including inherited super to child)                           // 112
    // 3. RouteController object hooks                                                               // 113
    // 4. Router global hooks                                                                        // 114
    // 5. Route option hooks                                                                         // 115
    // 6. more                                                                                       // 116
                                                                                                     // 117
    var toArray = Utils.toArray;                                                                     // 118
    var routerHooks = this.router.getHooks(hookName, this.route.name);                               // 119
                                                                                                     // 120
    var opts;                                                                                        // 121
    opts = this.route.options;                                                                       // 122
    var routeOptionHooks = toArray(opts && opts[hookName]);                                          // 123
                                                                                                     // 124
    opts = this.options;                                                                             // 125
    var optionHooks = toArray(opts && opts[hookName]);                                               // 126
                                                                                                     // 127
    var protoHooks = collectInheritedHooks(this.constructor);                                        // 128
                                                                                                     // 129
    var objectHooks;                                                                                 // 130
    // don't accidentally grab the prototype hooks!                                                  // 131
    // this makes sure the hook is on the object itself                                              // 132
    // not on its constructor's prototype object.                                                    // 133
    if (_.has(this, hookName))                                                                       // 134
      objectHooks = toArray(this[hookName])                                                          // 135
    else                                                                                             // 136
      objectHooks = [];                                                                              // 137
                                                                                                     // 138
    var allHooks = optionHooks                                                                       // 139
      .concat(protoHooks)                                                                            // 140
      .concat(objectHooks)                                                                           // 141
      .concat(routeOptionHooks)                                                                      // 142
      .concat(routerHooks)                                                                           // 143
      .concat(more);                                                                                 // 144
                                                                                                     // 145
    var isPaused = false;                                                                            // 146
    var pauseFn = function () {                                                                      // 147
      isPaused = true;                                                                               // 148
    };                                                                                               // 149
                                                                                                     // 150
    for (var i = 0, hook; hook = allHooks[i]; i++) {                                                 // 151
      var hookFn = lookupHook(hook);                                                                 // 152
                                                                                                     // 153
      if (!isPaused && !this.isStopped)                                                              // 154
        hookFn.call(self, pauseFn, i);                                                               // 155
    }                                                                                                // 156
                                                                                                     // 157
    cb && cb.call(self, isPaused);                                                                   // 158
    return isPaused;                                                                                 // 159
  },                                                                                                 // 160
                                                                                                     // 161
  action: function () {                                                                              // 162
    throw new Error('not implemented');                                                              // 163
  },                                                                                                 // 164
                                                                                                     // 165
  stop: function (cb) {                                                                              // 166
    return this._stopController(cb);                                                                 // 167
  },                                                                                                 // 168
                                                                                                     // 169
  _stopController: function (cb) {                                                                   // 170
    var self = this;                                                                                 // 171
                                                                                                     // 172
    if (this.isStopped)                                                                              // 173
      return;                                                                                        // 174
                                                                                                     // 175
    self.isRunning = false;                                                                          // 176
    self.runHooks('onStop');                                                                         // 177
    self.isStopped = true;                                                                           // 178
    cb && cb.call(self);                                                                             // 179
  },                                                                                                 // 180
                                                                                                     // 181
  _run: function () {                                                                                // 182
    throw new Error('not implemented');                                                              // 183
  }                                                                                                  // 184
};                                                                                                   // 185
                                                                                                     // 186
_.extend(RouteController, {                                                                          // 187
  /**                                                                                                // 188
   * Inherit from RouteController                                                                    // 189
   *                                                                                                 // 190
   * @param {Object} definition Prototype properties for inherited class.                            // 191
   */                                                                                                // 192
                                                                                                     // 193
  extend: function (definition) {                                                                    // 194
    Utils.rewriteLegacyHooks(definition);                                                            // 195
                                                                                                     // 196
    return Utils.extend(this, definition, function (definition) {                                    // 197
      var klass = this;                                                                              // 198
                                                                                                     // 199
                                                                                                     // 200
      /*                                                                                             // 201
        Allow calling a class method from javascript, directly in the subclass                       // 202
        definition.                                                                                  // 203
                                                                                                     // 204
        Instead of this:                                                                             // 205
          MyController = RouteController.extend({...});                                              // 206
          MyController.before(function () {});                                                       // 207
                                                                                                     // 208
        You can do:                                                                                  // 209
          MyController = RouteController.extend({                                                    // 210
            before: function () {}                                                                   // 211
          });                                                                                        // 212
                                                                                                     // 213
        And in Coffeescript you can do:                                                              // 214
         MyController extends RouteController                                                        // 215
           @before function () {}                                                                    // 216
       */                                                                                            // 217
    });                                                                                              // 218
  }                                                                                                  // 219
});                                                                                                  // 220
                                                                                                     // 221
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 873
                                                                                                            // 874
}).call(this);                                                                                              // 875
                                                                                                            // 876
                                                                                                            // 877
                                                                                                            // 878
                                                                                                            // 879
                                                                                                            // 880
                                                                                                            // 881
(function () {                                                                                              // 882
                                                                                                            // 883
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 884
//                                                                                                   //     // 885
// packages/iron:router/lib/router.js                                                                //     // 886
//                                                                                                   //     // 887
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 888
                                                                                                     //     // 889
IronRouter = function (options) {                                                                    // 1   // 890
  var self = this;                                                                                   // 2   // 891
                                                                                                     // 3   // 892
  this.configure(options);                                                                           // 4   // 893
                                                                                                     // 5   // 894
  /**                                                                                                // 6   // 895
   * The routes array which doubles as a named route index by adding                                 // 7   // 896
   * properties to the array.                                                                        // 8   // 897
   *                                                                                                 // 9   // 898
   * @api public                                                                                     // 10  // 899
   */                                                                                                // 11  // 900
  this.routes = [];                                                                                  // 12  // 901
                                                                                                     // 13  // 902
  /**                                                                                                // 14  // 903
   * Default name conversions for controller                                                         // 15  // 904
   * and template lookup.                                                                            // 16  // 905
   */                                                                                                // 17  // 906
  this._nameConverters = {};                                                                         // 18  // 907
  this.setNameConverter('Template', 'none');                                                         // 19  // 908
  this.setNameConverter('RouteController', 'upperCamelCase');                                        // 20  // 909
                                                                                                     // 21  // 910
  this._globalHooks = {};                                                                            // 22  // 911
  _.each(IronRouter.HOOK_TYPES, function (type) {                                                    // 23  // 912
    self._globalHooks[type] = [];                                                                    // 24  // 913
                                                                                                     // 25  // 914
    // example:                                                                                      // 26  // 915
    //  self.onRun = function (hook, options) {                                                      // 27  // 916
    //    return self.addHook('onRun', hook, options);                                               // 28  // 917
    //  };                                                                                           // 29  // 918
    self[type] = function (hook, options) {                                                          // 30  // 919
      return self.addHook(type, hook, options);                                                      // 31  // 920
    };                                                                                               // 32  // 921
  });                                                                                                // 33  // 922
                                                                                                     // 34  // 923
  _.each(IronRouter.LEGACY_HOOK_TYPES, function (type, legacyType) {                                 // 35  // 924
    self[legacyType] = function () {                                                                 // 36  // 925
      Utils.notifyDeprecated({                                                                       // 37  // 926
        where: 'Router',                                                                             // 38  // 927
        name: legacyType,                                                                            // 39  // 928
        instead: type                                                                                // 40  // 929
      });                                                                                            // 41  // 930
                                                                                                     // 42  // 931
      return self[type].apply(this, arguments);                                                      // 43  // 932
    }                                                                                                // 44  // 933
  });                                                                                                // 45  // 934
};                                                                                                   // 46  // 935
                                                                                                     // 47  // 936
IronRouter.HOOK_TYPES = [                                                                            // 48  // 937
  'onRun',                                                                                           // 49  // 938
  'onData',                                                                                          // 50  // 939
  'onBeforeAction',                                                                                  // 51  // 940
  'onAfterAction',                                                                                   // 52  // 941
  'onStop',                                                                                          // 53  // 942
                                                                                                     // 54  // 943
  // not technically a hook but we'll use it                                                         // 55  // 944
  // in a similar way. This will cause waitOn                                                        // 56  // 945
  // to be added as a method to the Router and then                                                  // 57  // 946
  // it can be selectively applied to specific routes                                                // 58  // 947
  'waitOn'                                                                                           // 59  // 948
];                                                                                                   // 60  // 949
                                                                                                     // 61  // 950
IronRouter.LEGACY_HOOK_TYPES = {                                                                     // 62  // 951
  'load': 'onRun',                                                                                   // 63  // 952
  'before': 'onBeforeAction',                                                                        // 64  // 953
  'after': 'onAfterAction',                                                                          // 65  // 954
  'unload': 'onStop'                                                                                 // 66  // 955
};                                                                                                   // 67  // 956
                                                                                                     // 68  // 957
IronRouter.prototype = {                                                                             // 69  // 958
  constructor: IronRouter,                                                                           // 70  // 959
                                                                                                     // 71  // 960
  /**                                                                                                // 72  // 961
   * Configure instance with options. This can be called at any time. If the                         // 73  // 962
   * instance options object hasn't been created yet it is created here.                             // 74  // 963
   *                                                                                                 // 75  // 964
   * @param {Object} options                                                                         // 76  // 965
   * @return {IronRouter}                                                                            // 77  // 966
   * @api public                                                                                     // 78  // 967
   */                                                                                                // 79  // 968
                                                                                                     // 80  // 969
  configure: function (options) {                                                                    // 81  // 970
    var self = this;                                                                                 // 82  // 971
                                                                                                     // 83  // 972
    options = options || {};                                                                         // 84  // 973
    this.options = this.options || {};                                                               // 85  // 974
    _.extend(this.options, options);                                                                 // 86  // 975
                                                                                                     // 87  // 976
    // e.g. before: fn OR before: [fn1, fn2]                                                         // 88  // 977
    _.each(IronRouter.HOOK_TYPES, function(type) {                                                   // 89  // 978
      if (self.options[type]) {                                                                      // 90  // 979
        _.each(Utils.toArray(self.options[type]), function(hook) {                                   // 91  // 980
          self.addHook(type, hook);                                                                  // 92  // 981
        });                                                                                          // 93  // 982
                                                                                                     // 94  // 983
        delete self.options[type];                                                                   // 95  // 984
      }                                                                                              // 96  // 985
    });                                                                                              // 97  // 986
                                                                                                     // 98  // 987
    _.each(IronRouter.LEGACY_HOOK_TYPES, function(type, legacyType) {                                // 99  // 988
      if (self.options[legacyType]) {                                                                // 100
        // XXX: warning?                                                                             // 101
        _.each(Utils.toArray(self.options[legacyType]), function(hook) {                             // 102
          self.addHook(type, hook);                                                                  // 103
        });                                                                                          // 104
                                                                                                     // 105
        delete self.options[legacyType];                                                             // 106
      }                                                                                              // 107
    });                                                                                              // 108
                                                                                                     // 109
    if (options.templateNameConverter)                                                               // 110
      this.setNameConverter('Template', options.templateNameConverter);                              // 111
                                                                                                     // 112
    if (options.routeControllerNameConverter)                                                        // 113
      this.setNameConverter('RouteController', options.routeControllerNameConverter);                // 114
                                                                                                     // 115
    return this;                                                                                     // 116
  },                                                                                                 // 117
                                                                                                     // 118
  convertTemplateName: function (input) {                                                            // 119
    var converter = this._nameConverters['Template'];                                                // 120
    if (!converter)                                                                                  // 121
      throw new Error('No name converter found for Template');                                       // 122
    return converter(input);                                                                         // 123
  },                                                                                                 // 124
                                                                                                     // 125
  convertRouteControllerName: function (input) {                                                     // 126
    var converter = this._nameConverters['RouteController'];                                         // 127
    if (!converter)                                                                                  // 128
      throw new Error('No name converter found for RouteController');                                // 129
    return converter(input);                                                                         // 130
  },                                                                                                 // 131
                                                                                                     // 132
  setNameConverter: function (key, stringOrFunc) {                                                   // 133
    var converter;                                                                                   // 134
                                                                                                     // 135
    if (_.isFunction(stringOrFunc))                                                                  // 136
      converter = stringOrFunc;                                                                      // 137
                                                                                                     // 138
    if (_.isString(stringOrFunc))                                                                    // 139
      converter = Utils.StringConverters[stringOrFunc];                                              // 140
                                                                                                     // 141
    if (!converter) {                                                                                // 142
      throw new Error('No converter found named: ' + stringOrFunc);                                  // 143
    }                                                                                                // 144
                                                                                                     // 145
    this._nameConverters[key] = converter;                                                           // 146
    return this;                                                                                     // 147
  },                                                                                                 // 148
                                                                                                     // 149
  /**                                                                                                // 150
   *                                                                                                 // 151
   * Add a hook to all routes. The hooks will apply to all routes,                                   // 152
   * unless you name routes to include or exclude via `only` and `except` options                    // 153
   *                                                                                                 // 154
   * @param {String} [type] one of 'load', 'unload', 'before' or 'after'                             // 155
   * @param {Object} [options] Options to controll the hooks [optional]                              // 156
   * @param {Function} [hook] Callback to run                                                        // 157
   * @return {IronRouter}                                                                            // 158
   * @api public                                                                                     // 159
   *                                                                                                 // 160
   */                                                                                                // 161
                                                                                                     // 162
  addHook: function(type, hook, options) {                                                           // 163
    options = options || {}                                                                          // 164
                                                                                                     // 165
    if (options.only)                                                                                // 166
      options.only = Utils.toArray(options.only);                                                    // 167
    if (options.except)                                                                              // 168
      options.except = Utils.toArray(options.except);                                                // 169
                                                                                                     // 170
    this._globalHooks[type].push({options: options, hook: hook});                                    // 171
                                                                                                     // 172
    return this;                                                                                     // 173
  },                                                                                                 // 174
                                                                                                     // 175
  /**                                                                                                // 176
   *                                                                                                 // 177
   * Fetch the list of global hooks that apply to the given route name.                              // 178
   * Hooks are defined by the .addHook() function above.                                             // 179
   *                                                                                                 // 180
   * @param {String} [type] one of IronRouter.HOOK_TYPES                                             // 181
   * @param {String} [name] the name of the route we are interested in                               // 182
   * @return {[Function]} [hooks] an array of hooks to run                                           // 183
   * @api public                                                                                     // 184
   *                                                                                                 // 185
   */                                                                                                // 186
                                                                                                     // 187
  getHooks: function(type, name) {                                                                   // 188
    var hooks = [];                                                                                  // 189
                                                                                                     // 190
    _.each(this._globalHooks[type], function(hook) {                                                 // 191
      var options = hook.options;                                                                    // 192
                                                                                                     // 193
      if (options.except && _.include(options.except, name))                                         // 194
        return;                                                                                      // 195
                                                                                                     // 196
      if (options.only && ! _.include(options.only, name))                                           // 197
        return;                                                                                      // 198
                                                                                                     // 199
      hooks.push(hook.hook);                                                                         // 200
    });                                                                                              // 201
                                                                                                     // 202
    return hooks;                                                                                    // 203
  },                                                                                                 // 204
                                                                                                     // 205
                                                                                                     // 206
  /**                                                                                                // 207
   * Convenience function to define a bunch of routes at once. In the future we                      // 208
   * might call the callback with a custom dsl.                                                      // 209
   *                                                                                                 // 210
   * Example:                                                                                        // 211
   *  Router.map(function () {                                                                       // 212
   *    this.route('posts');                                                                         // 213
   *  });                                                                                            // 214
   *                                                                                                 // 215
   *  @param {Function} cb                                                                           // 216
   *  @return {IronRouter}                                                                           // 217
   *  @api public                                                                                    // 218
   */                                                                                                // 219
                                                                                                     // 220
  map: function (cb) {                                                                               // 221
    Utils.assert(_.isFunction(cb),                                                                   // 222
           'map requires a function as the first parameter');                                        // 223
    cb.call(this);                                                                                   // 224
    return this;                                                                                     // 225
  },                                                                                                 // 226
                                                                                                     // 227
  /**                                                                                                // 228
   * Define a new route. You must name the route, but as a second parameter you                      // 229
   * can either provide an object of options or a Route instance.                                    // 230
   *                                                                                                 // 231
   * @param {String} name The name of the route                                                      // 232
   * @param {Object} [options] Options to pass along to the route                                    // 233
   * @return {Route}                                                                                 // 234
   * @api public                                                                                     // 235
   */                                                                                                // 236
                                                                                                     // 237
  route: function (name, options) {                                                                  // 238
    var route;                                                                                       // 239
                                                                                                     // 240
    Utils.assert(_.isString(name), 'name is a required parameter');                                  // 241
                                                                                                     // 242
    if (options instanceof Route)                                                                    // 243
      route = options;                                                                               // 244
    else                                                                                             // 245
      route = new Route(this, name, options);                                                        // 246
                                                                                                     // 247
    this.routes[name] = route;                                                                       // 248
    this.routes.push(route);                                                                         // 249
    return route;                                                                                    // 250
  },                                                                                                 // 251
                                                                                                     // 252
  path: function (routeName, params, options) {                                                      // 253
    var route = this.routes[routeName];                                                              // 254
    Utils.warn(route,                                                                                // 255
     'You called Router.path for a route named ' + routeName + ' but that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.path(params, options);                                                     // 257
  },                                                                                                 // 258
                                                                                                     // 259
  url: function (routeName, params, options) {                                                       // 260
    var route = this.routes[routeName];                                                              // 261
    Utils.warn(route,                                                                                // 262
      'You called Router.url for a route named "' + routeName + '" but that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.url(params, options);                                                      // 264
  },                                                                                                 // 265
                                                                                                     // 266
  match: function (path) {                                                                           // 267
    return _.find(this.routes, function(r) { return r.test(path); });                                // 268
  },                                                                                                 // 269
                                                                                                     // 270
  dispatch: function (path, options, cb) {                                                           // 271
    var route = this.match(path);                                                                    // 272
                                                                                                     // 273
    if (! route)                                                                                     // 274
      return this.onRouteNotFound(path, options);                                                    // 275
                                                                                                     // 276
    if (route.where !== (Meteor.isClient ? 'client' : 'server'))                                     // 277
      return this.onUnhandled(path, options);                                                        // 278
                                                                                                     // 279
    var controller = route.newController(path, options);                                             // 280
    this.run(controller, cb);                                                                        // 281
  },                                                                                                 // 282
                                                                                                     // 283
  run: function (controller, cb) {                                                                   // 284
    var self = this;                                                                                 // 285
    var where = Meteor.isClient ? 'client' : 'server';                                               // 286
                                                                                                     // 287
    Utils.assert(controller, 'run requires a controller');                                           // 288
                                                                                                     // 289
    // one last check to see if we should handle the route here                                      // 290
    if (controller.where != where) {                                                                 // 291
      self.onUnhandled(controller.path, controller.options);                                         // 292
      return;                                                                                        // 293
    }                                                                                                // 294
                                                                                                     // 295
    var run = function () {                                                                          // 296
      self._currentController = controller;                                                          // 297
      // set the location                                                                            // 298
      cb && cb(controller);                                                                          // 299
      self._currentController._run();                                                                // 300
    };                                                                                               // 301
                                                                                                     // 302
    // if we already have a current controller let's stop it and then                                // 303
    // run the new one once the old controller is stopped. this will add                             // 304
    // the run function as an onInvalidate callback to the controller's                              // 305
    // computation. Otherwse, just run the new controller.                                           // 306
    if (this._currentController)                                                                     // 307
      this._currentController._stopController(run);                                                  // 308
    else                                                                                             // 309
      run();                                                                                         // 310
  },                                                                                                 // 311
                                                                                                     // 312
  onUnhandled: function (path, options) {                                                            // 313
    throw new Error('onUnhandled not implemented');                                                  // 314
  },                                                                                                 // 315
                                                                                                     // 316
  onRouteNotFound: function (path, options) {                                                        // 317
    throw new Error('Oh no! No route found for path: "' + path + '"');                               // 318
  }                                                                                                  // 319
};                                                                                                   // 320
                                                                                                     // 321
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 1211
                                                                                                            // 1212
}).call(this);                                                                                              // 1213
                                                                                                            // 1214
                                                                                                            // 1215
                                                                                                            // 1216
                                                                                                            // 1217
                                                                                                            // 1218
                                                                                                            // 1219
(function () {                                                                                              // 1220
                                                                                                            // 1221
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 1222
//                                                                                                   //     // 1223
// packages/iron:router/lib/server/route_controller.js                                               //     // 1224
//                                                                                                   //     // 1225
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 1226
                                                                                                     //     // 1227
RouteController = Utils.extend(RouteController, {                                                    // 1   // 1228
  constructor: function () {                                                                         // 2   // 1229
    RouteController.__super__.constructor.apply(this, arguments);                                    // 3   // 1230
    this.request = this.options.request;                                                             // 4   // 1231
    this.response = this.options.response;                                                           // 5   // 1232
    this.next = this.options.next;                                                                   // 6   // 1233
                                                                                                     // 7   // 1234
    this._dataValue = this.data || {};                                                               // 8   // 1235
                                                                                                     // 9   // 1236
    this.data = function (value) {                                                                   // 10  // 1237
      if (value)                                                                                     // 11  // 1238
        this._dataValue = value;                                                                     // 12  // 1239
      else                                                                                           // 13  // 1240
        return _.isFunction(this._dataValue) ? this._dataValue.call(this) : this._dataValue;         // 14  // 1241
    };                                                                                               // 15  // 1242
  },                                                                                                 // 16  // 1243
                                                                                                     // 17  // 1244
  _run: function () {                                                                                // 18  // 1245
    var self = this                                                                                  // 19  // 1246
      , args = _.toArray(arguments);                                                                 // 20  // 1247
                                                                                                     // 21  // 1248
    try {                                                                                            // 22  // 1249
      // if we're already running, you can't call run again without                                  // 23  // 1250
      // calling stop first.                                                                         // 24  // 1251
      if (self.isRunning)                                                                            // 25  // 1252
        throw new Error("You called _run without first calling stop");                               // 26  // 1253
                                                                                                     // 27  // 1254
      self.isRunning = true;                                                                         // 28  // 1255
      self.isStopped = false;                                                                        // 29  // 1256
                                                                                                     // 30  // 1257
      var action = _.isFunction(self.action) ? self.action : self[self.action];                      // 31  // 1258
      Utils.assert(action,                                                                           // 32  // 1259
        "You don't have an action named \"" + self.action + "\" defined on your RouteController");   // 33  // 1260
                                                                                                     // 34  // 1261
      this.runHooks('onRun');                                                                        // 35  // 1262
      var isPaused = this.runHooks('onBeforeAction');                                                // 36  // 1263
                                                                                                     // 37  // 1264
      if (! isPaused) {                                                                              // 38  // 1265
        action.call(this);                                                                           // 39  // 1266
        this.runHooks('onAfterAction');                                                              // 40  // 1267
      }                                                                                              // 41  // 1268
    } catch (e) {                                                                                    // 42  // 1269
      console.error(e.toString());                                                                   // 43  // 1270
      this.response.end();                                                                           // 44  // 1271
    }                                                                                                // 45  // 1272
  },                                                                                                 // 46  // 1273
                                                                                                     // 47  // 1274
  action: function () {                                                                              // 48  // 1275
    this.response.end();                                                                             // 49  // 1276
  }                                                                                                  // 50  // 1277
});                                                                                                  // 51  // 1278
                                                                                                     // 52  // 1279
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 1280
                                                                                                            // 1281
}).call(this);                                                                                              // 1282
                                                                                                            // 1283
                                                                                                            // 1284
                                                                                                            // 1285
                                                                                                            // 1286
                                                                                                            // 1287
                                                                                                            // 1288
(function () {                                                                                              // 1289
                                                                                                            // 1290
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 1291
//                                                                                                   //     // 1292
// packages/iron:router/lib/server/router.js                                                         //     // 1293
//                                                                                                   //     // 1294
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 1295
                                                                                                     //     // 1296
var connect = Npm.require('connect');                                                                // 1   // 1297
var Fiber = Npm.require('fibers');                                                                   // 2   // 1298
                                                                                                     // 3   // 1299
var root = global;                                                                                   // 4   // 1300
                                                                                                     // 5   // 1301
var connectHandlers;                                                                                 // 6   // 1302
var connect;                                                                                         // 7   // 1303
                                                                                                     // 8   // 1304
if (typeof __meteor_bootstrap__.app !== 'undefined') {                                               // 9   // 1305
  connectHandlers = __meteor_bootstrap__.app;                                                        // 10  // 1306
} else {                                                                                             // 11  // 1307
  connectHandlers = WebApp.connectHandlers;                                                          // 12  // 1308
}                                                                                                    // 13  // 1309
                                                                                                     // 14  // 1310
IronRouter = Utils.extend(IronRouter, {                                                              // 15  // 1311
  constructor: function (options) {                                                                  // 16  // 1312
    var self = this;                                                                                 // 17  // 1313
    IronRouter.__super__.constructor.apply(this, arguments);                                         // 18  // 1314
    Meteor.startup(function () {                                                                     // 19  // 1315
      setTimeout(function () {                                                                       // 20  // 1316
        if (self.options.autoStart !== false)                                                        // 21  // 1317
          self.start();                                                                              // 22  // 1318
      });                                                                                            // 23  // 1319
    });                                                                                              // 24  // 1320
  },                                                                                                 // 25  // 1321
                                                                                                     // 26  // 1322
  start: function () {                                                                               // 27  // 1323
    connectHandlers                                                                                  // 28  // 1324
      .use(connect.query())                                                                          // 29  // 1325
      .use(connect.bodyParser())                                                                     // 30  // 1326
      .use(_.bind(this.onRequest, this));                                                            // 31  // 1327
  },                                                                                                 // 32  // 1328
                                                                                                     // 33  // 1329
  onRequest: function (req, res, next) {                                                             // 34  // 1330
    var self = this;                                                                                 // 35  // 1331
    Fiber(function () {                                                                              // 36  // 1332
      self.dispatch(req.url, {                                                                       // 37  // 1333
        request: req,                                                                                // 38  // 1334
        response: res,                                                                               // 39  // 1335
        next: next                                                                                   // 40  // 1336
      });                                                                                            // 41  // 1337
    }).run();                                                                                        // 42  // 1338
  },                                                                                                 // 43  // 1339
                                                                                                     // 44  // 1340
  run: function (controller, cb) {                                                                   // 45  // 1341
    IronRouter.__super__.run.apply(this, arguments);                                                 // 46  // 1342
    if (controller === this._currentController)                                                      // 47  // 1343
      cb && cb(controller);                                                                          // 48  // 1344
  },                                                                                                 // 49  // 1345
                                                                                                     // 50  // 1346
  stop: function () {                                                                                // 51  // 1347
  },                                                                                                 // 52  // 1348
                                                                                                     // 53  // 1349
  onUnhandled: function (path, options) {                                                            // 54  // 1350
    options.next();                                                                                  // 55  // 1351
  },                                                                                                 // 56  // 1352
                                                                                                     // 57  // 1353
  onRouteNotFound: function (path, options) {                                                        // 58  // 1354
    options.next();                                                                                  // 59  // 1355
  }                                                                                                  // 60  // 1356
});                                                                                                  // 61  // 1357
                                                                                                     // 62  // 1358
Router = new IronRouter;                                                                             // 63  // 1359
                                                                                                     // 64  // 1360
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 1361
                                                                                                            // 1362
}).call(this);                                                                                              // 1363
                                                                                                            // 1364
                                                                                                            // 1365
                                                                                                            // 1366
                                                                                                            // 1367
                                                                                                            // 1368
                                                                                                            // 1369
(function () {                                                                                              // 1370
                                                                                                            // 1371
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 1372
//                                                                                                   //     // 1373
// packages/iron:router/lib/version_conflict_error.js                                                //     // 1374
//                                                                                                   //     // 1375
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 1376
                                                                                                     //     // 1377
if (Package['cmather:iron-router']) {                                                                // 1   // 1378
  throw new Error("\n\n\
    Sorry! The cmather:iron-{x} packages were migrated to the new package system with the wrong name, and you have duplicate copies.\n\
    You can see which cmather:iron-{x} packages have been installed by using this command:\n\n\
    > meteor list\n\n\
    Can you remove any installed cmather:iron-{x} packages like this:\
    \n\n\
    > meteor remove cmather:iron-core\n\
    > meteor remove cmather:iron-router\n\
    > meteor remove cmather:iron-dynamic-template\n\
    > meteor remove cmather:iron-dynamic-layout\n\
    \n\
    The new packages are named iron:{x}. For example:\n\n\
    > meteor add iron:router\n\n\
    Sorry for the hassle, but thank you!\
    \n\n\
  ");                                                                                                // 17  // 1394
}                                                                                                    // 18  // 1395
                                                                                                     // 19  // 1396
///////////////////////////////////////////////////////////////////////////////////////////////////////     // 1397
                                                                                                            // 1398
}).call(this);                                                                                              // 1399
                                                                                                            // 1400
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:router'] = {
  RouteController: RouteController,
  Route: Route,
  Router: Router,
  Utils: Utils,
  IronRouter: IronRouter
};

})();

//# sourceMappingURL=iron_router.js.map
