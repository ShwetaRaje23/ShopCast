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
var _ = Package.underscore._;
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var Accounts = Package['accounts-base'].Accounts;
var AccountsClient = Package['accounts-base'].AccountsClient;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/accounts-oauth/oauth_common.js                                                      //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
Accounts.oauth = {};                                                                            // 1
                                                                                                // 2
var services = {};                                                                              // 3
                                                                                                // 4
// Helper for registering OAuth based accounts packages.                                        // 5
// On the server, adds an index to the user collection.                                         // 6
Accounts.oauth.registerService = function (name) {                                              // 7
  if (_.has(services, name))                                                                    // 8
    throw new Error("Duplicate service: " + name);                                              // 9
  services[name] = true;                                                                        // 10
                                                                                                // 11
  if (Meteor.server) {                                                                          // 12
    // Accounts.updateOrCreateUserFromExternalService does a lookup by this id,                 // 13
    // so this should be a unique index. You might want to add indexes for other                // 14
    // fields returned by your service (eg services.github.login) but you can do                // 15
    // that in your app.                                                                        // 16
    Meteor.users._ensureIndex('services.' + name + '.id',                                       // 17
                              {unique: 1, sparse: 1});                                          // 18
  }                                                                                             // 19
};                                                                                              // 20
                                                                                                // 21
// Removes a previously registered service.                                                     // 22
// This will disable logging in with this service, and serviceNames() will not                  // 23
// contain it.                                                                                  // 24
// It's worth noting that already logged in users will remain logged in unless                  // 25
// you manually expire their sessions.                                                          // 26
Accounts.oauth.unregisterService = function (name) {                                            // 27
  if (!_.has(services, name))                                                                   // 28
    throw new Error("Service not found: " + name);                                              // 29
  delete services[name];                                                                        // 30
};                                                                                              // 31
                                                                                                // 32
Accounts.oauth.serviceNames = function () {                                                     // 33
  return _.keys(services);                                                                      // 34
};                                                                                              // 35
                                                                                                // 36
//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/accounts-oauth/oauth_client.js                                                      //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
// Documentation for Meteor.loginWithExternalService                                            // 1
                                                                                                // 2
/**                                                                                             // 3
 * @name loginWith<ExternalService>                                                             // 4
 * @memberOf Meteor                                                                             // 5
 * @function                                                                                    // 6
 * @summary Log the user in using an external service.                                          // 7
 * @locus Client                                                                                // 8
 * @param {Object} [options]                                                                    // 9
 * @param {String[]} options.requestPermissions A list of permissions to request from the user.
 * @param {Boolean} options.requestOfflineToken If true, asks the user for permission to act on their behalf when offline. This stores an additional offline token in the `services` field of the user document. Currently only supported with Google.
 * @param {Object} options.loginUrlParameters Provide additional parameters to the authentication uri. Currently only supported with Google {@url https://developers.google.com/identity/protocols/OpenIDConnect#authenticationuriparameters}.
 * @param {String} options.loginHint An email address that the external service will use to pre-fill the login prompt. Currently only supported with Meteor developer accounts and Google accounts. If used with Google, the Google User ID can also be passed.
 * @param {String} options.loginStyle Login style ("popup" or "redirect", defaults to the login service configuration).  The "popup" style opens the login page in a separate popup window, which is generally preferred because the Meteor application doesn't need to be reloaded.  The "redirect" style redirects the Meteor application's window to the login page, and the login service provider redirects back to the Meteor application which is then reloaded.  The "redirect" style can be used in situations where a popup window can't be opened, such as in a mobile UIWebView.  The "redirect" style however relies on session storage which isn't available in Safari private mode, so the "popup" style will be forced if session storage can't be used.
 * @param {String} options.redirectUrl If using "redirect" login style, the user will be returned to this URL after authorisation has been completed.
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure. The callback cannot be called if you are using the "redirect" `loginStyle`, because the app will have reloaded in the meantime; try using [client-side login hooks](#accounts_onlogin) instead.
 */                                                                                             // 17
                                                                                                // 18
