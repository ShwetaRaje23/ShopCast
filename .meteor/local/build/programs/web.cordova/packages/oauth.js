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
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var Reload = Package.reload.Reload;
var Base64 = Package.base64.Base64;
var URL = Package.url.URL;

/* Package-scope variables */
var OAuth, Oauth;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/oauth/oauth_client.js                                                       //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
// credentialToken -> credentialSecret. You must provide both the                       // 1
// credentialToken and the credentialSecret to retrieve an access token from            // 2
// the _pendingCredentials collection.                                                  // 3
var credentialSecrets = {};                                                             // 4
                                                                                        // 5
OAuth = {};                                                                             // 6
                                                                                        // 7
OAuth.showPopup = function (url, callback, dimensions) {                                // 8
  throw new Error("OAuth.showPopup must be implemented on this arch.");                 // 9
};                                                                                      // 10
                                                                                        // 11
// Determine the login style (popup or redirect) for this login flow.                   // 12
//                                                                                      // 13
//                                                                                      // 14
OAuth._loginStyle = function (service, config, options) {                               // 15
                                                                                        // 16
  if (Meteor.isCordova) {                                                               // 17
    return "popup";                                                                     // 18
  }                                                                                     // 19
                                                                                        // 20
  var loginStyle = (options && options.loginStyle) || config.loginStyle || 'popup';     // 21
                                                                                        // 22
  if (! _.contains(["popup", "redirect"], loginStyle))                                  // 23
    throw new Error("Invalid login style: " + loginStyle);                              // 24
                                                                                        // 25
  // If we don't have session storage (for example, Safari in private                   // 26
  // mode), the redirect login flow won't work, so fallback to the                      // 27
  // popup style.                                                                       // 28
  if (loginStyle === 'redirect') {                                                      // 29
    try {                                                                               // 30
      sessionStorage.setItem('Meteor.oauth.test', 'test');                              // 31
      sessionStorage.removeItem('Meteor.oauth.test');                                   // 32
    } catch (e) {                                                                       // 33
      loginStyle = 'popup';                                                             // 34
    }                                                                                   // 35
  }                                                                                     // 36
                                                                                        // 37
  return loginStyle;                                                                    // 38
};                                                                                      // 39
                                                                                        // 40
OAuth._stateParam = function (loginStyle, credentialToken, redirectUrl) {               // 41
  var state = {                                                                         // 42
    loginStyle: loginStyle,                                                             // 43
    credentialToken: credentialToken,                                                   // 44
    isCordova: Meteor.isCordova                                                         // 45
  };                                                                                    // 46
                                                                                        // 47
  if (loginStyle === 'redirect')                                                        // 48
    state.redirectUrl = redirectUrl || ('' + window.location);                          // 49
                                                                                        // 50
  // Encode base64 as not all login services URI-encode the state                       // 51
  // parameter when they pass it back to us.                                            // 52
  // Use the 'base64' package here because 'btoa' isn't supported in IE8/9.             // 53
  return Base64.encode(JSON.stringify(state));                                          // 54
};                                                                                      // 55
                                                                                        // 56
                                                                                        // 57
// At the beginning of the redirect login flow, before we redirect to                   // 58
// the login service, save the credential token for this login attempt                  // 59
// in the reload migration data.                                                        // 60
//                                                                                      // 61
OAuth.saveDataForRedirect = function (loginService, credentialToken) {                  // 62
  Reload._onMigrate('oauth', function () {                                              // 63
    return [true, {loginService: loginService, credentialToken: credentialToken}];      // 64
  });                                                                                   // 65
  Reload._migrate(null, {immediateMigration: true});                                    // 66
};                                                                                      // 67
                                                                                        // 68
