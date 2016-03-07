//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var HTML = Package.htmljs.HTML;
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var Utils, hasOld, Route, paramParts, RouteController, IronRouter, IronLocation, href, setState, Router, WaitList;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/iron_router/packages/iron_router.js                                                              //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
(function () {                                                                                               // 1
                                                                                                             // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                                    //     // 4
// packages/iron:router/lib/utils.js                                                                  //     // 5
//                                                                                                    //     // 6
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                                      //     // 8
/**                                                                                                   // 1   // 9
 * Utility methods available privately to the package.                                                // 2   // 10
 */                                                                                                   // 3   // 11
                                                                                                      // 4   // 12
Utils = {};                                                                                           // 5   // 13
                                                                                                      // 6   // 14
/**                                                                                                   // 7   // 15
 * global object on node or window object in the browser.                                             // 8   // 16
 */                                                                                                   // 9   // 17
                                                                                                      // 10  // 18
Utils.global = (function () { return this; })();                                                      // 11  // 19
                                                                                                      // 12  // 20
/**                                                                                                   // 13  // 21
 * Assert that the given condition is truthy.                                                         // 14  // 22
 *                                                                                                    // 15  // 23
 * @param {Boolean} condition The boolean condition to test for truthiness.                           // 16  // 24
 * @param {String} msg The error message to show if the condition is falsy.                           // 17  // 25
 */                                                                                                   // 18  // 26
                                                                                                      // 19  // 27
Utils.assert = function (condition, msg) {                                                            // 20  // 28
  if (!condition)                                                                                     // 21  // 29
    throw new Error(msg);                                                                             // 22  // 30
};                                                                                                    // 23  // 31
                                                                                                      // 24  // 32
var warn = function (msg) {                                                                           // 25  // 33
  if (!Router || Router.options.supressWarnings !== true) {                                           // 26  // 34
    console && console.warn && console.warn(msg);                                                     // 27  // 35
  }                                                                                                   // 28  // 36
};                                                                                                    // 29  // 37
                                                                                                      // 30  // 38
Utils.warn = function (condition, msg) {                                                              // 31  // 39
  if (!condition)                                                                                     // 32  // 40
    warn(msg);                                                                                        // 33  // 41
};                                                                                                    // 34  // 42
                                                                                                      // 35  // 43
/**                                                                                                   // 36  // 44
 * deprecatation notice to the user which can be a string or object                                   // 37  // 45
 * of the form:                                                                                       // 38  // 46
 *                                                                                                    // 39  // 47
 * {                                                                                                  // 40  // 48
 *  name: 'somePropertyOrMethod',                                                                     // 41  // 49
 *  where: 'RouteController',                                                                         // 42  // 50
 *  instead: 'someOtherPropertyOrMethod',                                                             // 43  // 51
 *  message: ':name is deprecated. Please use :instead instead'                                       // 44  // 52
 * }                                                                                                  // 45  // 53
 */                                                                                                   // 46  // 54
Utils.notifyDeprecated = function (info) {                                                            // 47  // 55
  var name;                                                                                           // 48  // 56
  var instead;                                                                                        // 49  // 57
  var message;                                                                                        // 50  // 58
  var where;                                                                                          // 51  // 59
  var defaultMessage = "[:where] ':name' is deprecated. Please use ':instead' instead.";              // 52  // 60
                                                                                                      // 53  // 61
  if (_.isObject(info)) {                                                                             // 54  // 62
    name = info.name;                                                                                 // 55  // 63
    instead = info.instead;                                                                           // 56  // 64
    message = info.message || defaultMessage;                                                         // 57  // 65
    where = info.where || 'IronRouter';                                                               // 58  // 66
  } else {                                                                                            // 59  // 67
    message = info;                                                                                   // 60  // 68
    name = '';                                                                                        // 61  // 69
    instead = '';                                                                                     // 62  // 70
    where = '';                                                                                       // 63  // 71
  }                                                                                                   // 64  // 72
                                                                                                      // 65  // 73
  warn(                                                                                               // 66  // 74
      '<deprecated> ' +                                                                               // 67  // 75
      message                                                                                         // 68  // 76
      .replace(':name', name)                                                                         // 69  // 77
      .replace(':instead', instead)                                                                   // 70  // 78
      .replace(':where', where) +                                                                     // 71  // 79
      ' ' +                                                                                           // 72  // 80
      (new Error).stack                                                                               // 73  // 81
  );                                                                                                  // 74  // 82
};                                                                                                    // 75  // 83
                                                                                                      // 76  // 84
Utils.withDeprecatedNotice = function (info, fn, thisArg) {                                           // 77  // 85
  return function () {                                                                                // 78  // 86
    Utils.notifyDeprecated(info);                                                                     // 79  // 87
    return fn && fn.apply(thisArg || this, arguments);                                                // 80  // 88
  };                                                                                                  // 81  // 89
};                                                                                                    // 82  // 90
                                                                                                      // 83  // 91
/**                                                                                                   // 84  // 92
 * Given the name of a property, resolves to the value. Works with namespacing                        // 85  // 93
 * too. If first parameter is already a value that isn't a string it's returned                       // 86  // 94
 * immediately.                                                                                       // 87  // 95
 *                                                                                                    // 88  // 96
 * Examples:                                                                                          // 89  // 97
 *  'SomeClass' => window.SomeClass || global.someClass                                               // 90  // 98
 *  'App.namespace.SomeClass' => window.App.namespace.SomeClass                                       // 91  // 99
 *                                                                                                    // 92  // 100
 * @param {String|Object} nameOrValue                                                                 // 93  // 101
 */                                                                                                   // 94  // 102
                                                                                                      // 95  // 103
Utils.resolveValue = function (nameOrValue) {                                                         // 96  // 104
  var global = Utils.global;                                                                          // 97  // 105
  var parts;                                                                                          // 98  // 106
  var ptr;                                                                                            // 99  // 107
                                                                                                      // 100
  if (_.isString(nameOrValue)) {                                                                      // 101
    parts = nameOrValue.split('.')                                                                    // 102
    ptr = global;                                                                                     // 103
    for (var i = 0; i < parts.length; i++) {                                                          // 104
      ptr = ptr[parts[i]];                                                                            // 105
      if (!ptr)                                                                                       // 106
        return undefined;                                                                             // 107
    }                                                                                                 // 108
  } else {                                                                                            // 109
    ptr = nameOrValue;                                                                                // 110
  }                                                                                                   // 111
                                                                                                      // 112
  // final position of ptr should be the resolved value                                               // 113
  return ptr;                                                                                         // 114
};                                                                                                    // 115
                                                                                                      // 116
Utils.hasOwnProperty = function (obj, key) {                                                          // 117
  var prop = {}.hasOwnProperty;                                                                       // 118
  return prop.call(obj, key);                                                                         // 119
};                                                                                                    // 120
                                                                                                      // 121
/**                                                                                                   // 122
 * Don't mess with this function. It's exactly the same as the compiled                               // 123
 * coffeescript mechanism. If you change it we can't guarantee that our code                          // 124
 * will work when used with Coffeescript. One exception is putting in a runtime                       // 125
 * check that both child and parent are of type Function.                                             // 126
 */                                                                                                   // 127
                                                                                                      // 128
Utils.inherits = function (child, parent) {                                                           // 129
  if (Utils.typeOf(child) !== '[object Function]')                                                    // 130
    throw new Error('First parameter to Utils.inherits must be a function');                          // 131
                                                                                                      // 132
  if (Utils.typeOf(parent) !== '[object Function]')                                                   // 133
    throw new Error('Second parameter to Utils.inherits must be a function');                         // 134
                                                                                                      // 135
  for (var key in parent) {                                                                           // 136
    if (Utils.hasOwnProperty(parent, key))                                                            // 137
      child[key] = parent[key];                                                                       // 138
  }                                                                                                   // 139
                                                                                                      // 140
  function ctor () {                                                                                  // 141
    this.constructor = child;                                                                         // 142
  }                                                                                                   // 143
                                                                                                      // 144
  ctor.prototype = parent.prototype;                                                                  // 145
  child.prototype = new ctor();                                                                       // 146
  child.__super__ = parent.prototype;                                                                 // 147
  return child;                                                                                       // 148
};                                                                                                    // 149
                                                                                                      // 150
Utils.toArray = function (obj) {                                                                      // 151
  if (!obj)                                                                                           // 152
    return [];                                                                                        // 153
  else if (Utils.typeOf(obj) !== '[object Array]')                                                    // 154
    return [obj];                                                                                     // 155
  else                                                                                                // 156
    return obj;                                                                                       // 157
};                                                                                                    // 158
                                                                                                      // 159
Utils.typeOf = function (obj) {                                                                       // 160
  if (obj && obj.typeName)                                                                            // 161
    return obj.typeName;                                                                              // 162
  else                                                                                                // 163
    return Object.prototype.toString.call(obj);                                                       // 164
};                                                                                                    // 165
                                                                                                      // 166
Utils.extend = function (Super, definition, onBeforeExtendPrototype) {                                // 167
  if (arguments.length === 1)                                                                         // 168
    definition = Super;                                                                               // 169
  else {                                                                                              // 170
    definition = definition || {};                                                                    // 171
    definition.extend = Super;                                                                        // 172
  }                                                                                                   // 173
                                                                                                      // 174
  return Utils.create(definition, {                                                                   // 175
    onBeforeExtendPrototype: onBeforeExtendPrototype                                                  // 176
  });                                                                                                 // 177
};                                                                                                    // 178
                                                                                                      // 179
Utils.create = function (definition, options) {                                                       // 180
  var Constructor                                                                                     // 181
    , extendFrom                                                                                      // 182
    , savedPrototype;                                                                                 // 183
                                                                                                      // 184
  options = options || {};                                                                            // 185
  definition = definition || {};                                                                      // 186
                                                                                                      // 187
  if (Utils.hasOwnProperty(definition, 'constructor'))                                                // 188
    Constructor = definition.constructor;                                                             // 189
  else {                                                                                              // 190
    Constructor = function () {                                                                       // 191
      if (Constructor.__super__ && Constructor.__super__.constructor)                                 // 192
        return Constructor.__super__.constructor.apply(this, arguments);                              // 193
    }                                                                                                 // 194
  }                                                                                                   // 195
                                                                                                      // 196
  extendFrom = definition.extend;                                                                     // 197
                                                                                                      // 198
  if (definition.extend) delete definition.extend;                                                    // 199
                                                                                                      // 200
  var inherit = function (Child, Super, prototype) {                                                  // 201
    Utils.inherits(Child, Utils.resolveValue(Super));                                                 // 202
    if (prototype) _.extend(Child.prototype, prototype);                                              // 203
  };                                                                                                  // 204
                                                                                                      // 205
  if (extendFrom) {                                                                                   // 206
    inherit(Constructor, extendFrom);                                                                 // 207
  }                                                                                                   // 208
                                                                                                      // 209
  if (options.onBeforeExtendPrototype)                                                                // 210
    options.onBeforeExtendPrototype.call(Constructor, definition);                                    // 211
                                                                                                      // 212
  _.extend(Constructor.prototype, definition);                                                        // 213
                                                                                                      // 214
  return Constructor;                                                                                 // 215
};                                                                                                    // 216
                                                                                                      // 217
Utils.capitalize = function (str) {                                                                   // 218
  return str.charAt(0).toUpperCase() + str.slice(1, str.length);                                      // 219
};                                                                                                    // 220
                                                                                                      // 221
Utils.upperCamelCase = function (str) {                                                               // 222
  var re = /_|-|\./;                                                                                  // 223
                                                                                                      // 224
  if (!str)                                                                                           // 225
    return '';                                                                                        // 226
                                                                                                      // 227
  return _.map(str.split(re), function (word) {                                                       // 228
    return Utils.capitalize(word);                                                                    // 229
  }).join('');                                                                                        // 230
};                                                                                                    // 231
                                                                                                      // 232
Utils.camelCase = function (str) {                                                                    // 233
  var output = Utils.upperCamelCase(str);                                                             // 234
  output = output.charAt(0).toLowerCase() + output.slice(1, output.length);                           // 235
  return output;                                                                                      // 236
};                                                                                                    // 237
                                                                                                      // 238
Utils.pick = function (/* args */) {                                                                  // 239
  var args = _.toArray(arguments)                                                                     // 240
    , arg;                                                                                            // 241
  for (var i = 0; i < args.length; i++) {                                                             // 242
    arg = args[i];                                                                                    // 243
    if (typeof arg !== 'undefined' && arg !== null)                                                   // 244
      return arg;                                                                                     // 245
  }                                                                                                   // 246
                                                                                                      // 247
  return null;                                                                                        // 248
};                                                                                                    // 249
                                                                                                      // 250
Utils.StringConverters = {                                                                            // 251
  'none': function(input) {                                                                           // 252
    return input;                                                                                     // 253
  },                                                                                                  // 254
                                                                                                      // 255
  'upperCamelCase': function (input) {                                                                // 256
    return Utils.upperCamelCase(input);                                                               // 257
  },                                                                                                  // 258
                                                                                                      // 259
  'camelCase': function (input) {                                                                     // 260
    return Utils.camelCase(input);                                                                    // 261
  }                                                                                                   // 262
};                                                                                                    // 263
                                                                                                      // 264
Utils.rewriteLegacyHooks = function (obj) {                                                           // 265
  var legacyToNew = IronRouter.LEGACY_HOOK_TYPES;                                                     // 266
                                                                                                      // 267
  _.each(legacyToNew, function (newHook, oldHook) {                                                   // 268
    // only look on the immediate object, not its                                                     // 269
    // proto chain                                                                                    // 270
    if (_.has(obj, oldHook)) {                                                                        // 271
      hasOld = true;                                                                                  // 272
      obj[newHook] = obj[oldHook];                                                                    // 273
                                                                                                      // 274
      Utils.notifyDeprecated({                                                                        // 275
        where: 'RouteController',                                                                     // 276
        name: oldHook,                                                                                // 277
        instead: newHook                                                                              // 278
      });                                                                                             // 279
    }                                                                                                 // 280
  });                                                                                                 // 281
};                                                                                                    // 282
                                                                                                      // 283
                                                                                                      // 284
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 293
                                                                                                             // 294
}).call(this);                                                                                               // 295
                                                                                                             // 296
                                                                                                             // 297
                                                                                                             // 298
                                                                                                             // 299
                                                                                                             // 300
                                                                                                             // 301