// Allow server to specify a specify subclass of errors. We should come                         // 19
// up with a more generic way to do this!                                                       // 20
var convertError = function (err) {                                                             // 21
  if (err && err instanceof Meteor.Error &&                                                     // 22
      err.error === Accounts.LoginCancelledError.numericError)                                  // 23
    return new Accounts.LoginCancelledError(err.reason);                                        // 24
  else                                                                                          // 25
    return err;                                                                                 // 26
};                                                                                              // 27
                                                                                                // 28
                                                                                                // 29
// For the redirect login flow, the final step is that we're                                    // 30
// redirected back to the application.  The credentialToken for this                            // 31
// login attempt is stored in the reload migration data, and the                                // 32
// credentialSecret for a successful login is stored in session                                 // 33
// storage.                                                                                     // 34
                                                                                                // 35
Meteor.startup(function () {                                                                    // 36
  var oauth = OAuth.getDataAfterRedirect();                                                     // 37
  if (! oauth)                                                                                  // 38
    return;                                                                                     // 39
                                                                                                // 40
  // We'll only have the credentialSecret if the login completed                                // 41
  // successfully.  However we still call the login method anyway to                            // 42
  // retrieve the error if the login was unsuccessful.                                          // 43
                                                                                                // 44
  var methodName = 'login';                                                                     // 45
  var methodArguments = [{oauth: _.pick(oauth, 'credentialToken', 'credentialSecret')}];        // 46
                                                                                                // 47
  Accounts.callLoginMethod({                                                                    // 48
    methodArguments: methodArguments,                                                           // 49
    userCallback: function (err) {                                                              // 50
      // The redirect login flow is complete.  Construct an                                     // 51
      // `attemptInfo` object with the login result, and report back                            // 52
      // to the code which initiated the login attempt                                          // 53
      // (e.g. accounts-ui, when that package is being used).                                   // 54
      err = convertError(err);                                                                  // 55
      Accounts._pageLoadLogin({                                                                 // 56
        type: oauth.loginService,                                                               // 57
        allowed: !err,                                                                          // 58
        error: err,                                                                             // 59
        methodName: methodName,                                                                 // 60
        methodArguments: methodArguments                                                        // 61
      });                                                                                       // 62
    }                                                                                           // 63
  });                                                                                           // 64
});                                                                                             // 65
                                                                                                // 66
                                                                                                // 67
// Send an OAuth login method to the server. If the user authorized                             // 68
// access in the popup this should log the user in, otherwise                                   // 69
// nothing should happen.                                                                       // 70
Accounts.oauth.tryLoginAfterPopupClosed = function(credentialToken, callback) {                 // 71
  var credentialSecret = OAuth._retrieveCredentialSecret(credentialToken) || null;              // 72
  Accounts.callLoginMethod({                                                                    // 73
    methodArguments: [{oauth: {                                                                 // 74
      credentialToken: credentialToken,                                                         // 75
      credentialSecret: credentialSecret                                                        // 76
    }}],                                                                                        // 77
    userCallback: callback && function (err) {                                                  // 78
      callback(convertError(err));                                                              // 79
    }});                                                                                        // 80
};                                                                                              // 81
                                                                                                // 82
Accounts.oauth.credentialRequestCompleteHandler = function(callback) {                          // 83
  return function (credentialTokenOrError) {                                                    // 84
    if(credentialTokenOrError && credentialTokenOrError instanceof Error) {                     // 85
      callback && callback(credentialTokenOrError);                                             // 86
    } else {                                                                                    // 87
      Accounts.oauth.tryLoginAfterPopupClosed(credentialTokenOrError, callback);                // 88
    }                                                                                           // 89
  };                                                                                            // 90
};                                                                                              // 91
                                                                                                // 92
//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-oauth'] = {};

})();