// At the end of the redirect login flow, when we've redirected back                    // 69
// to the application, retrieve the credentialToken and (if the login                   // 70
// was successful) the credentialSecret.                                                // 71
//                                                                                      // 72
// Called at application startup.  Returns null if this is normal                       // 73
// application startup and we weren't just redirected at the end of                     // 74
// the login flow.                                                                      // 75
//                                                                                      // 76
OAuth.getDataAfterRedirect = function () {                                              // 77
  var migrationData = Reload._migrationData('oauth');                                   // 78
                                                                                        // 79
  if (! (migrationData && migrationData.credentialToken))                               // 80
    return null;                                                                        // 81
                                                                                        // 82
  var credentialToken = migrationData.credentialToken;                                  // 83
  var key = OAuth._storageTokenPrefix + credentialToken;                                // 84
  var credentialSecret;                                                                 // 85
  try {                                                                                 // 86
    credentialSecret = sessionStorage.getItem(key);                                     // 87
    sessionStorage.removeItem(key);                                                     // 88
  } catch (e) {                                                                         // 89
    Meteor._debug('error retrieving credentialSecret', e);                              // 90
  }                                                                                     // 91
  return {                                                                              // 92
    loginService: migrationData.loginService,                                           // 93
    credentialToken: credentialToken,                                                   // 94
    credentialSecret: credentialSecret                                                  // 95
  };                                                                                    // 96
};                                                                                      // 97
                                                                                        // 98
// Launch an OAuth login flow.  For the popup login style, show the                     // 99
// popup.  For the redirect login style, save the credential token for                  // 100
// this login attempt in the reload migration data, and redirect to                     // 101
// the service for the login.                                                           // 102
//                                                                                      // 103
// options:                                                                             // 104
//  loginService: "facebook", "google", etc.                                            // 105
//  loginStyle: "popup" or "redirect"                                                   // 106
//  loginUrl: The URL at the login service provider to start the OAuth flow.            // 107
//  credentialRequestCompleteCallback: for the popup flow, call when the popup          // 108
//    is closed and we have the credential from the login service.                      // 109
//  credentialToken: our identifier for this login flow.                                // 110
//                                                                                      // 111
OAuth.launchLogin = function (options) {                                                // 112
  if (! options.loginService)                                                           // 113
    throw new Error('loginService required');                                           // 114
  if (options.loginStyle === 'popup') {                                                 // 115
    OAuth.showPopup(                                                                    // 116
      options.loginUrl,                                                                 // 117
      _.bind(options.credentialRequestCompleteCallback, null, options.credentialToken),
      options.popupOptions);                                                            // 119
  } else if (options.loginStyle === 'redirect') {                                       // 120
    OAuth.saveDataForRedirect(options.loginService, options.credentialToken);           // 121
    window.location = options.loginUrl;                                                 // 122
  } else {                                                                              // 123
    throw new Error('invalid login style');                                             // 124
  }                                                                                     // 125
};                                                                                      // 126
                                                                                        // 127
// XXX COMPAT WITH 0.7.0.1                                                              // 128
// Private interface but probably used by many oauth clients in atmosphere.             // 129
OAuth.initiateLogin = function (credentialToken, url, callback, dimensions) {           // 130
  OAuth.showPopup(                                                                      // 131
    url,                                                                                // 132
    _.bind(callback, null, credentialToken),                                            // 133
    dimensions                                                                          // 134
  );                                                                                    // 135
};                                                                                      // 136
                                                                                        // 137
// Called by the popup when the OAuth flow is completed, right before                   // 138
// the popup closes.                                                                    // 139
OAuth._handleCredentialSecret = function (credentialToken, secret) {                    // 140
  check(credentialToken, String);                                                       // 141
  check(secret, String);                                                                // 142
  if (! _.has(credentialSecrets,credentialToken)) {                                     // 143
    credentialSecrets[credentialToken] = secret;                                        // 144
  } else {                                                                              // 145
    throw new Error("Duplicate credential token from OAuth login");                     // 146
  }                                                                                     // 147
};                                                                                      // 148
                                                                                        // 149