(function () {                                                                                               // 302
                                                                                                             // 303
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 304
//                                                                                                    //     // 305
// packages/iron:router/lib/route.js                                                                  //     // 306
//                                                                                                    //     // 307
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 308
                                                                                                      //     // 309
/*                                                                                                    // 1   // 310
 * Inspiration and some code for the compilation of routes comes from pagejs.                         // 2   // 311
 * The original has been modified to better handle hash fragments, and to store                       // 3   // 312
 * the regular expression on the Route instance. Also, the resolve method has                         // 4   // 313
 * been added to return a resolved path given a parameters object.                                    // 5   // 314
 */                                                                                                   // 6   // 315
                                                                                                      // 7   // 316
Route = function (router, name, options) {                                                            // 8   // 317
  var path;                                                                                           // 9   // 318
                                                                                                      // 10  // 319
  Utils.assert(                                                                                       // 11  // 320
    router instanceof IronRouter,                                                                     // 12  // 321
    "Route constructor first parameter must be a Router");                                            // 13  // 322
                                                                                                      // 14  // 323
  Utils.assert(                                                                                       // 15  // 324
    _.isString(name),                                                                                 // 16  // 325
    "Route constructor second parameter must be a String name");                                      // 17  // 326
                                                                                                      // 18  // 327
  if (_.isFunction(options))                                                                          // 19  // 328
    options = { handler: options };                                                                   // 20  // 329
                                                                                                      // 21  // 330
  options = this.options = options || {};                                                             // 22  // 331
  path = options.path || ('/' + name);                                                                // 23  // 332
                                                                                                      // 24  // 333
  this.router = router;                                                                               // 25  // 334
  this.originalPath = path;                                                                           // 26  // 335
                                                                                                      // 27  // 336
  if (_.isString(this.originalPath) && this.originalPath.charAt(0) !== '/')                           // 28  // 337
    this.originalPath = '/' + this.originalPath;                                                      // 29  // 338
                                                                                                      // 30  // 339
  this.name = name;                                                                                   // 31  // 340
  this.where = options.where || 'client';                                                             // 32  // 341
  this.controller = options.controller;                                                               // 33  // 342
  this.action = options.action;                                                                       // 34  // 343
                                                                                                      // 35  // 344
  if (typeof options.reactive !== 'undefined')                                                        // 36  // 345
    this.isReactive = options.reactive;                                                               // 37  // 346
  else                                                                                                // 38  // 347
    this.isReactive = true;                                                                           // 39  // 348
                                                                                                      // 40  // 349
  Utils.rewriteLegacyHooks(this.options);                                                             // 41  // 350
                                                                                                      // 42  // 351
  this.compile();                                                                                     // 43  // 352
};                                                                                                    // 44  // 353
                                                                                                      // 45  // 354
Route.prototype = {                                                                                   // 46  // 355
  constructor: Route,                                                                                 // 47  // 356
                                                                                                      // 48  // 357
  /**                                                                                                 // 49  // 358
   * Compile the path.                                                                                // 50  // 359
   *                                                                                                  // 51  // 360
   *  @return {Route}                                                                                 // 52  // 361
   *  @api public                                                                                     // 53  // 362
   */                                                                                                 // 54  // 363
                                                                                                      // 55  // 364
  compile: function () {                                                                              // 56  // 365
    var self = this;                                                                                  // 57  // 366
    var path;                                                                                         // 58  // 367
    var options = self.options;                                                                       // 59  // 368
                                                                                                      // 60  // 369
    this.keys = [];                                                                                   // 61  // 370
                                                                                                      // 62  // 371
    if (self.originalPath instanceof RegExp) {                                                        // 63  // 372
      self.re = self.originalPath;                                                                    // 64  // 373
    } else {                                                                                          // 65  // 374
      path = self.originalPath                                                                        // 66  // 375
        .replace(/(.)\/$/, '$1')                                                                      // 67  // 376
        .concat(options.strict ? '' : '/?')                                                           // 68  // 377
        .replace(/\/\(/g, '(?:/')                                                                     // 69  // 378
        .replace(/#/, '/?#')                                                                          // 70  // 379
        .replace(                                                                                     // 71  // 380
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                     // 72  // 381
          function (match, slash, format, key, capture, optional){                                    // 73  // 382
            self.keys.push({ name: key, optional: !! optional });                                     // 74  // 383
            slash = slash || '';                                                                      // 75  // 384
            return ''                                                                                 // 76  // 385
              + (optional ? '' : slash)                                                               // 77  // 386
              + '(?:'                                                                                 // 78  // 387
              + (optional ? slash : '')                                                               // 79  // 388
              + (format || '')                                                                        // 80  // 389
              + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'                              // 81  // 390
              + (optional || '');                                                                     // 82  // 391
          }                                                                                           // 83  // 392
        )                                                                                             // 84  // 393
        .replace(/([\/.])/g, '\\$1')                                                                  // 85  // 394
        .replace(/\*/g, '(.*)');                                                                      // 86  // 395
                                                                                                      // 87  // 396
      self.re = new RegExp('^' + path + '$', options.sensitive ? '' : 'i');                           // 88  // 397
    }                                                                                                 // 89  // 398
                                                                                                      // 90  // 399
    return this;                                                                                      // 91  // 400
  },                                                                                                  // 92  // 401
                                                                                                      // 93  // 402
  /**                                                                                                 // 94  // 403
   * Returns an array of parameters given a path. The array may have named                            // 95  // 404
   * properties in addition to indexed values.                                                        // 96  // 405
   *                                                                                                  // 97  // 406
   * @param {String} path                                                                             // 98  // 407
   * @return {Array}                                                                                  // 99  // 408
   * @api public                                                                                      // 100
   */                                                                                                 // 101
                                                                                                      // 102
  params: function (path) {                                                                           // 103
    if (!path)                                                                                        // 104
      return null;                                                                                    // 105
                                                                                                      // 106
    var params = [];                                                                                  // 107
    var m = this.exec(path);                                                                          // 108
    var queryString;                                                                                  // 109
    var keys = this.keys;                                                                             // 110
    var key;                                                                                          // 111
    var value;                                                                                        // 112
                                                                                                      // 113
    if (!m)                                                                                           // 114
      throw new Error('The route named "' + this.name + '" does not match the path "' + path + '"');  // 115
                                                                                                      // 116
    for (var i = 1, len = m.length; i < len; ++i) {                                                   // 117
      key = keys[i - 1];                                                                              // 118
      value = typeof m[i] == 'string' ? decodeURIComponent(m[i]) : m[i];                              // 119
      if (key) {                                                                                      // 120
        params[key.name] = params[key.name] !== undefined ?                                           // 121
          params[key.name] : value;                                                                   // 122
      } else                                                                                          // 123
        params.push(value);                                                                           // 124
    }                                                                                                 // 125
                                                                                                      // 126
    path = decodeURI(path);                                                                           // 127
                                                                                                      // 128
    queryString = path.split('?')[1];                                                                 // 129
    if (queryString)                                                                                  // 130
      queryString = queryString.split('#')[0];                                                        // 131
                                                                                                      // 132
    params.hash = path.split('#')[1];                                                                 // 133
                                                                                                      // 134
    if (queryString) {                                                                                // 135
      _.each(queryString.split('&'), function (paramString) {                                         // 136
        paramParts = paramString.split('=');                                                          // 137
        params[paramParts[0]] = decodeURIComponent(paramParts[1]);                                    // 138
      });                                                                                             // 139
    }                                                                                                 // 140
                                                                                                      // 141
    return params;                                                                                    // 142
  },                                                                                                  // 143
                                                                                                      // 144
  normalizePath: function (path) {                                                                    // 145
    var origin = Meteor.absoluteUrl();                                                                // 146
                                                                                                      // 147
    path = path.replace(origin, '');                                                                  // 148
                                                                                                      // 149
    var queryStringIndex = path.indexOf('?');                                                         // 150
    path = ~queryStringIndex ? path.slice(0, queryStringIndex) : path;                                // 151
                                                                                                      // 152
    var hashIndex = path.indexOf('#');                                                                // 153
    path = ~hashIndex ? path.slice(0, hashIndex) : path;                                              // 154
                                                                                                      // 155
    if (path.charAt(0) !== '/')                                                                       // 156
      path = '/' + path;                                                                              // 157
                                                                                                      // 158
    return path;                                                                                      // 159
  },                                                                                                  // 160
                                                                                                      // 161
  /**                                                                                                 // 162
   * Returns true if the path matches and false otherwise.                                            // 163
   *                                                                                                  // 164
   * @param {String} path                                                                             // 165
   * @return {Boolean}                                                                                // 166
   * @api public                                                                                      // 167
   */                                                                                                 // 168
  test: function (path) {                                                                             // 169
    return this.re.test(this.normalizePath(path));                                                    // 170
  },                                                                                                  // 171
                                                                                                      // 172
  exec: function (path) {                                                                             // 173
    return this.re.exec(this.normalizePath(path));                                                    // 174
  },                                                                                                  // 175
                                                                                                      // 176
  resolve: function (params, options) {                                                               // 177
    var value;                                                                                        // 178
    var isValueDefined;                                                                               // 179
    var result;                                                                                       // 180
    var wildCardCount = 0;                                                                            // 181
    var path = this.originalPath;                                                                     // 182
    var hash;                                                                                         // 183
    var query;                                                                                        // 184
    var isMissingParams = false;                                                                      // 185
                                                                                                      // 186
    options = options || {};                                                                          // 187
    params = params || [];                                                                            // 188
    query = options.query;                                                                            // 189
    hash = options.hash && options.hash.toString();                                                   // 190
                                                                                                      // 191
    if (path instanceof RegExp) {                                                                     // 192
      throw new Error('Cannot currently resolve a regular expression path');                          // 193
    } else {                                                                                          // 194
      path = this.originalPath                                                                        // 195
        .replace(                                                                                     // 196
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                     // 197
          function (match, slash, format, key, capture, optional, offset) {                           // 198
            slash = slash || '';                                                                      // 199
            value = params[key];                                                                      // 200
            isValueDefined = typeof value !== 'undefined';                                            // 201
                                                                                                      // 202
            if (optional && !isValueDefined) {                                                        // 203
              value = '';                                                                             // 204
            } else if (!isValueDefined) {                                                             // 205
              isMissingParams = true;                                                                 // 206
              return;                                                                                 // 207
            }                                                                                         // 208
                                                                                                      // 209
            value = _.isFunction(value) ? value.call(params) : value;                                 // 210
            var escapedValue = _.map(String(value).split('/'), function (segment) {                   // 211
              return encodeURIComponent(segment);                                                     // 212
            }).join('/');                                                                             // 213
            return slash + escapedValue                                                               // 214
          }                                                                                           // 215
        )                                                                                             // 216
        .replace(                                                                                     // 217
          /\*/g,                                                                                      // 218
          function (match) {                                                                          // 219
            if (typeof params[wildCardCount] === 'undefined') {                                       // 220
              throw new Error(                                                                        // 221
                'You are trying to access a wild card parameter at index ' +                          // 222
                wildCardCount +                                                                       // 223
                ' but the value of params at that index is undefined');                               // 224
            }                                                                                         // 225
                                                                                                      // 226
            var paramValue = String(params[wildCardCount++]);                                         // 227
            return _.map(paramValue.split('/'), function (segment) {                                  // 228
              return encodeURIComponent(segment);                                                     // 229
            }).join('/');                                                                             // 230
          }                                                                                           // 231
        );                                                                                            // 232
                                                                                                      // 233
      if (_.isObject(query)) {                                                                        // 234
        query = _.map(_.pairs(query), function (queryPart) {                                          // 235
          return queryPart[0] + '=' + encodeURIComponent(queryPart[1]);                               // 236
        }).join('&');                                                                                 // 237
      }                                                                                               // 238
                                                                                                      // 239
      if (query && query.length)                                                                      // 240
        path = path + '?' + query;                                                                    // 241
                                                                                                      // 242
      if (hash) {                                                                                     // 243
        hash = encodeURI(hash.replace('#', ''));                                                      // 244
        path = query ?                                                                                // 245
          path + '#' + hash : path + '/#' + hash;                                                     // 246
      }                                                                                               // 247
    }                                                                                                 // 248
                                                                                                      // 249
    // Because of optional possibly empty segments we normalize path here                             // 250
    path = path.replace(/\/+/g, '/'); // Multiple / -> one /                                          // 251
    path = path.replace(/^(.+)\/$/g, '$1'); // Removal of trailing /                                  // 252
                                                                                                      // 253
    return isMissingParams ? null : path;                                                             // 254
  },                                                                                                  // 255
                                                                                                      // 256
  path: function (params, options) {                                                                  // 257
    return this.resolve(params, options);                                                             // 258
  },                                                                                                  // 259
                                                                                                      // 260
  url: function (params, options) {                                                                   // 261
    var path = this.path(params, options);                                                            // 262
    if (path) {                                                                                       // 263
      if (path.charAt(0) === '/')                                                                     // 264
        path = path.slice(1, path.length);                                                            // 265
      return Meteor.absoluteUrl() + path;                                                             // 266
    } else {                                                                                          // 267
      return null;                                                                                    // 268
    }                                                                                                 // 269
  },                                                                                                  // 270
                                                                                                      // 271
  findController: function (path, options) {                                                          // 272
    var self = this;                                                                                  // 273
    var handler;                                                                                      // 274
    var controllerClass;                                                                              // 275
    var controller;                                                                                   // 276
    var action;                                                                                       // 277
    var routeName;                                                                                    // 278
                                                                                                      // 279
    var resolveValue = Utils.resolveValue;                                                            // 280
    var toArray = Utils.toArray;                                                                      // 281
                                                                                                      // 282
    var resolveController = function (name) {                                                         // 283
      var controller = resolveValue(name);                                                            // 284
      if (typeof controller === 'undefined') {                                                        // 285
        throw new Error(                                                                              // 286
          'controller "' + name + '" is not defined');                                                // 287
      }                                                                                               // 288
                                                                                                      // 289
      return controller;                                                                              // 290
    };                                                                                                // 291
                                                                                                      // 292
    // controller option is a string specifying the name                                              // 293
    // of a controller somewhere                                                                      // 294
    if (_.isString(this.controller))                                                                  // 295
      controller = resolveController(this.controller);                                                // 296
    else if (_.isFunction(this.controller))                                                           // 297
      controller = this.controller;                                                                   // 298
    else if (this.name)                                                                               // 299
      controller = resolveValue(Router.convertRouteControllerName(this.name + 'Controller'));         // 300
                                                                                                      // 301
    if (!controller)                                                                                  // 302
      controller = RouteController;                                                                   // 303
                                                                                                      // 304
    return controller;                                                                                // 305
  },                                                                                                  // 306
                                                                                                      // 307
  newController: function (path, options) {                                                           // 308
    var C = this.findController(path, options);                                                       // 309
                                                                                                      // 310
    options = _.extend({}, options, {                                                                 // 311
      path: path,                                                                                     // 312
      params: this.params(path),                                                                      // 313
      where: this.where,                                                                              // 314
      action: this.action                                                                             // 315
    });                                                                                               // 316
                                                                                                      // 317
    return new C(this.router, this, options);                                                         // 318
  },                                                                                                  // 319
                                                                                                      // 320
  getController: function (path, options) {                                                           // 321
    return this.newController(path, options);                                                         // 322
  }.deprecate({where: 'Route', name: 'getController', instead: 'newController'})                      // 323
};                                                                                                    // 324
                                                                                                      // 325
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 635
                                                                                                             // 636
}).call(this);                                                                                               // 637
                                                                                                             // 638
                                                                                                             // 639
                                                                                                             // 640
                                                                                                             // 641
                                                                                                             // 642
                                                                                                             // 643
(function () {                                                                                               // 644
                                                                                                             // 645
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 646
//                                                                                                    //     // 647
// packages/iron:router/lib/route_controller.js                                                       //     // 648
//                                                                                                    //     // 649
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 650
                                                                                                      //     // 651
RouteController = function (router, route, options) {                                                 // 1   // 652
  var self = this;                                                                                    // 2   // 653
                                                                                                      // 3   // 654
  if (!(router instanceof IronRouter))                                                                // 4   // 655
    throw new Error('RouteController requires a router');                                             // 5   // 656
                                                                                                      // 6   // 657
  if (!(route instanceof Route))                                                                      // 7   // 658
    throw new Error('RouteController requires a route');                                              // 8   // 659
                                                                                                      // 9   // 660
  options = this.options = options || {};                                                             // 10  // 661
                                                                                                      // 11  // 662
  this.router = router;                                                                               // 12  // 663
  this.route = route;                                                                                 // 13  // 664
                                                                                                      // 14  // 665
  this.path = options.path || '';                                                                     // 15  // 666
  this.params = options.params || [];                                                                 // 16  // 667
  this.where = options.where || 'client';                                                             // 17  // 668
  this.action = options.action || this.action;                                                        // 18  // 669
                                                                                                      // 19  // 670
  Utils.rewriteLegacyHooks(this.options);                                                             // 20  // 671
  Utils.rewriteLegacyHooks(this);                                                                     // 21  // 672
};                                                                                                    // 22  // 673
                                                                                                      // 23  // 674
RouteController.prototype = {                                                                         // 24  // 675
  constructor: RouteController,                                                                       // 25  // 676
                                                                                                      // 26  // 677
  /**                                                                                                 // 27  // 678
   * Returns the value of a property, searching for the property in this lookup                       // 28  // 679
   * order:                                                                                           // 29  // 680
   *                                                                                                  // 30  // 681
   *   1. RouteController options                                                                     // 31  // 682
   *   2. RouteController prototype                                                                   // 32  // 683
   *   3. Route options                                                                               // 33  // 684
   *   4. Router options                                                                              // 34  // 685
   */                                                                                                 // 35  // 686
  lookupProperty: function (key) {                                                                    // 36  // 687
    var value;                                                                                        // 37  // 688
                                                                                                      // 38  // 689
    if (!_.isString(key))                                                                             // 39  // 690
      throw new Error('key must be a string');                                                        // 40  // 691
                                                                                                      // 41  // 692
    // 1. RouteController options                                                                     // 42  // 693
    if (typeof (value = this.options[key]) !== 'undefined')                                           // 43  // 694
      return value;                                                                                   // 44  // 695
                                                                                                      // 45  // 696
    // 2. RouteController instance                                                                    // 46  // 697
    if (typeof (value = this[key]) !== 'undefined')                                                   // 47  // 698
      return value;                                                                                   // 48  // 699
                                                                                                      // 49  // 700
    var opts;                                                                                         // 50  // 701
                                                                                                      // 51  // 702
    // 3. Route options                                                                               // 52  // 703
    opts = this.route.options;                                                                        // 53  // 704
    if (opts && typeof (value = opts[key]) !== 'undefined')                                           // 54  // 705
      return value;                                                                                   // 55  // 706
                                                                                                      // 56  // 707
    // 4. Router options                                                                              // 57  // 708
    opts = this.router.options;                                                                       // 58  // 709
    if (opts && typeof (value = opts[key]) !== 'undefined')                                           // 59  // 710
      return value;                                                                                   // 60  // 711
                                                                                                      // 61  // 712
    // 5. Oops couldn't find property                                                                 // 62  // 713
    return undefined;                                                                                 // 63  // 714
  },                                                                                                  // 64  // 715
                                                                                                      // 65  // 716
  runHooks: function (hookName, more, cb) {                                                           // 66  // 717
    var self = this;                                                                                  // 67  // 718
    var ctor = this.constructor;                                                                      // 68  // 719
                                                                                                      // 69  // 720
    if (!_.isString(hookName))                                                                        // 70  // 721
      throw new Error('hookName must be a string');                                                   // 71  // 722
                                                                                                      // 72  // 723
    if (more && !_.isArray(more))                                                                     // 73  // 724
      throw new Error('more must be an array of functions');                                          // 74  // 725
                                                                                                      // 75  // 726
    var isPaused = false;                                                                             // 76  // 727
                                                                                                      // 77  // 728
    var lookupHook = function (nameOrFn) {                                                            // 78  // 729
      var fn = nameOrFn;                                                                              // 79  // 730
                                                                                                      // 80  // 731
      // if we already have a func just return it                                                     // 81  // 732
      if (_.isFunction(fn))                                                                           // 82  // 733
        return fn;                                                                                    // 83  // 734
                                                                                                      // 84  // 735
      // look up one of the out-of-box hooks like                                                     // 85  // 736
      // 'loaded or 'dataNotFound' if the nameOrFn is a                                               // 86  // 737
      // string                                                                                       // 87  // 738
      if (_.isString(fn)) {                                                                           // 88  // 739
        if (_.isFunction(Router.hooks[fn]))                                                           // 89  // 740
          return Router.hooks[fn];                                                                    // 90  // 741
      }                                                                                               // 91  // 742
                                                                                                      // 92  // 743
      // we couldn't find it so throw an error                                                        // 93  // 744
      throw new Error("No hook found named: ", nameOrFn);                                             // 94  // 745
    };                                                                                                // 95  // 746
                                                                                                      // 96  // 747
    // concatenate together hook arrays from the inheritance                                          // 97  // 748
    // heirarchy, starting at the top parent down to the child.                                       // 98  // 749
    var collectInheritedHooks = function (ctor) {                                                     // 99  // 750
      var hooks = [];                                                                                 // 100
                                                                                                      // 101
      if (ctor.__super__)                                                                             // 102
        hooks = hooks.concat(collectInheritedHooks(ctor.__super__.constructor));                      // 103
                                                                                                      // 104
      return Utils.hasOwnProperty(ctor.prototype, hookName) ?                                         // 105
        hooks.concat(ctor.prototype[hookName]) : hooks;                                               // 106
    };                                                                                                // 107
                                                                                                      // 108
                                                                                                      // 109
    // get a list of hooks to run in the following order:                                             // 110
    // 1. RouteController option hooks                                                                // 111
    // 2. RouteController proto hooks (including inherited super to child)                            // 112
    // 3. RouteController object hooks                                                                // 113
    // 4. Router global hooks                                                                         // 114
    // 5. Route option hooks                                                                          // 115
    // 6. more                                                                                        // 116
                                                                                                      // 117
    var toArray = Utils.toArray;                                                                      // 118
    var routerHooks = this.router.getHooks(hookName, this.route.name);                                // 119
                                                                                                      // 120
    var opts;                                                                                         // 121
    opts = this.route.options;                                                                        // 122
    var routeOptionHooks = toArray(opts && opts[hookName]);                                           // 123
                                                                                                      // 124
    opts = this.options;                                                                              // 125
    var optionHooks = toArray(opts && opts[hookName]);                                                // 126
                                                                                                      // 127
    var protoHooks = collectInheritedHooks(this.constructor);                                         // 128
                                                                                                      // 129
    var objectHooks;                                                                                  // 130
    // don't accidentally grab the prototype hooks!                                                   // 131
    // this makes sure the hook is on the object itself                                               // 132
    // not on its constructor's prototype object.                                                     // 133
    if (_.has(this, hookName))                                                                        // 134
      objectHooks = toArray(this[hookName])                                                           // 135
    else                                                                                              // 136
      objectHooks = [];                                                                               // 137
                                                                                                      // 138
    var allHooks = optionHooks                                                                        // 139
      .concat(protoHooks)                                                                             // 140
      .concat(objectHooks)                                                                            // 141
      .concat(routeOptionHooks)                                                                       // 142
      .concat(routerHooks)                                                                            // 143
      .concat(more);                                                                                  // 144
                                                                                                      // 145
    var isPaused = false;                                                                             // 146
    var pauseFn = function () {                                                                       // 147
      isPaused = true;                                                                                // 148
    };                                                                                                // 149
                                                                                                      // 150
    for (var i = 0, hook; hook = allHooks[i]; i++) {                                                  // 151
      var hookFn = lookupHook(hook);                                                                  // 152
                                                                                                      // 153
      if (!isPaused && !this.isStopped)                                                               // 154
        hookFn.call(self, pauseFn, i);                                                                // 155
    }                                                                                                 // 156
                                                                                                      // 157
    cb && cb.call(self, isPaused);                                                                    // 158
    return isPaused;                                                                                  // 159
  },                                                                                                  // 160
                                                                                                      // 161
  action: function () {                                                                               // 162
    throw new Error('not implemented');                                                               // 163
  },                                                                                                  // 164
                                                                                                      // 165
  stop: function (cb) {                                                                               // 166
    return this._stopController(cb);                                                                  // 167
  },                                                                                                  // 168
                                                                                                      // 169
  _stopController: function (cb) {                                                                    // 170
    var self = this;                                                                                  // 171
                                                                                                      // 172
    if (this.isStopped)                                                                               // 173
      return;                                                                                         // 174
                                                                                                      // 175
    self.isRunning = false;                                                                           // 176
    self.runHooks('onStop');                                                                          // 177
    self.isStopped = true;                                                                            // 178
    cb && cb.call(self);                                                                              // 179
  },                                                                                                  // 180
                                                                                                      // 181
  _run: function () {                                                                                 // 182
    throw new Error('not implemented');                                                               // 183
  }                                                                                                   // 184
};                                                                                                    // 185
                                                                                                      // 186
_.extend(RouteController, {                                                                           // 187
  /**                                                                                                 // 188
   * Inherit from RouteController                                                                     // 189
   *                                                                                                  // 190
   * @param {Object} definition Prototype properties for inherited class.                             // 191
   */                                                                                                 // 192
                                                                                                      // 193
  extend: function (definition) {                                                                     // 194
    Utils.rewriteLegacyHooks(definition);                                                             // 195
                                                                                                      // 196
    return Utils.extend(this, definition, function (definition) {                                     // 197
      var klass = this;                                                                               // 198
                                                                                                      // 199
                                                                                                      // 200
      /*                                                                                              // 201
        Allow calling a class method from javascript, directly in the subclass                        // 202
        definition.                                                                                   // 203
                                                                                                      // 204
        Instead of this:                                                                              // 205
          MyController = RouteController.extend({...});                                               // 206
          MyController.before(function () {});                                                        // 207
                                                                                                      // 208
        You can do:                                                                                   // 209
          MyController = RouteController.extend({                                                     // 210
            before: function () {}                                                                    // 211
          });                                                                                         // 212
                                                                                                      // 213
        And in Coffeescript you can do:                                                               // 214
         MyController extends RouteController                                                         // 215
           @before function () {}                                                                     // 216
       */                                                                                             // 217
    });                                                                                               // 218
  }                                                                                                   // 219
});                                                                                                   // 220
                                                                                                      // 221
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 873
                                                                                                             // 874
}).call(this);                                                                                               // 875
                                                                                                             // 876
                                                                                                             // 877
                                                                                                             // 878
                                                                                                             // 879
                                                                                                             // 880
                                                                                                             // 881
(function () {                                                                                               // 882
                                                                                                             // 883
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 884
//                                                                                                    //     // 885
// packages/iron:router/lib/router.js                                                                 //     // 886
//                                                                                                    //     // 887
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 888
                                                                                                      //     // 889
IronRouter = function (options) {                                                                     // 1   // 890
  var self = this;                                                                                    // 2   // 891
                                                                                                      // 3   // 892
  this.configure(options);                                                                            // 4   // 893
                                                                                                      // 5   // 894
  /**                                                                                                 // 6   // 895
   * The routes array which doubles as a named route index by adding                                  // 7   // 896
   * properties to the array.                                                                         // 8   // 897
   *                                                                                                  // 9   // 898
   * @api public                                                                                      // 10  // 899
   */                                                                                                 // 11  // 900
  this.routes = [];                                                                                   // 12  // 901
                                                                                                      // 13  // 902
  /**                                                                                                 // 14  // 903
   * Default name conversions for controller                                                          // 15  // 904
   * and template lookup.                                                                             // 16  // 905
   */                                                                                                 // 17  // 906
  this._nameConverters = {};                                                                          // 18  // 907
  this.setNameConverter('Template', 'none');                                                          // 19  // 908
  this.setNameConverter('RouteController', 'upperCamelCase');                                         // 20  // 909
                                                                                                      // 21  // 910
  this._globalHooks = {};                                                                             // 22  // 911
  _.each(IronRouter.HOOK_TYPES, function (type) {                                                     // 23  // 912
    self._globalHooks[type] = [];                                                                     // 24  // 913
                                                                                                      // 25  // 914
    // example:                                                                                       // 26  // 915
    //  self.onRun = function (hook, options) {                                                       // 27  // 916
    //    return self.addHook('onRun', hook, options);                                                // 28  // 917
    //  };                                                                                            // 29  // 918
    self[type] = function (hook, options) {                                                           // 30  // 919
      return self.addHook(type, hook, options);                                                       // 31  // 920
    };                                                                                                // 32  // 921
  });                                                                                                 // 33  // 922
                                                                                                      // 34  // 923
  _.each(IronRouter.LEGACY_HOOK_TYPES, function (type, legacyType) {                                  // 35  // 924
    self[legacyType] = function () {                                                                  // 36  // 925
      Utils.notifyDeprecated({                                                                        // 37  // 926
        where: 'Router',                                                                              // 38  // 927
        name: legacyType,                                                                             // 39  // 928
        instead: type                                                                                 // 40  // 929
      });                                                                                             // 41  // 930
                                                                                                      // 42  // 931
      return self[type].apply(this, arguments);                                                       // 43  // 932
    }                                                                                                 // 44  // 933
  });                                                                                                 // 45  // 934
};                                                                                                    // 46  // 935
                                                                                                      // 47  // 936
IronRouter.HOOK_TYPES = [                                                                             // 48  // 937
  'onRun',                                                                                            // 49  // 938
  'onData',                                                                                           // 50  // 939
  'onBeforeAction',                                                                                   // 51  // 940
  'onAfterAction',                                                                                    // 52  // 941
  'onStop',                                                                                           // 53  // 942
                                                                                                      // 54  // 943
  // not technically a hook but we'll use it                                                          // 55  // 944
  // in a similar way. This will cause waitOn                                                         // 56  // 945
  // to be added as a method to the Router and then                                                   // 57  // 946
  // it can be selectively applied to specific routes                                                 // 58  // 947
  'waitOn'                                                                                            // 59  // 948
];                                                                                                    // 60  // 949
                                                                                                      // 61  // 950
IronRouter.LEGACY_HOOK_TYPES = {                                                                      // 62  // 951
  'load': 'onRun',                                                                                    // 63  // 952
  'before': 'onBeforeAction',                                                                         // 64  // 953
  'after': 'onAfterAction',                                                                           // 65  // 954
  'unload': 'onStop'                                                                                  // 66  // 955
};                                                                                                    // 67  // 956
                                                                                                      // 68  // 957
IronRouter.prototype = {                                                                              // 69  // 958
  constructor: IronRouter,                                                                            // 70  // 959
                                                                                                      // 71  // 960
  /**                                                                                                 // 72  // 961
   * Configure instance with options. This can be called at any time. If the                          // 73  // 962
   * instance options object hasn't been created yet it is created here.                              // 74  // 963
   *                                                                                                  // 75  // 964
   * @param {Object} options                                                                          // 76  // 965
   * @return {IronRouter}                                                                             // 77  // 966
   * @api public                                                                                      // 78  // 967
   */                                                                                                 // 79  // 968
                                                                                                      // 80  // 969
  configure: function (options) {                                                                     // 81  // 970
    var self = this;                                                                                  // 82  // 971
                                                                                                      // 83  // 972
    options = options || {};                                                                          // 84  // 973
    this.options = this.options || {};                                                                // 85  // 974
    _.extend(this.options, options);                                                                  // 86  // 975
                                                                                                      // 87  // 976
    // e.g. before: fn OR before: [fn1, fn2]                                                          // 88  // 977
    _.each(IronRouter.HOOK_TYPES, function(type) {                                                    // 89  // 978
      if (self.options[type]) {                                                                       // 90  // 979
        _.each(Utils.toArray(self.options[type]), function(hook) {                                    // 91  // 980
          self.addHook(type, hook);                                                                   // 92  // 981
        });                                                                                           // 93  // 982
                                                                                                      // 94  // 983
        delete self.options[type];                                                                    // 95  // 984
      }                                                                                               // 96  // 985
    });                                                                                               // 97  // 986
                                                                                                      // 98  // 987
    _.each(IronRouter.LEGACY_HOOK_TYPES, function(type, legacyType) {                                 // 99  // 988
      if (self.options[legacyType]) {                                                                 // 100
        // XXX: warning?                                                                              // 101
        _.each(Utils.toArray(self.options[legacyType]), function(hook) {                              // 102
          self.addHook(type, hook);                                                                   // 103
        });                                                                                           // 104
                                                                                                      // 105
        delete self.options[legacyType];                                                              // 106
      }                                                                                               // 107
    });                                                                                               // 108
                                                                                                      // 109
    if (options.templateNameConverter)                                                                // 110
      this.setNameConverter('Template', options.templateNameConverter);                               // 111
                                                                                                      // 112
    if (options.routeControllerNameConverter)                                                         // 113
      this.setNameConverter('RouteController', options.routeControllerNameConverter);                 // 114
                                                                                                      // 115
    return this;                                                                                      // 116
  },                                                                                                  // 117
                                                                                                      // 118
  convertTemplateName: function (input) {                                                             // 119
    var converter = this._nameConverters['Template'];                                                 // 120
    if (!converter)                                                                                   // 121
      throw new Error('No name converter found for Template');                                        // 122
    return converter(input);                                                                          // 123
  },                                                                                                  // 124
                                                                                                      // 125
  convertRouteControllerName: function (input) {                                                      // 126
    var converter = this._nameConverters['RouteController'];                                          // 127
    if (!converter)                                                                                   // 128
      throw new Error('No name converter found for RouteController');                                 // 129
    return converter(input);                                                                          // 130
  },                                                                                                  // 131
                                                                                                      // 132
  setNameConverter: function (key, stringOrFunc) {                                                    // 133
    var converter;                                                                                    // 134
                                                                                                      // 135
    if (_.isFunction(stringOrFunc))                                                                   // 136
      converter = stringOrFunc;                                                                       // 137
                                                                                                      // 138
    if (_.isString(stringOrFunc))                                                                     // 139
      converter = Utils.StringConverters[stringOrFunc];                                               // 140
                                                                                                      // 141
    if (!converter) {                                                                                 // 142
      throw new Error('No converter found named: ' + stringOrFunc);                                   // 143
    }                                                                                                 // 144
                                                                                                      // 145
    this._nameConverters[key] = converter;                                                            // 146
    return this;                                                                                      // 147
  },                                                                                                  // 148
                                                                                                      // 149
  /**                                                                                                 // 150
   *                                                                                                  // 151
   * Add a hook to all routes. The hooks will apply to all routes,                                    // 152
   * unless you name routes to include or exclude via `only` and `except` options                     // 153
   *                                                                                                  // 154
   * @param {String} [type] one of 'load', 'unload', 'before' or 'after'                              // 155
   * @param {Object} [options] Options to controll the hooks [optional]                               // 156
   * @param {Function} [hook] Callback to run                                                         // 157
   * @return {IronRouter}                                                                             // 158
   * @api public                                                                                      // 159
   *                                                                                                  // 160
   */                                                                                                 // 161
                                                                                                      // 162
  addHook: function(type, hook, options) {                                                            // 163
    options = options || {}                                                                           // 164
                                                                                                      // 165
    if (options.only)                                                                                 // 166
      options.only = Utils.toArray(options.only);                                                     // 167
    if (options.except)                                                                               // 168
      options.except = Utils.toArray(options.except);                                                 // 169
                                                                                                      // 170
    this._globalHooks[type].push({options: options, hook: hook});                                     // 171
                                                                                                      // 172
    return this;                                                                                      // 173
  },                                                                                                  // 174
                                                                                                      // 175
  /**                                                                                                 // 176
   *                                                                                                  // 177
   * Fetch the list of global hooks that apply to the given route name.                               // 178
   * Hooks are defined by the .addHook() function above.                                              // 179
   *                                                                                                  // 180
   * @param {String} [type] one of IronRouter.HOOK_TYPES                                              // 181
   * @param {String} [name] the name of the route we are interested in                                // 182
   * @return {[Function]} [hooks] an array of hooks to run                                            // 183
   * @api public                                                                                      // 184
   *                                                                                                  // 185
   */                                                                                                 // 186
                                                                                                      // 187
  getHooks: function(type, name) {                                                                    // 188
    var hooks = [];                                                                                   // 189
                                                                                                      // 190
    _.each(this._globalHooks[type], function(hook) {                                                  // 191
      var options = hook.options;                                                                     // 192
                                                                                                      // 193
      if (options.except && _.include(options.except, name))                                          // 194
        return;                                                                                       // 195
                                                                                                      // 196
      if (options.only && ! _.include(options.only, name))                                            // 197
        return;                                                                                       // 198
                                                                                                      // 199
      hooks.push(hook.hook);                                                                          // 200
    });                                                                                               // 201
                                                                                                      // 202
    return hooks;                                                                                     // 203
  },                                                                                                  // 204
                                                                                                      // 205
                                                                                                      // 206
  /**                                                                                                 // 207
   * Convenience function to define a bunch of routes at once. In the future we                       // 208
   * might call the callback with a custom dsl.                                                       // 209
   *                                                                                                  // 210
   * Example:                                                                                         // 211
   *  Router.map(function () {                                                                        // 212
   *    this.route('posts');                                                                          // 213
   *  });                                                                                             // 214
   *                                                                                                  // 215
   *  @param {Function} cb                                                                            // 216
   *  @return {IronRouter}                                                                            // 217
   *  @api public                                                                                     // 218
   */                                                                                                 // 219
                                                                                                      // 220
  map: function (cb) {                                                                                // 221
    Utils.assert(_.isFunction(cb),                                                                    // 222
           'map requires a function as the first parameter');                                         // 223
    cb.call(this);                                                                                    // 224
    return this;                                                                                      // 225
  },                                                                                                  // 226
                                                                                                      // 227
  /**                                                                                                 // 228
   * Define a new route. You must name the route, but as a second parameter you                       // 229
   * can either provide an object of options or a Route instance.                                     // 230
   *                                                                                                  // 231
   * @param {String} name The name of the route                                                       // 232
   * @param {Object} [options] Options to pass along to the route                                     // 233
   * @return {Route}                                                                                  // 234
   * @api public                                                                                      // 235
   */                                                                                                 // 236
                                                                                                      // 237
  route: function (name, options) {                                                                   // 238
    var route;                                                                                        // 239
                                                                                                      // 240
    Utils.assert(_.isString(name), 'name is a required parameter');                                   // 241
                                                                                                      // 242
    if (options instanceof Route)                                                                     // 243
      route = options;                                                                                // 244
    else                                                                                              // 245
      route = new Route(this, name, options);                                                         // 246
                                                                                                      // 247
    this.routes[name] = route;                                                                        // 248
    this.routes.push(route);                                                                          // 249
    return route;                                                                                     // 250
  },                                                                                                  // 251
                                                                                                      // 252
  path: function (routeName, params, options) {                                                       // 253
    var route = this.routes[routeName];                                                               // 254
    Utils.warn(route,                                                                                 // 255
     'You called Router.path for a route named ' + routeName + ' but that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.path(params, options);                                                      // 257
  },                                                                                                  // 258
                                                                                                      // 259
  url: function (routeName, params, options) {                                                        // 260
    var route = this.routes[routeName];                                                               // 261
    Utils.warn(route,                                                                                 // 262
      'You called Router.url for a route named "' + routeName + '" but that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.url(params, options);                                                       // 264
  },                                                                                                  // 265
                                                                                                      // 266
  match: function (path) {                                                                            // 267
    return _.find(this.routes, function(r) { return r.test(path); });                                 // 268
  },                                                                                                  // 269
                                                                                                      // 270
  dispatch: function (path, options, cb) {                                                            // 271
    var route = this.match(path);                                                                     // 272
                                                                                                      // 273
    if (! route)                                                                                      // 274
      return this.onRouteNotFound(path, options);                                                     // 275
                                                                                                      // 276
    if (route.where !== (Meteor.isClient ? 'client' : 'server'))                                      // 277
      return this.onUnhandled(path, options);                                                         // 278
                                                                                                      // 279
    var controller = route.newController(path, options);                                              // 280
    this.run(controller, cb);                                                                         // 281
  },                                                                                                  // 282
                                                                                                      // 283
  run: function (controller, cb) {                                                                    // 284
    var self = this;                                                                                  // 285
    var where = Meteor.isClient ? 'client' : 'server';                                                // 286
                                                                                                      // 287
    Utils.assert(controller, 'run requires a controller');                                            // 288
                                                                                                      // 289
    // one last check to see if we should handle the route here                                       // 290
    if (controller.where != where) {                                                                  // 291
      self.onUnhandled(controller.path, controller.options);                                          // 292
      return;                                                                                         // 293
    }                                                                                                 // 294
                                                                                                      // 295
    var run = function () {                                                                           // 296
      self._currentController = controller;                                                           // 297
      // set the location                                                                             // 298
      cb && cb(controller);                                                                           // 299
      self._currentController._run();                                                                 // 300
    };                                                                                                // 301
                                                                                                      // 302
    // if we already have a current controller let's stop it and then                                 // 303
    // run the new one once the old controller is stopped. this will add                              // 304
    // the run function as an onInvalidate callback to the controller's                               // 305
    // computation. Otherwse, just run the new controller.                                            // 306
    if (this._currentController)                                                                      // 307
      this._currentController._stopController(run);                                                   // 308
    else                                                                                              // 309
      run();                                                                                          // 310
  },                                                                                                  // 311
                                                                                                      // 312
  onUnhandled: function (path, options) {                                                             // 313
    throw new Error('onUnhandled not implemented');                                                   // 314
  },                                                                                                  // 315
                                                                                                      // 316
  onRouteNotFound: function (path, options) {                                                         // 317
    throw new Error('Oh no! No route found for path: "' + path + '"');                                // 318
  }                                                                                                   // 319
};                                                                                                    // 320
                                                                                                      // 321
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1211
                                                                                                             // 1212
}).call(this);                                                                                               // 1213
                                                                                                             // 1214
                                                                                                             // 1215
                                                                                                             // 1216
                                                                                                             // 1217
                                                                                                             // 1218
                                                                                                             // 1219
(function () {                                                                                               // 1220
                                                                                                             // 1221
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1222
//                                                                                                    //     // 1223
// packages/iron:router/lib/client/location.js                                                        //     // 1224
//                                                                                                    //     // 1225
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1226
                                                                                                      //     // 1227
var dep = new Deps.Dependency;                                                                        // 1   // 1228
// XXX: we have to store the state internally (rather than just calling out                           // 2   // 1229
// to window.location) due to an android 2.3 bug. See:                                                // 3   // 1230
//   https://github.com/EventedMind/iron-router/issues/350                                            // 4   // 1231
var currentState = {                                                                                  // 5   // 1232
  path: location.pathname + location.search + location.hash,                                          // 6   // 1233
  // we set title to null because that can be triggered immediately by a "noop"                       // 7   // 1234
  // popstate that happens on load -- if it's already null, nothing's changed.                        // 8   // 1235
  title: null                                                                                         // 9   // 1236
};                                                                                                    // 10  // 1237
                                                                                                      // 11  // 1238
function onpopstate (e) {                                                                             // 12  // 1239
  setState(e.originalEvent.state, null, location.pathname + location.search + location.hash);         // 13  // 1240
}                                                                                                     // 14  // 1241
                                                                                                      // 15  // 1242
IronLocation = {};                                                                                    // 16  // 1243
                                                                                                      // 17  // 1244
IronLocation.origin = function () {                                                                   // 18  // 1245
  return location.protocol + '//' + location.host;                                                    // 19  // 1246
};                                                                                                    // 20  // 1247
                                                                                                      // 21  // 1248
IronLocation.isSameOrigin = function (href) {                                                         // 22  // 1249
  var origin = IronLocation.origin();                                                                 // 23  // 1250
  return href.indexOf(origin) === 0;                                                                  // 24  // 1251
};                                                                                                    // 25  // 1252
                                                                                                      // 26  // 1253
IronLocation.get = function () {                                                                      // 27  // 1254
  dep.depend();                                                                                       // 28  // 1255
  return currentState;                                                                                // 29  // 1256
};                                                                                                    // 30  // 1257
                                                                                                      // 31  // 1258
IronLocation.path = function () {                                                                     // 32  // 1259
  dep.depend();                                                                                       // 33  // 1260
  return currentState.path;                                                                           // 34  // 1261
};                                                                                                    // 35  // 1262
                                                                                                      // 36  // 1263
IronLocation.set = function (url, options) {                                                          // 37  // 1264
  options = options || {};                                                                            // 38  // 1265
                                                                                                      // 39  // 1266
  var state = options.state || {};                                                                    // 40  // 1267
                                                                                                      // 41  // 1268
  if (/^http/.test(url))                                                                              // 42  // 1269
    href = url;                                                                                       // 43  // 1270
  else {                                                                                              // 44  // 1271
    if (url.charAt(0) !== '/')                                                                        // 45  // 1272
      url = '/' + url;                                                                                // 46  // 1273
    href = IronLocation.origin() + url;                                                               // 47  // 1274
  }                                                                                                   // 48  // 1275
                                                                                                      // 49  // 1276
  if (!IronLocation.isSameOrigin(href))                                                               // 50  // 1277
    window.location = href;                                                                           // 51  // 1278
  else if (options.where === 'server')                                                                // 52  // 1279
    window.location = href;                                                                           // 53  // 1280
  else if (options.replaceState)                                                                      // 54  // 1281
    IronLocation.replaceState(state, options.title, url, options.skipReactive);                       // 55  // 1282
  else                                                                                                // 56  // 1283
    IronLocation.pushState(state, options.title, url, options.skipReactive);                          // 57  // 1284
};                                                                                                    // 58  // 1285
                                                                                                      // 59  // 1286
// store the state for later access                                                                   // 60  // 1287
setState = function(newState, title, url, skipReactive) {                                             // 61  // 1288
  newState = _.extend({}, newState);                                                                  // 62  // 1289
  newState.path = url;                                                                                // 63  // 1290
  newState.title = title;                                                                             // 64  // 1291
                                                                                                      // 65  // 1292
  if (!skipReactive && ! EJSON.equals(currentState, newState))                                        // 66  // 1293
    dep.changed();                                                                                    // 67  // 1294
                                                                                                      // 68  // 1295
  currentState = newState;                                                                            // 69  // 1296
}                                                                                                     // 70  // 1297
                                                                                                      // 71  // 1298
IronLocation.pushState = function (state, title, url, skipReactive) {                                 // 72  // 1299
  setState(state, title, url, skipReactive);                                                          // 73  // 1300
                                                                                                      // 74  // 1301
  if (history.pushState)                                                                              // 75  // 1302
    history.pushState(state, title, url);                                                             // 76  // 1303
  else                                                                                                // 77  // 1304
    window.location = url;                                                                            // 78  // 1305
};                                                                                                    // 79  // 1306
                                                                                                      // 80  // 1307
IronLocation.replaceState = function (state, title, url, skipReactive) {                              // 81  // 1308
  // allow just the state or title to be set                                                          // 82  // 1309
  if (arguments.length < 2)                                                                           // 83  // 1310
    title = currentState.title;                                                                       // 84  // 1311
  if (arguments.length < 3)                                                                           // 85  // 1312
    url = currentState.path;                                                                          // 86  // 1313
                                                                                                      // 87  // 1314
  setState(state, title, url, skipReactive);                                                          // 88  // 1315
                                                                                                      // 89  // 1316
  if (history.replaceState)                                                                           // 90  // 1317
    history.replaceState(state, title, url);                                                          // 91  // 1318
  else                                                                                                // 92  // 1319
    window.location = url;                                                                            // 93  // 1320
};                                                                                                    // 94  // 1321
                                                                                                      // 95  // 1322
IronLocation.bindEvents = function(){                                                                 // 96  // 1323
  $(window).on('popstate.iron-router', onpopstate);                                                   // 97  // 1324
};                                                                                                    // 98  // 1325
                                                                                                      // 99  // 1326
IronLocation.unbindEvents = function(){                                                               // 100
  $(window).off('popstate.iron-router');                                                              // 101
};                                                                                                    // 102
                                                                                                      // 103
IronLocation.start = function () {                                                                    // 104
  if (this.isStarted)                                                                                 // 105
    return;                                                                                           // 106
                                                                                                      // 107
  IronLocation.bindEvents();                                                                          // 108
  this.isStarted = true;                                                                              // 109
  // store the fact that this is the first route we hit.                                              // 110
  // this serves two purposes                                                                         // 111
  //   1. We can tell when we've reached an unhandled route and need to show a                        // 112
  //      404 (rather than bailing out to let the server handle it)                                   // 113
  //   2. Users can look at the state to tell if the history.back() will stay                         // 114
  //      inside the app (this is important for mobile apps).                                         // 115
  if (history.replaceState)                                                                           // 116
    history.replaceState({initial: true}, null, location.pathname + location.search + location.hash); // 117
};                                                                                                    // 118
                                                                                                      // 119
IronLocation.stop = function () {                                                                     // 120
  IronLocation.unbindEvents();                                                                        // 121
  this.isStarted = false;                                                                             // 122
};                                                                                                    // 123
                                                                                                      // 124
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1352
                                                                                                             // 1353
}).call(this);                                                                                               // 1354
                                                                                                             // 1355
                                                                                                             // 1356
                                                                                                             // 1357
                                                                                                             // 1358
                                                                                                             // 1359
                                                                                                             // 1360
(function () {                                                                                               // 1361
                                                                                                             // 1362
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1363
//                                                                                                    //     // 1364
// packages/iron:router/lib/client/router.js                                                          //     // 1365
//                                                                                                    //     // 1366
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1367
                                                                                                      //     // 1368
/*****************************************************************************/                       // 1   // 1369
/* Private */                                                                                         // 2   // 1370
/*****************************************************************************/                       // 3   // 1371
var bindData = function (value, thisArg) {                                                            // 4   // 1372
  return function () {                                                                                // 5   // 1373
    return (typeof value === 'function') ? value.apply(thisArg, arguments) : value;                   // 6   // 1374
  };                                                                                                  // 7   // 1375
};                                                                                                    // 8   // 1376
                                                                                                      // 9   // 1377
/*****************************************************************************/                       // 10  // 1378
/* IronRouter */                                                                                      // 11  // 1379
/*****************************************************************************/                       // 12  // 1380
IronRouter = Utils.extend(IronRouter, {                                                               // 13  // 1381
  constructor: function (options) {                                                                   // 14  // 1382
    var self = this;                                                                                  // 15  // 1383
                                                                                                      // 16  // 1384
    IronRouter.__super__.constructor.apply(this, arguments);                                          // 17  // 1385
    self.options.linkSelector = self.options.linkSelector || 'a[href]';                               // 18  // 1386
                                                                                                      // 19  // 1387
    options = options || {};                                                                          // 20  // 1388
                                                                                                      // 21  // 1389
    this.isRendered = false;                                                                          // 22  // 1390
                                                                                                      // 23  // 1391
    /**                                                                                               // 24  // 1392
     * The current RouteController instance. This is set anytime a new route is                       // 25  // 1393
     * dispatched. It's a reactive variable which you can get by calling                              // 26  // 1394
     * Router.current();                                                                              // 27  // 1395
     *                                                                                                // 28  // 1396
     * @api private                                                                                   // 29  // 1397
     */                                                                                               // 30  // 1398
    this._currentController = null;                                                                   // 31  // 1399
                                                                                                      // 32  // 1400
    /**                                                                                               // 33  // 1401
     * Dependency to for this._currentController                                                      // 34  // 1402
     *                                                                                                // 35  // 1403
     * @api private                                                                                   // 36  // 1404
     */                                                                                               // 37  // 1405
    this._controllerDep = new Deps.Dependency;                                                        // 38  // 1406
                                                                                                      // 39  // 1407
    /**                                                                                               // 40  // 1408
      * Did the URL we are looking at come from a hot-code-reload                                     // 41  // 1409
      *  (and thus should we treat is as not new?)                                                    // 42  // 1410
      *                                                                                               // 43  // 1411
      * @api private                                                                                  // 44  // 1412
      */                                                                                              // 45  // 1413
    this._hasJustReloaded = false;                                                                    // 46  // 1414
                                                                                                      // 47  // 1415
    Meteor.startup(function () {                                                                      // 48  // 1416
      Meteor.defer(function () {                                                                      // 49  // 1417
        if (self.options.autoRender !== false)                                                        // 50  // 1418
          self.autoRender();                                                                          // 51  // 1419
        if (self.options.autoStart !== false)                                                         // 52  // 1420
          self.start();                                                                               // 53  // 1421
      });                                                                                             // 54  // 1422
    });                                                                                               // 55  // 1423
                                                                                                      // 56  // 1424
    // manages dynamic rendering                                                                      // 57  // 1425
    // XXX we'll keep the same router api for now and clean it up to be more                          // 58  // 1426
    // sensible on the next pass (to more closely mimic the new Iron.Layout api                       // 59  // 1427
    // which is a lot nicer).                                                                         // 60  // 1428
    this._layout = new Iron.Layout({template: this.options.layoutTemplate});                          // 61  // 1429
                                                                                                      // 62  // 1430
    /*                                                                                                // 63  // 1431
    // proxy these methods to the underlying ui manager object                                        // 64  // 1432
    _.each([                                                                                          // 65  // 1433
      'layout',                                                                                       // 66  // 1434
      'setRegion',                                                                                    // 67  // 1435
      'clearRegion',                                                                                  // 68  // 1436
      'getData',                                                                                      // 69  // 1437
      'setData'                                                                                       // 70  // 1438
    ], function (uiApiMethod) {                                                                       // 71  // 1439
      self[uiApiMethod] = function () {                                                               // 72  // 1440
        if (!self._ui)                                                                                // 73  // 1441
          throw new Error("No uiManager is configured on the Router");                                // 74  // 1442
        return self._ui[uiApiMethod].apply(self._ui, arguments);                                      // 75  // 1443
      };                                                                                              // 76  // 1444
    });                                                                                               // 77  // 1445
    */                                                                                                // 78  // 1446
  },                                                                                                  // 79  // 1447
                                                                                                      // 80  // 1448
  layout: function (template, options) {                                                              // 81  // 1449
    var result = this._layout.template(template);                                                     // 82  // 1450
                                                                                                      // 83  // 1451
    // check whether options has a data property                                                      // 84  // 1452
    if (options && (_.has(options, 'data')))                                                          // 85  // 1453
      this._layout.data(bindData(options.data, this));                                                // 86  // 1454
                                                                                                      // 87  // 1455
    return result;                                                                                    // 88  // 1456
  },                                                                                                  // 89  // 1457
                                                                                                      // 90  // 1458
  setRegion: function (region, template) {                                                            // 91  // 1459
    if (arguments.length === 1) {                                                                     // 92  // 1460
      template = region;                                                                              // 93  // 1461
      region = null;                                                                                  // 94  // 1462
    }                                                                                                 // 95  // 1463
                                                                                                      // 96  // 1464
    this._layout.render(template, {to: region});                                                      // 97  // 1465
    return this;                                                                                      // 98  // 1466
  },                                                                                                  // 99  // 1467
                                                                                                      // 100
  clearRegion: function (region) {                                                                    // 101
    this._layout.clear(region);                                                                       // 102
    return this;                                                                                      // 103
  },                                                                                                  // 104
                                                                                                      // 105
  /**                                                                                                 // 106
   * Reactive accessor for the current RouteController instance. You can also                         // 107
   * get a nonreactive value by specifiying {reactive: false} as an option.                           // 108
   *                                                                                                  // 109
   * @param {Object} [opts] configuration options                                                     // 110
   * @param {Boolean} [opts.reactive] Set to false to enable a non-reactive read.                     // 111
   * @return {RouteController}                                                                        // 112
   * @api public                                                                                      // 113
   */                                                                                                 // 114
                                                                                                      // 115
  current: function (opts) {                                                                          // 116
    if (opts && opts.reactive === false)                                                              // 117
      return this._currentController;                                                                 // 118
    else {                                                                                            // 119
      this._controllerDep.depend();                                                                   // 120
      return this._currentController;                                                                 // 121
    }                                                                                                 // 122
  },                                                                                                  // 123
                                                                                                      // 124
  clearUnusedRegions: function (usedYields) {                                                         // 125
    var self = this;                                                                                  // 126
                                                                                                      // 127
    //XXX clean this up in next major release                                                         // 128
    var allYields = _.keys(this._layout._regions);                                                    // 129
                                                                                                      // 130
    usedYields = _.filter(usedYields, function (val) {                                                // 131
      return !!val;                                                                                   // 132
    });                                                                                               // 133
                                                                                                      // 134
    var unusedYields = _.difference(allYields, usedYields);                                           // 135
                                                                                                      // 136
    _.each(unusedYields, function (key) {                                                             // 137
      self.clearRegion(key);                                                                          // 138
    });                                                                                               // 139
  },                                                                                                  // 140
                                                                                                      // 141
  run: function (controller, cb) {                                                                    // 142
    IronRouter.__super__.run.apply(this, arguments);                                                  // 143
                                                                                                      // 144
    if (controller == this._currentController) {                                                      // 145
      this._controllerDep.changed();                                                                  // 146
    }                                                                                                 // 147
  },                                                                                                  // 148
                                                                                                      // 149
  /**                                                                                                 // 150
   * Wrapper around Location.go that accepts a routeName or a path as the first                       // 151
   * parameter. This method can accept client and server side routes.                                 // 152
   *                                                                                                  // 153
   * Examples:                                                                                        // 154
   *                                                                                                  // 155
   *  1. Router.go('/posts', {state: 'true'});                                                        // 156
   *  2. Router.go('postIndex', [param1, param2], {state});                                           // 157
   *                                                                                                  // 158
   * @param {String} routeNameOrPath                                                                  // 159
   * @param {Array|Object} [params]                                                                   // 160
   * @param {Object} [state]                                                                          // 161
   * @param {Boolean} [replaceState]                                                                  // 162
   * @api public                                                                                      // 163
   */                                                                                                 // 164
                                                                                                      // 165
  go: function (routeNameOrPath, params, options) {                                                   // 166
    var self = this;                                                                                  // 167
    var isPathRe = /^\/|http/                                                                         // 168
    var route;                                                                                        // 169
    var path;                                                                                         // 170
    var onComplete;                                                                                   // 171
    var controller;                                                                                   // 172
    var done;                                                                                         // 173
                                                                                                      // 174
    // after the dispatch is complete, set the IronLocation                                           // 175
    // path and state which will update the browser's url.                                            // 176
    done = function() {                                                                               // 177
      options = options || {};                                                                        // 178
      self._location.set(path, {                                                                      // 179
        replaceState: options.replaceState,                                                           // 180
        state: options.state,                                                                         // 181
        skipReactive: true                                                                            // 182
      });                                                                                             // 183
    };                                                                                                // 184
                                                                                                      // 185
    if (isPathRe.test(routeNameOrPath)) {                                                             // 186
      path = routeNameOrPath;                                                                         // 187
      options = params;                                                                               // 188
                                                                                                      // 189
      // if the path hasn't changed (at all), we are going to do nothing here                         // 190
      if (path === self._location.path()) {                                                           // 191
        if (self.options.debug)                                                                       // 192
          console.log("You've navigated to the same path that you are currently at. Doing nothing");  // 193
        return;                                                                                       // 194
      }                                                                                               // 195
                                                                                                      // 196
      // issue here is in the dispatch process we might want to                                       // 197
      // make a server request so therefore not call this method yet, so                              // 198
      // we need to push the state only after we've decided it's a client                             // 199
      // request, otherwise let the browser handle it and send off to the                             // 200
      // server                                                                                       // 201
      self.dispatch(path, options, done);                                                             // 202
    } else {                                                                                          // 203
      route = self.routes[routeNameOrPath];                                                           // 204
      Utils.assert(route, 'No route found named ' + routeNameOrPath);                                 // 205
      path = route.path(params, options);                                                             // 206
      controller = route.newController(path, options);                                                // 207
      self.run(controller, done);                                                                     // 208
    }                                                                                                 // 209
  },                                                                                                  // 210
                                                                                                      // 211
  render: function () {                                                                               // 212
    this.isRendered = true;                                                                           // 213
                                                                                                      // 214
    // return a UI component for the layout.                                                          // 215
    return this._layout.create();                                                                     // 216
  },                                                                                                  // 217
                                                                                                      // 218
  autoRender: function () {                                                                           // 219
    this.isRendered = true;                                                                           // 220
                                                                                                      // 221
    this._layout.insert({                                                                             // 222
      // insert into the document body element                                                        // 223
      el: document.body,                                                                              // 224
                                                                                                      // 225
      // come back and make this body at some point                                                   // 226
      parentComponent: null                                                                           // 227
    });                                                                                               // 228
  },                                                                                                  // 229
                                                                                                      // 230
  bindEvents: function () {                                                                           // 231
    $(document).on('click.ironRouter', this.options.linkSelector, _.bind(this.onClick, this));        // 232
  },                                                                                                  // 233
                                                                                                      // 234
  unbindEvents: function () {                                                                         // 235
    $(document).off('click.ironRouter', this.options.linkSelector);                                   // 236
  },                                                                                                  // 237
                                                                                                      // 238
  /**                                                                                                 // 239
   * Start listening to click events and set up a Deps.autorun for location                           // 240
   * changes. If already started the method just returns.                                             // 241
   *                                                                                                  // 242
   * @api public                                                                                      // 243
   */                                                                                                 // 244
                                                                                                      // 245
  start: function () {                                                                                // 246
    var self = this;                                                                                  // 247
                                                                                                      // 248
    if (self.isStarted) return;                                                                       // 249
                                                                                                      // 250
    self.isStarted = true;                                                                            // 251
                                                                                                      // 252
    self._location = self.options.location || IronLocation;                                           // 253
    self._location.start();                                                                           // 254
                                                                                                      // 255
    self.bindEvents();                                                                                // 256
                                                                                                      // 257
    Deps.autorun(function (c) {                                                                       // 258
      var location;                                                                                   // 259
      self._locationComputation = c;                                                                  // 260
      self.dispatch(self._location.path(), {state: history.state});                                   // 261
    });                                                                                               // 262
  },                                                                                                  // 263
                                                                                                      // 264
  /**                                                                                                 // 265
   * Remove click event listener and stop listening for location changes.                             // 266
   *                                                                                                  // 267
   * @api public                                                                                      // 268
   */                                                                                                 // 269
                                                                                                      // 270
  stop: function () {                                                                                 // 271
    this.isStarted = false;                                                                           // 272
                                                                                                      // 273
    this.unbindEvents();                                                                              // 274
    this._location.stop();                                                                            // 275
                                                                                                      // 276
    if (this._locationComputation)                                                                    // 277
      this._locationComputation.stop();                                                               // 278
  },                                                                                                  // 279
                                                                                                      // 280
  /**                                                                                                 // 281
   * If we don't handle a link but the server does, bail to the server                                // 282
   *                                                                                                  // 283
   * @api public                                                                                      // 284
   */                                                                                                 // 285
  onUnhandled: function (path, options) {                                                             // 286
    window.location = path;                                                                           // 287
  },                                                                                                  // 288
                                                                                                      // 289
  /**                                                                                                 // 290
   * if we don't handle a link, _and_ the  server doesn't handle it,                                  // 291
   * do one of two things:                                                                            // 292
   *   a) if this is the initial route, then it can't be a static asset, so                           // 293
   *      show notFound or throw an error                                                             // 294
   *   b) otherwise, let the server have a go at it, we may end up coming back.                       // 295
   *                                                                                                  // 296
   * @api public                                                                                      // 297
   */                                                                                                 // 298
  onRouteNotFound: function (path, options) {                                                         // 299
    if (this._location.path() !== path) {                                                             // 300
      window.location = path;                                                                         // 301
    } else if (this.options.notFoundTemplate) {                                                       // 302
      var notFoundRoute = new Route(this, '__notfound__', _.extend(options || {}, {path: path}));     // 303
      this.run(new RouteController(this, notFoundRoute, {                                             // 304
        layoutTemplate: this.options.layoutTemplate,                                                  // 305
        template: this.options.notFoundTemplate                                                       // 306
      }));                                                                                            // 307
    } else {                                                                                          // 308
      throw new Error('Oh no! No route found for path: "' + path + '"');                              // 309
    }                                                                                                 // 310
  },                                                                                                  // 311
                                                                                                      // 312
  onClick: function(e) {                                                                              // 313
    var el = e.currentTarget;                                                                         // 314
    var which = _.isUndefined(e.which) ? e.button : e.which;                                          // 315
    var href = el.href;                                                                               // 316
    var path = el.pathname + el.search + el.hash;                                                     // 317
                                                                                                      // 318
    // ie9 omits the leading slash in pathname - so patch up if it's missing                          // 319
    path = path.replace(/(^\/?)/,"/");                                                                // 320
                                                                                                      // 321
    // we only want to handle clicks on links which:                                                  // 322
    // - haven't been cancelled already                                                               // 323
    if (e.isDefaultPrevented())                                                                       // 324
      return;                                                                                         // 325
                                                                                                      // 326
    //  - are with the left mouse button with no meta key pressed                                     // 327
    if (which !== 1)                                                                                  // 328
      return;                                                                                         // 329
                                                                                                      // 330
    if (e.metaKey || e.ctrlKey || e.shiftKey)                                                         // 331
      return;                                                                                         // 332
                                                                                                      // 333
    // - aren't in a new window                                                                       // 334
    if (el.target)                                                                                    // 335
      return;                                                                                         // 336
                                                                                                      // 337
    // - aren't external to the app                                                                   // 338
    if (!IronLocation.isSameOrigin(href))                                                             // 339
      return;                                                                                         // 340
                                                                                                      // 341
    // note that we _do_ handle links which point to the current URL                                  // 342
    // and links which only change the hash.                                                          // 343
    e.preventDefault();                                                                               // 344
    this.go(path);                                                                                    // 345
  }                                                                                                   // 346
});                                                                                                   // 347
                                                                                                      // 348
/**                                                                                                   // 349
 * The main Router instance that clients will deal with                                               // 350
 *                                                                                                    // 351
 * @api public                                                                                        // 352
 * @exports Router                                                                                    // 353
 */                                                                                                   // 354
                                                                                                      // 355
Router = new IronRouter;                                                                              // 356
                                                                                                      // 357
if (Meteor._reload) {                                                                                 // 358
  // just register the fact that a migration _has_ happened                                           // 359
  Meteor._reload.onMigrate('iron-router', function() { return [true, true]});                         // 360
                                                                                                      // 361
  // then when we come back up, check if it it's set                                                  // 362
  var data = Meteor._reload.migrationData('iron-router');                                             // 363
  Router._hasJustReloaded = data;                                                                     // 364
}                                                                                                     // 365
                                                                                                      // 366
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1735
                                                                                                             // 1736
}).call(this);                                                                                               // 1737
                                                                                                             // 1738
                                                                                                             // 1739
                                                                                                             // 1740
                                                                                                             // 1741
                                                                                                             // 1742
                                                                                                             // 1743
(function () {                                                                                               // 1744
                                                                                                             // 1745
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1746
//                                                                                                    //     // 1747
// packages/iron:router/lib/client/wait_list.js                                                       //     // 1748
//                                                                                                    //     // 1749
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1750
                                                                                                      //     // 1751
/*****************************************************************************/                       // 1   // 1752
/* Imports */                                                                                         // 2   // 1753
/*****************************************************************************/                       // 3   // 1754
var assert = Iron.utils.assert;                                                                       // 4   // 1755
                                                                                                      // 5   // 1756
/*****************************************************************************/                       // 6   // 1757
/* Private */                                                                                         // 7   // 1758
/*****************************************************************************/                       // 8   // 1759
                                                                                                      // 9   // 1760
/**                                                                                                   // 10  // 1761
 * Returns an object of computation ids starting with                                                 // 11  // 1762
 * the current computation and including all ancestor                                                 // 12  // 1763
 * computations. The data structure is an object                                                      // 13  // 1764
 * so we can index by id and do quick checks.                                                         // 14  // 1765
 */                                                                                                   // 15  // 1766
var parentComputations = function () {                                                                // 16  // 1767
  var list = {};                                                                                      // 17  // 1768
  var c = Deps.currentComputation;                                                                    // 18  // 1769
                                                                                                      // 19  // 1770
  while (c) {                                                                                         // 20  // 1771
    list[String(c._id)] = true;                                                                       // 21  // 1772
    c = c._parent;                                                                                    // 22  // 1773
  }                                                                                                   // 23  // 1774
                                                                                                      // 24  // 1775
  return list;                                                                                        // 25  // 1776
};                                                                                                    // 26  // 1777
                                                                                                      // 27  // 1778
/**                                                                                                   // 28  // 1779
 * Check whether the user has called ready() and then called wait(). This                             // 29  // 1780
 * can cause a condition that can be simplified to this:                                              // 30  // 1781
 *                                                                                                    // 31  // 1782
 * dep = new Deps.Dependency;                                                                         // 32  // 1783
 *                                                                                                    // 33  // 1784
 * Deps.autorun(function () {                                                                         // 34  // 1785
 *   dep.depend();                                                                                    // 35  // 1786
 *   dep.changed();                                                                                   // 36  // 1787
 * });                                                                                                // 37  // 1788
 */                                                                                                   // 38  // 1789
var assertNoInvalidationLoop = function (dependency) {                                                // 39  // 1790
  var parentComps = parentComputations();                                                             // 40  // 1791
  var depCompIds = Object.keys(dependency._dependentsById);                                           // 41  // 1792
                                                                                                      // 42  // 1793
  depCompIds.forEach(function (id) {                                                                  // 43  // 1794
    assert(!parentComps[id], "\n\n\
You called wait() after calling ready() inside the same computation tree.\
\n\n\
You can fix this problem in two possible ways:\n\n\
1) Put all of your wait() calls before any ready() calls.\n\
2) Put your ready() call in its own computation with Deps.autorun."                                   // 49  // 1800
    );                                                                                                // 50  // 1801
  });                                                                                                 // 51  // 1802
};                                                                                                    // 52  // 1803
                                                                                                      // 53  // 1804
                                                                                                      // 54  // 1805
/*****************************************************************************/                       // 55  // 1806
/* WaitList */                                                                                        // 56  // 1807
/*****************************************************************************/                       // 57  // 1808
/**                                                                                                   // 58  // 1809
 * A WaitList tracks a list of reactive functions, each in its own computation.                       // 59  // 1810
 * The list is ready() when all of the functions return true. This list is not                        // 60  // 1811
 * ready (i.e. this.ready() === false) if at least one function returns false.                        // 61  // 1812
 *                                                                                                    // 62  // 1813
 * You add functions by calling the wait(fn) method. Each function is run its                         // 63  // 1814
 * own computation. The ready() method is a reactive method but only calls the                        // 64  // 1815
 * deps changed function if the overall state of the list changes from true to                        // 65  // 1816
 * false or from false to true.                                                                       // 66  // 1817
 */                                                                                                   // 67  // 1818
WaitList = function () {                                                                              // 68  // 1819
  this._readyDep = new Deps.Dependency;                                                               // 69  // 1820
  this._comps = [];                                                                                   // 70  // 1821
  this._notReadyCount = 0;                                                                            // 71  // 1822
};                                                                                                    // 72  // 1823
                                                                                                      // 73  // 1824
/**                                                                                                   // 74  // 1825
 * Pass a function that returns true or false.                                                        // 75  // 1826
 */                                                                                                   // 76  // 1827
WaitList.prototype.wait = function (fn) {                                                             // 77  // 1828
  var self = this;                                                                                    // 78  // 1829
                                                                                                      // 79  // 1830
  var activeComp = Deps.currentComputation;                                                           // 80  // 1831
                                                                                                      // 81  // 1832
  assertNoInvalidationLoop(self._readyDep);                                                           // 82  // 1833
                                                                                                      // 83  // 1834
  // break with parent computation and grab the new comp                                              // 84  // 1835
  Deps.nonreactive(function () {                                                                      // 85  // 1836
                                                                                                      // 86  // 1837
    // store the cached result so we can see if it's different from one run to                        // 87  // 1838
    // the next.                                                                                      // 88  // 1839
    var cachedResult = null;                                                                          // 89  // 1840
                                                                                                      // 90  // 1841
    // create a computation for this handle                                                           // 91  // 1842
    var comp = Deps.autorun(function (c) {                                                            // 92  // 1843
      // let's get the new result coerced into a true or false value.                                 // 93  // 1844
      var result = !!fn();                                                                            // 94  // 1845
                                                                                                      // 95  // 1846
      var oldNotReadyCount = self._notReadyCount;                                                     // 96  // 1847
                                                                                                      // 97  // 1848
      // if it's the first run and we're false then inc                                               // 98  // 1849
      if (c.firstRun && !result)                                                                      // 99  // 1850
        self._notReadyCount++;                                                                        // 100
      else if (cachedResult !== null && result !== cachedResult && result === true)                   // 101
        self._notReadyCount--;                                                                        // 102
      else if (cachedResult !== null && result !== cachedResult && result === false)                  // 103
        self._notReadyCount++;                                                                        // 104
                                                                                                      // 105
      cachedResult = result;                                                                          // 106
                                                                                                      // 107
      if (oldNotReadyCount === 0 && self._notReadyCount > 0)                                          // 108
        self._readyDep.changed();                                                                     // 109
      else if (oldNotReadyCount > 0 && self._notReadyCount === 0)                                     // 110
        self._readyDep.changed();                                                                     // 111
    });                                                                                               // 112
                                                                                                      // 113
    self._comps.push(comp);                                                                           // 114
                                                                                                      // 115
    if (activeComp) {                                                                                 // 116
      activeComp.onInvalidate(function () {                                                           // 117
        // keep the old computation and notReadyCount the same for one                                // 118
        // flush cycle so that we don't end up in an intermediate state                               // 119
        // where list.ready() is not correct.                                                         // 120
                                                                                                      // 121
        // keep the state the same until the flush cycle is complete                                  // 122
        Deps.afterFlush(function () {                                                                 // 123
          // stop the computation                                                                     // 124
          comp.stop();                                                                                // 125
                                                                                                      // 126
          // remove the computation from the list                                                     // 127
          self._comps.splice(_.indexOf(self._comps, comp), 1);                                        // 128
                                                                                                      // 129
          if (cachedResult === false) {                                                               // 130
            self._notReadyCount--;                                                                    // 131
                                                                                                      // 132
            if (self._notReadyCount === 0)                                                            // 133
              self._readyDep.changed();                                                               // 134
          }                                                                                           // 135
        });                                                                                           // 136
      });                                                                                             // 137
    }                                                                                                 // 138
  });                                                                                                 // 139
};                                                                                                    // 140
                                                                                                      // 141
WaitList.prototype.ready = function () {                                                              // 142
  this._readyDep.depend();                                                                            // 143
  return this._notReadyCount === 0;                                                                   // 144
};                                                                                                    // 145
                                                                                                      // 146
WaitList.prototype.stop = function () {                                                               // 147
  _.each(this._comps, function (c) { c.stop(); });                                                    // 148
  this._comps = [];                                                                                   // 149
};                                                                                                    // 150
                                                                                                      // 151
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1903
                                                                                                             // 1904
}).call(this);                                                                                               // 1905
                                                                                                             // 1906
                                                                                                             // 1907
                                                                                                             // 1908
                                                                                                             // 1909
                                                                                                             // 1910
                                                                                                             // 1911
(function () {                                                                                               // 1912
                                                                                                             // 1913
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1914
//                                                                                                    //     // 1915
// packages/iron:router/lib/client/hooks.js                                                           //     // 1916
//                                                                                                    //     // 1917
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1918
                                                                                                      //     // 1919
Router.hooks = {                                                                                      // 1   // 1920
  dataNotFound: function (pause) {                                                                    // 2   // 1921
    var tmpl;                                                                                         // 3   // 1922
                                                                                                      // 4   // 1923
    if (!this.ready())                                                                                // 5   // 1924
      return;                                                                                         // 6   // 1925
                                                                                                      // 7   // 1926
    if (!this._hasData())                                                                             // 8   // 1927
      return;                                                                                         // 9   // 1928
                                                                                                      // 10  // 1929
    var data = this.data();                                                                           // 11  // 1930
                                                                                                      // 12  // 1931
    if (data === false || data === null || typeof data === 'undefined') {                             // 13  // 1932
      tmpl = this.lookupProperty('notFoundTemplate');                                                 // 14  // 1933
                                                                                                      // 15  // 1934
      if (tmpl) {                                                                                     // 16  // 1935
        this.render(tmpl);                                                                            // 17  // 1936
        this.renderRegions();                                                                         // 18  // 1937
        pause();                                                                                      // 19  // 1938
      }                                                                                               // 20  // 1939
    }                                                                                                 // 21  // 1940
  },                                                                                                  // 22  // 1941
                                                                                                      // 23  // 1942
  loading: function (pause) {                                                                         // 24  // 1943
    var self = this;                                                                                  // 25  // 1944
    var tmpl;                                                                                         // 26  // 1945
                                                                                                      // 27  // 1946
    if (!this.ready()) {                                                                              // 28  // 1947
      tmpl = this.lookupProperty('loadingTemplate');                                                  // 29  // 1948
                                                                                                      // 30  // 1949
      if (tmpl) {                                                                                     // 31  // 1950
        this.render(tmpl);                                                                            // 32  // 1951
        this.renderRegions();                                                                         // 33  // 1952
        pause();                                                                                      // 34  // 1953
      }                                                                                               // 35  // 1954
    }                                                                                                 // 36  // 1955
  }                                                                                                   // 37  // 1956
};                                                                                                    // 38  // 1957
                                                                                                      // 39  // 1958
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1959
                                                                                                             // 1960
}).call(this);                                                                                               // 1961
                                                                                                             // 1962
                                                                                                             // 1963
                                                                                                             // 1964
                                                                                                             // 1965
                                                                                                             // 1966
                                                                                                             // 1967
(function () {                                                                                               // 1968
                                                                                                             // 1969
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1970
//                                                                                                    //     // 1971
// packages/iron:router/lib/client/route_controller.js                                                //     // 1972
//                                                                                                    //     // 1973
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 1974
                                                                                                      //     // 1975
var isLogging = false;                                                                                // 1   // 1976
var log = function (msg) {                                                                            // 2   // 1977
  if (!isLogging)                                                                                     // 3   // 1978
    return;                                                                                           // 4   // 1979
  console.log('%c<RouteController> ' + msg, 'color: purple; font-size: 1.3em; font-weight: bold;');   // 5   // 1980
};                                                                                                    // 6   // 1981
                                                                                                      // 7   // 1982
var bindData = function (value, thisArg) {                                                            // 8   // 1983
  return function () {                                                                                // 9   // 1984
    return (typeof value === 'function') ? value.apply(thisArg, arguments) : value;                   // 10  // 1985
  };                                                                                                  // 11  // 1986
};                                                                                                    // 12  // 1987
                                                                                                      // 13  // 1988
RouteController = Utils.extend(RouteController, {                                                     // 14  // 1989
  constructor: function () {                                                                          // 15  // 1990
    var self = this;                                                                                  // 16  // 1991
                                                                                                      // 17  // 1992
    RouteController.__super__.constructor.apply(this, arguments);                                     // 18  // 1993
                                                                                                      // 19  // 1994
    this._waitList = new WaitList;                                                                    // 20  // 1995
                                                                                                      // 21  // 1996
    //XXX putting this back so people can access data by calling                                      // 22  // 1997
    //this.data().                                                                                    // 23  // 1998
                                                                                                      // 24  // 1999
    var data = this.lookupProperty('data');                                                           // 25  // 2000
                                                                                                      // 26  // 2001
    this._hasData = function () { return typeof data !== 'undefined'; };                              // 27  // 2002
    this.data = bindData(data, this);                                                                 // 28  // 2003
                                                                                                      // 29  // 2004
    // proxy these methods to the router                                                              // 30  // 2005
    _.each([                                                                                          // 31  // 2006
      'layout',                                                                                       // 32  // 2007
      'setRegion',                                                                                    // 33  // 2008
      'clearRegion'                                                                                   // 34  // 2009
    ], function (routerApiMethod) {                                                                   // 35  // 2010
      self[routerApiMethod] = function () {                                                           // 36  // 2011
        if (!self.router)                                                                             // 37  // 2012
          throw new Error("No router defined on RouteController");                                    // 38  // 2013
        return self.router[routerApiMethod].apply(self.router, arguments);                            // 39  // 2014
      };                                                                                              // 40  // 2015
    });                                                                                               // 41  // 2016
  },                                                                                                  // 42  // 2017
                                                                                                      // 43  // 2018
  setLayout: function () {                                                                            // 44  // 2019
    return this.layout.apply(this, arguments);                                                        // 45  // 2020
  },                                                                                                  // 46  // 2021
                                                                                                      // 47  // 2022
  ready: function () {                                                                                // 48  // 2023
    return this._waitList.ready();                                                                    // 49  // 2024
  },                                                                                                  // 50  // 2025
                                                                                                      // 51  // 2026
  /**                                                                                                 // 52  // 2027
   * Stop running this controller and redirect to a new path. Same parameters as                      // 53  // 2028
   * those of Router.go.                                                                              // 54  // 2029
   * @api public                                                                                      // 55  // 2030
   */                                                                                                 // 56  // 2031
                                                                                                      // 57  // 2032
  redirect: function (/* args */) {                                                                   // 58  // 2033
    return Router.go.apply(Router, arguments);                                                        // 59  // 2034
  },                                                                                                  // 60  // 2035
                                                                                                      // 61  // 2036
  subscribe: function (/* same as Meteor.subscribe */) {                                              // 62  // 2037
    var self = this;                                                                                  // 63  // 2038
    var handle = Meteor.subscribe.apply(this, arguments);                                             // 64  // 2039
                                                                                                      // 65  // 2040
    return _.extend(handle, {                                                                         // 66  // 2041
      wait: function () {                                                                             // 67  // 2042
        self.wait(this);                                                                              // 68  // 2043
      }                                                                                               // 69  // 2044
    });                                                                                               // 70  // 2045
  },                                                                                                  // 71  // 2046
                                                                                                      // 72  // 2047
  lookupLayoutTemplate: function () {                                                                 // 73  // 2048
    return this.lookupProperty('layoutTemplate');                                                     // 74  // 2049
  },                                                                                                  // 75  // 2050
                                                                                                      // 76  // 2051
  lookupTemplate: function () {                                                                       // 77  // 2052
    return this.lookupProperty('template')                                                            // 78  // 2053
      || Router.convertTemplateName(this.route.name);                                                 // 79  // 2054
  },                                                                                                  // 80  // 2055
                                                                                                      // 81  // 2056
  lookupRegionTemplates: function () {                                                                // 82  // 2057
    var res;                                                                                          // 83  // 2058
                                                                                                      // 84  // 2059
    if (res = this.lookupProperty('regionTemplates'))                                                 // 85  // 2060
      return res;                                                                                     // 86  // 2061
    else if (res = this.lookupProperty('yieldTemplates'))                                             // 87  // 2062
      return res;                                                                                     // 88  // 2063
    else                                                                                              // 89  // 2064
      return {};                                                                                      // 90  // 2065
  },                                                                                                  // 91  // 2066
                                                                                                      // 92  // 2067
  /**                                                                                                 // 93  // 2068
   * Return an array of waitOn values in the folowing order (although, ordering                       // 94  // 2069
   * shouldn't really matter for waitOn). The result may contain sub arrays like                      // 95  // 2070
   * this:                                                                                            // 96  // 2071
   *   [[fn1, fn2], [fn3, fn4]]                                                                       // 97  // 2072
   *                                                                                                  // 98  // 2073
   *   1. Router options                                                                              // 99  // 2074
   *   2. Route options                                                                               // 100
   *   3. Controller options                                                                          // 101
   *   4. Controller instance                                                                         // 102
   */                                                                                                 // 103
                                                                                                      // 104
  lookupWaitOn: function () {                                                                         // 105
    var toArray = Utils.toArray;                                                                      // 106
                                                                                                      // 107
    var fromRouterHook = toArray(this.router.getHooks('waitOn', this.route.name));                    // 108
    var fromRouterOptions = toArray(this.router.options.waitOn);                                      // 109
    var fromRouteOptions = toArray(this.route.options.waitOn);                                        // 110
    var fromMyOptions = toArray(this.options.waitOn);                                                 // 111
    var fromInstOptions = toArray(this.waitOn);                                                       // 112
                                                                                                      // 113
    return fromRouterHook                                                                             // 114
      .concat(fromRouterOptions)                                                                      // 115
      .concat(fromRouteOptions)                                                                       // 116
      .concat(fromMyOptions)                                                                          // 117
      .concat(fromInstOptions);                                                                       // 118
  },                                                                                                  // 119
                                                                                                      // 120
  /**                                                                                                 // 121
   * Either specify a template to render or call with no arguments to render the                      // 122
   * RouteController's template plus all of the yieldTemplates.                                       // 123
   *                                                                                                  // 124
   * XXX can we have some hooks here? would be nice to give                                           // 125
   * iron-transitioner a place to plug in. Maybe onSetRegion(fn)?                                     // 126
   */                                                                                                 // 127
                                                                                                      // 128
  render: function (template, options) {                                                              // 129
    var to;                                                                                           // 130
    var template;                                                                                     // 131
    var layout;                                                                                       // 132
    var self = this;                                                                                  // 133
                                                                                                      // 134
    if (arguments.length == 0) {                                                                      // 135
      this.setRegion(this.lookupTemplate());                                                          // 136
      this.renderRegions();                                                                           // 137
    } else {                                                                                          // 138
      options = options || {};                                                                        // 139
      to = options.to;                                                                                // 140
      this.setRegion(to, template);                                                                   // 141
    }                                                                                                 // 142
  },                                                                                                  // 143
                                                                                                      // 144
  renderRegions: function() {                                                                         // 145
    var self = this;                                                                                  // 146
    var regionTemplates = this.lookupRegionTemplates();                                               // 147
                                                                                                      // 148
    _.each(regionTemplates, function (opts, tmpl) {                                                   // 149
      self.render(tmpl, opts)                                                                         // 150
    });                                                                                               // 151
  },                                                                                                  // 152
                                                                                                      // 153
  /**                                                                                                 // 154
   * Add an item to the waitlist.                                                                     // 155
   */                                                                                                 // 156
  wait: function (fn) {                                                                               // 157
    var self = this;                                                                                  // 158
                                                                                                      // 159
    if (!fn)                                                                                          // 160
      // it's possible fn is just undefined but we'll just return instead                             // 161
      // of throwing an error, to make it easier to call this function                                // 162
      // with waitOn which might not return anything.                                                 // 163
      return;                                                                                         // 164
                                                                                                      // 165
    if (_.isArray(fn)) {                                                                              // 166
      _.each(fn, function eachWait (fnOrHandle) {                                                     // 167
        self.wait(fnOrHandle);                                                                        // 168
      });                                                                                             // 169
    } else if (fn.ready) {                                                                            // 170
      this._waitList.wait(function () { return fn.ready(); });                                        // 171
    } else {                                                                                          // 172
      this._waitList.wait(fn);                                                                        // 173
    }                                                                                                 // 174
                                                                                                      // 175
    return this;                                                                                      // 176
  },                                                                                                  // 177
                                                                                                      // 178
  action: function () {                                                                               // 179
    this.render();                                                                                    // 180
  },                                                                                                  // 181
                                                                                                      // 182
  /**                                                                                                 // 183
   * A private method that the Router can call into to                                                // 184
   * stop the controller. The reason we need this is because we                                       // 185
   * don't want users calling stop() in their hooks/action like they                                  // 186
   * had done previously. We now want them to call pause(). stop() now                                // 187
   * completely stops the controller and tears down its computations. pause()                         // 188
   * just stopps running downstream functions (e.g. when you're running                               // 189
   * before/action/after functions. But if the outer computation causes the                           // 190
   * entire chain of functions to run again that's fine.                                              // 191
   */                                                                                                 // 192
  _stopController: function (cb) {                                                                    // 193
    var self = this;                                                                                  // 194
                                                                                                      // 195
    // noop if we're already stopped                                                                  // 196
    if (this.isStopped)                                                                               // 197
      return;                                                                                         // 198
                                                                                                      // 199
    var onStop = function () {                                                                        // 200
      RouteController.__super__._stopController.call(self, cb);                                       // 201
    };                                                                                                // 202
                                                                                                      // 203
    if (this._computation) {                                                                          // 204
      this._computation.stop();                                                                       // 205
      this._computation.onInvalidate(onStop);                                                         // 206
    } else {                                                                                          // 207
      onStop();                                                                                       // 208
    }                                                                                                 // 209
  },                                                                                                  // 210
                                                                                                      // 211
  _run: function () {                                                                                 // 212
    var self = this;                                                                                  // 213
    var layout = self.router._layout;                                                                 // 214
                                                                                                      // 215
    // if we're already running, you can't call run again without                                     // 216
    // calling stop first.                                                                            // 217
    if (self.isRunning)                                                                               // 218
      throw new Error("You called _run without first calling stop");                                  // 219
                                                                                                      // 220
    self.isRunning = true;                                                                            // 221
    self.isStopped = false;                                                                           // 222
                                                                                                      // 223
    var withNoStopsAllowed = function (fn, thisArg) {                                                 // 224
      return function () {                                                                            // 225
        var oldStop = self.stop;                                                                      // 226
                                                                                                      // 227
        self.stop = function () {                                                                     // 228
          if (typeof console !== 'undefined') {                                                       // 229
            console.warn("You called this.stop() inside a hook or your action function but you should use pause() now instead which is the first parameter to the hook function.");
            return;                                                                                   // 231
          }                                                                                           // 232
        };                                                                                            // 233
                                                                                                      // 234
        try {                                                                                         // 235
          return fn.apply(thisArg || this, arguments);                                                // 236
        } finally {                                                                                   // 237
          self.stop = oldStop;                                                                        // 238
        }                                                                                             // 239
      };                                                                                              // 240
    };                                                                                                // 241
                                                                                                      // 242
    Deps.autorun(withNoStopsAllowed(function (c) {                                                    // 243
      // outer most computation is just used to stop inner computations from one                      // 244
      // place. Is stopped when the route is routed away from, which includes                         // 245
      // if an route action redirects away.                                                           // 246
      self._computation = c;                                                                          // 247
                                                                                                      // 248
      Deps.autorun(withNoStopsAllowed(function (onRunComp) {                                          // 249
        if (!self.router._hasJustReloaded && c.firstRun && onRunComp.firstRun)                        // 250
          self.runHooks('onRun');                                                                     // 251
        self.router._hasJustReloaded = false;                                                         // 252
      }));                                                                                            // 253
                                                                                                      // 254
      Deps.autorun(function (c) {                                                                     // 255
        // waitOn                                                                                     // 256
        var waitOnList = self.lookupWaitOn();                                                         // 257
        var waitOn = _.flatten(_.map(waitOnList, function (fnOrHandle) {                              // 258
          return _.isFunction(fnOrHandle) ? fnOrHandle.call(self) : fnOrHandle;                       // 259
        }));                                                                                          // 260
                                                                                                      // 261
        log('waitOn');                                                                                // 262
                                                                                                      // 263
        self.wait(waitOn);                                                                            // 264
      });                                                                                             // 265
                                                                                                      // 266
      Deps.autorun(function (c) {                                                                     // 267
        // if we're already in a renderig transaction we want to cancel the                           // 268
        // transaction. So the previous afterFlush callback should just be a                          // 269
        // noop, and the new afterflush callback should do what's required. But                       // 270
        // we need to keep a stack of these                                                           // 271
        self.router._layout.beginRendering(function onCompleteRenderingTransaction (usedRegions) {    // 272
          if (self.isStopped)                                                                         // 273
            return;                                                                                   // 274
          var allRegions = layout.regionKeys();                                                       // 275
          var unusedRegions = _.difference(allRegions, usedRegions);                                  // 276
          _.each(unusedRegions, function (r) { layout.clear(r); });                                   // 277
        });                                                                                           // 278
                                                                                                      // 279
        // action                                                                                     // 280
        var action = _.isFunction(self.action) ? self.action : self[self.action];                     // 281
        Utils.assert(action,                                                                          // 282
          "You don't have an action named \"" + self.action + "\" defined on your RouteController");  // 283
                                                                                                      // 284
        // Set layout to configured layoutTemplate                                                    // 285
        self.layout(self.lookupLayoutTemplate(), {                                                    // 286
          data: self.lookupProperty('data')                                                           // 287
        });                                                                                           // 288
                                                                                                      // 289
        self.runHooks('onBeforeAction', [], function (paused) {                                       // 290
          if (self.isStopped)                                                                         // 291
            return;                                                                                   // 292
                                                                                                      // 293
          if (!paused) {                                                                              // 294
            action.call(self);                                                                        // 295
                                                                                                      // 296
            if (!self.isStopped) {                                                                    // 297
              self.runHooks('onAfterAction');                                                         // 298
            }                                                                                         // 299
          }                                                                                           // 300
        });                                                                                           // 301
      });                                                                                             // 302
    }));                                                                                              // 303
  }                                                                                                   // 304
});                                                                                                   // 305
                                                                                                      // 306
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 2282
                                                                                                             // 2283
}).call(this);                                                                                               // 2284
                                                                                                             // 2285
                                                                                                             // 2286
                                                                                                             // 2287
                                                                                                             // 2288
                                                                                                             // 2289
                                                                                                             // 2290
(function () {                                                                                               // 2291
                                                                                                             // 2292
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 2293
//                                                                                                    //     // 2294
// packages/iron:router/lib/client/ui/helpers.js                                                      //     // 2295
//                                                                                                    //     // 2296
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 2297
                                                                                                      //     // 2298
Router.helpers = {};                                                                                  // 1   // 2299
                                                                                                      // 2   // 2300
var getData = function (thisArg) {                                                                    // 3   // 2301
  return thisArg === window ? {} : thisArg;                                                           // 4   // 2302
};                                                                                                    // 5   // 2303
                                                                                                      // 6   // 2304
var processPathArgs = function (routeName, options) {                                                 // 7   // 2305
  if (_.isObject(routeName)) {                                                                        // 8   // 2306
    options = routeName;                                                                              // 9   // 2307
    routeName = options.route;                                                                        // 10  // 2308
  }                                                                                                   // 11  // 2309
                                                                                                      // 12  // 2310
  var opts = options.hash || {};                                                                      // 13  // 2311
  var params = opts.params || _.omit(opts, 'hash', 'query');                                          // 14  // 2312
  var hash = opts.hash;                                                                               // 15  // 2313
  var query = opts.query;                                                                             // 16  // 2314
                                                                                                      // 17  // 2315
  // if called without opts, use the data context of the parent                                       // 18  // 2316
  if (_.isEmpty(opts))                                                                                // 19  // 2317
    params = getData(this);                                                                           // 20  // 2318
                                                                                                      // 21  // 2319
  return {                                                                                            // 22  // 2320
    routeName: routeName,                                                                             // 23  // 2321
    params: params,                                                                                   // 24  // 2322
    query: query,                                                                                     // 25  // 2323
    hash: hash                                                                                        // 26  // 2324
  };                                                                                                  // 27  // 2325
};                                                                                                    // 28  // 2326
                                                                                                      // 29  // 2327
_.extend(Router.helpers, {                                                                            // 30  // 2328
                                                                                                      // 31  // 2329
  /**                                                                                                 // 32  // 2330
   * Example Use:                                                                                     // 33  // 2331
   *                                                                                                  // 34  // 2332
   *  {{pathFor 'items' params=this}}                                                                 // 35  // 2333
   *  {{pathFor 'items' id=5 query="view=all" hash="somehash"}}                                       // 36  // 2334
   *  {{pathFor route='items' id=5 query="view=all" hash="somehash"}}                                 // 37  // 2335
   */                                                                                                 // 38  // 2336
                                                                                                      // 39  // 2337
  pathFor: function (routeName, options) {                                                            // 40  // 2338
    var args = processPathArgs.call(this, routeName, options);                                        // 41  // 2339
                                                                                                      // 42  // 2340
    return Router.path(args.routeName, args.params, {                                                 // 43  // 2341
      query: args.query,                                                                              // 44  // 2342
      hash: args.hash                                                                                 // 45  // 2343
    });                                                                                               // 46  // 2344
  },                                                                                                  // 47  // 2345
                                                                                                      // 48  // 2346
  /**                                                                                                 // 49  // 2347
   * Same as pathFor but returns entire aboslute url.                                                 // 50  // 2348
   *                                                                                                  // 51  // 2349
   */                                                                                                 // 52  // 2350
  urlFor: function (routeName, options) {                                                             // 53  // 2351
    var args = processPathArgs.call(this, routeName, options);                                        // 54  // 2352
                                                                                                      // 55  // 2353
    return Router.url(args.routeName, args.params, {                                                  // 56  // 2354
      query: args.query,                                                                              // 57  // 2355
      hash: args.hash                                                                                 // 58  // 2356
    });                                                                                               // 59  // 2357
  }                                                                                                   // 60  // 2358
});                                                                                                   // 61  // 2359
                                                                                                      // 62  // 2360
_.each(Router.helpers, function (helper, name) {                                                      // 63  // 2361
  UI.registerHelper(name, helper);                                                                    // 64  // 2362
});                                                                                                   // 65  // 2363
                                                                                                      // 66  // 2364
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 2365
                                                                                                             // 2366
}).call(this);                                                                                               // 2367
                                                                                                             // 2368
                                                                                                             // 2369
                                                                                                             // 2370
                                                                                                             // 2371
                                                                                                             // 2372
                                                                                                             // 2373
(function () {                                                                                               // 2374
                                                                                                             // 2375
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 2376
//                                                                                                    //     // 2377
// packages/iron:router/lib/version_conflict_error.js                                                 //     // 2378
//                                                                                                    //     // 2379
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 2380
                                                                                                      //     // 2381
if (Package['cmather:iron-router']) {                                                                 // 1   // 2382
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
  ");                                                                                                 // 17  // 2398
}                                                                                                     // 18  // 2399
                                                                                                      // 19  // 2400
////////////////////////////////////////////////////////////////////////////////////////////////////////     // 2401
                                                                                                             // 2402
}).call(this);                                                                                               // 2403
                                                                                                             // 2404
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:router'] = {
  RouteController: RouteController,
  Route: Route,
  Router: Router,
  IronLocation: IronLocation,
  Utils: Utils,
  IronRouter: IronRouter,
  WaitList: WaitList
};

})();