// Used by accounts-oauth, which needs both a credentialToken and the                   // 150
// corresponding to credential secret to call the `login` method over DDP.              // 151
OAuth._retrieveCredentialSecret = function (credentialToken) {                          // 152
  // First check the secrets collected by OAuth._handleCredentialSecret,                // 153
  // then check localStorage. This matches what we do in                                // 154
  // end_of_login_response.html.                                                        // 155
  var secret = credentialSecrets[credentialToken];                                      // 156
  if (! secret) {                                                                       // 157
    var localStorageKey = OAuth._storageTokenPrefix + credentialToken;                  // 158
    secret = Meteor._localStorage.getItem(localStorageKey);                             // 159
    Meteor._localStorage.removeItem(localStorageKey);                                   // 160
  } else {                                                                              // 161
    delete credentialSecrets[credentialToken];                                          // 162
  }                                                                                     // 163
  return secret;                                                                        // 164
};                                                                                      // 165
                                                                                        // 166
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/oauth/oauth_cordova.js                                                      //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
// Cordova specific code for the OAuth package.                                         // 1
                                                                                        // 2
// Open a popup window, centered on the screen, and call a callback when it             // 3
// closes.                                                                              // 4
//                                                                                      // 5
// @param url {String} url to show                                                      // 6
// @param callback {Function} Callback function to call on completion. Takes no         // 7
//   arguments.                                                                         // 8
// @param dimensions {optional Object(width, height)} The dimensions of                 // 9
//   the popup. If not passed defaults to something sane.                               // 10
OAuth.showPopup = function (url, callback, dimensions) {                                // 11
  var fail = function (err) {                                                           // 12
    Meteor._debug("Error from OAuth popup: " + JSON.stringify(err));                    // 13
  };                                                                                    // 14
                                                                                        // 15
  // When running on an android device, we sometimes see the                            // 16
  // `pageLoaded` callback fire twice for the final page in the OAuth                   // 17
  // popup, even though the page only loads once. This is maybe an                      // 18
  // Android bug or maybe something intentional about how onPageFinished                // 19
  // works that we don't understand and isn't well-documented.                          // 20
  var oauthFinished = false;                                                            // 21
                                                                                        // 22
  var pageLoaded = function (event) {                                                   // 23
    if (oauthFinished) {                                                                // 24
      return;                                                                           // 25
    }                                                                                   // 26
                                                                                        // 27
    if (event.url.indexOf(Meteor.absoluteUrl('_oauth')) === 0) {                        // 28
      var splitUrl = event.url.split("#");                                              // 29
      var hashFragment = splitUrl[1];                                                   // 30
                                                                                        // 31
      if (! hashFragment) {                                                             // 32
        throw new Error("No hash fragment in OAuth popup?");                            // 33
      }                                                                                 // 34
                                                                                        // 35
      var credentials = JSON.parse(decodeURIComponent(hashFragment));                   // 36
      OAuth._handleCredentialSecret(credentials.credentialToken,                        // 37
                                    credentials.credentialSecret);                      // 38
                                                                                        // 39
      oauthFinished = true;                                                             // 40
                                                                                        // 41
      // On iOS, this seems to prevent "Warning: Attempt to dismiss from                // 42
      // view controller <MainViewController: ...> while a presentation                 // 43
      // or dismiss is in progress". My guess is that the last                          // 44
      // navigation of the OAuth popup is still in progress while we try                // 45
      // to close the popup. See                                                        // 46
      // https://issues.apache.org/jira/browse/CB-2285.                                 // 47
      //                                                                                // 48
      // XXX Can we make this timeout smaller?                                          // 49
      setTimeout(function () {                                                          // 50
        popup.close();                                                                  // 51
        callback();                                                                     // 52
      }, 100);                                                                          // 53
    }                                                                                   // 54
  };                                                                                    // 55
                                                                                        // 56
  var onExit = function () {                                                            // 57
    popup.removeEventListener('loadstop', pageLoaded);                                  // 58
    popup.removeEventListener('loaderror', fail);                                       // 59
    popup.removeEventListener('exit', onExit);                                          // 60
  };                                                                                    // 61
                                                                                        // 62
  var popup = window.open(url, '_blank', 'location=yes,hidden=yes');                    // 63
  popup.addEventListener('loadstop', pageLoaded);                                       // 64
  popup.addEventListener('loaderror', fail);                                            // 65
  popup.addEventListener('exit', onExit);                                               // 66
  popup.show();                                                                         // 67
                                                                                        // 68
};                                                                                      // 69
                                                                                        // 70
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/oauth/oauth_common.js                                                       //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
OAuth._storageTokenPrefix = "Meteor.oauth.credentialSecret-";                           // 1
                                                                                        // 2
OAuth._redirectUri = function (serviceName, config, params, absoluteUrlOptions) {       // 3
  // XXX COMPAT WITH 0.9.0                                                              // 4
  // The redirect URI used to have a "?close" query argument.  We                       // 5
  // detect whether we need to be backwards compatible by checking for                  // 6
  // the absence of the `loginStyle` field, which wasn't used in the                    // 7
  // code which had the "?close" argument.                                              // 8
  // This logic is duplicated in the tool so that the tool can do OAuth                 // 9
  // flow with <= 0.9.0 servers (tools/auth.js).                                        // 10
  var query = config.loginStyle ? null : "close";                                       // 11
                                                                                        // 12
  // Clone because we're going to mutate 'params'. The 'cordova' and                    // 13
  // 'android' parameters are only used for picking the host of the                     // 14
  // redirect URL, and not actually included in the redirect URL itself.                // 15
  var isCordova = false;                                                                // 16
  var isAndroid = false;                                                                // 17
  if (params) {                                                                         // 18
    params = _.clone(params);                                                           // 19
    isCordova = params.cordova;                                                         // 20
    isAndroid = params.android;                                                         // 21
    delete params.cordova;                                                              // 22
    delete params.android;                                                              // 23
    if (_.isEmpty(params)) {                                                            // 24
      params = undefined;                                                               // 25
    }                                                                                   // 26
  }                                                                                     // 27
                                                                                        // 28
  if (Meteor.isServer && isCordova) {                                                   // 29
    var rootUrl = process.env.MOBILE_ROOT_URL ||                                        // 30
          __meteor_runtime_config__.ROOT_URL;                                           // 31
                                                                                        // 32
    if (isAndroid) {                                                                    // 33
      // Match the replace that we do in cordova boilerplate                            // 34
      // (boilerplate-generator package).                                               // 35
      // XXX Maybe we should put this in a separate package or something                // 36
      // that is used here and by boilerplate-generator? Or maybe                       // 37
      // `Meteor.absoluteUrl` should know how to do this?                               // 38
      var url = Npm.require("url");                                                     // 39
      var parsedRootUrl = url.parse(rootUrl);                                           // 40
      if (parsedRootUrl.hostname === "localhost") {                                     // 41
        parsedRootUrl.hostname = "10.0.2.2";                                            // 42
        delete parsedRootUrl.host;                                                      // 43
      }                                                                                 // 44
      rootUrl = url.format(parsedRootUrl);                                              // 45
    }                                                                                   // 46
                                                                                        // 47
    absoluteUrlOptions = _.extend({}, absoluteUrlOptions, {                             // 48
      // For Cordova clients, redirect to the special Cordova root url                  // 49
      // (likely a local IP in development mode).                                       // 50
      rootUrl: rootUrl                                                                  // 51
    });                                                                                 // 52
  }                                                                                     // 53
                                                                                        // 54
  return URL._constructUrl(                                                             // 55
    Meteor.absoluteUrl('_oauth/' + serviceName, absoluteUrlOptions),                    // 56
    query,                                                                              // 57
    params);                                                                            // 58
};                                                                                      // 59
                                                                                        // 60
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/oauth/deprecated.js                                                         //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
// XXX COMPAT WITH 0.8.0                                                                // 1
                                                                                        // 2
Oauth = OAuth;                                                                          // 3
                                                                                        // 4
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.oauth = {
  OAuth: OAuth,
  Oauth: Oauth
};

})();
