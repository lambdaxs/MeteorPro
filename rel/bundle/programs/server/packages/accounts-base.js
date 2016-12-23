(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var Hook = Package['callback-hook'].Hook;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Accounts, EXPIRE_TOKENS_INTERVAL_MS, CONNECTION_CLOSE_DELAY_MS;

var require = meteorInstall({"node_modules":{"meteor":{"accounts-base":{"server_main.js":["./accounts_server.js","./accounts_rate_limit.js","./url_server.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-base/server_main.js                                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({AccountsServer:function(){return AccountsServer}});var AccountsServer;module.import("./accounts_server.js",{"AccountsServer":function(v){AccountsServer=v}});module.import("./accounts_rate_limit.js");module.import("./url_server.js");
                                                                                                                   // 2
                                                                                                                   // 3
                                                                                                                   //
/**                                                                                                                // 5
 * @namespace Accounts                                                                                             //
 * @summary The namespace for all server-side accounts-related methods.                                            //
 */                                                                                                                //
Accounts = new AccountsServer(Meteor.server);                                                                      // 9
                                                                                                                   //
// Users table. Don't use the normal autopublish, since we want to hide                                            // 11
// some fields. Code to autopublish this is in accounts_server.js.                                                 // 12
// XXX Allow users to configure this collection name.                                                              // 13
                                                                                                                   //
/**                                                                                                                // 15
 * @summary A [Mongo.Collection](#collections) containing user documents.                                          //
 * @locus Anywhere                                                                                                 //
 * @type {Mongo.Collection}                                                                                        //
 * @importFromPackage meteor                                                                                       //
*/                                                                                                                 //
Meteor.users = Accounts.users;                                                                                     // 21
                                                                                                                   //
                                                                                                                   // 23
                                                                                                                   // 24
                                                                                                                   // 25
                                                                                                                   // 26
                                                                                                                   // 27
                                                                                                                   // 28
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"accounts_common.js":["babel-runtime/helpers/classCallCheck",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-base/accounts_common.js                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({AccountsCommon:function(){return AccountsCommon}});var _classCallCheck;module.import("babel-runtime/helpers/classCallCheck",{"default":function(v){_classCallCheck=v}});
/**                                                                                                                // 1
 * @summary Super-constructor for AccountsClient and AccountsServer.                                               //
 * @locus Anywhere                                                                                                 //
 * @class AccountsCommon                                                                                           //
 * @instancename accountsClientOrServer                                                                            //
 * @param options {Object} an object with fields:                                                                  //
 * - connection {Object} Optional DDP connection to reuse.                                                         //
 * - ddpUrl {String} Optional URL for creating a new DDP connection.                                               //
 */                                                                                                                //
var AccountsCommon = function () {                                                                                 // 10
  function AccountsCommon(options) {                                                                               // 11
    _classCallCheck(this, AccountsCommon);                                                                         // 11
                                                                                                                   //
    // Currently this is read directly by packages like accounts-password                                          // 12
    // and accounts-ui-unstyled.                                                                                   // 13
    this._options = {};                                                                                            // 14
                                                                                                                   //
    // Note that setting this.connection = null causes this.users to be a                                          // 16
    // LocalCollection, which is not what we want.                                                                 // 17
    this.connection = undefined;                                                                                   // 18
    this._initConnection(options || {});                                                                           // 19
                                                                                                                   //
    // There is an allow call in accounts_server.js that restricts writes to                                       // 21
    // this collection.                                                                                            // 22
    this.users = new Mongo.Collection("users", {                                                                   // 23
      _preventAutopublish: true,                                                                                   // 24
      connection: this.connection                                                                                  // 25
    });                                                                                                            // 23
                                                                                                                   //
    // Callback exceptions are printed with Meteor._debug and ignored.                                             // 28
    this._onLoginHook = new Hook({                                                                                 // 29
      bindEnvironment: false,                                                                                      // 30
      debugPrintExceptions: "onLogin callback"                                                                     // 31
    });                                                                                                            // 29
                                                                                                                   //
    this._onLoginFailureHook = new Hook({                                                                          // 34
      bindEnvironment: false,                                                                                      // 35
      debugPrintExceptions: "onLoginFailure callback"                                                              // 36
    });                                                                                                            // 34
  }                                                                                                                // 38
                                                                                                                   //
  /**                                                                                                              // 40
   * @summary Get the current user id, or `null` if no user is logged in. A reactive data source.                  //
   * @locus Anywhere but publish functions                                                                         //
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsCommon.prototype.userId = function () {                                                                  // 10
    function userId() {                                                                                            // 10
      throw new Error("userId method not implemented");                                                            // 45
    }                                                                                                              // 46
                                                                                                                   //
    return userId;                                                                                                 // 10
  }();                                                                                                             // 10
                                                                                                                   //
  /**                                                                                                              // 48
   * @summary Get the current user record, or `null` if no user is logged in. A reactive data source.              //
   * @locus Anywhere but publish functions                                                                         //
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsCommon.prototype.user = function () {                                                                    // 10
    function user() {                                                                                              // 10
      var userId = this.userId();                                                                                  // 53
      return userId ? this.users.findOne(userId) : null;                                                           // 54
    }                                                                                                              // 55
                                                                                                                   //
    return user;                                                                                                   // 10
  }();                                                                                                             // 10
                                                                                                                   //
  // Set up config for the accounts system. Call this on both the client                                           // 57
  // and the server.                                                                                               // 58
  //                                                                                                               // 59
  // Note that this method gets overridden on AccountsServer.prototype, but                                        // 60
  // the overriding method calls the overridden method.                                                            // 61
  //                                                                                                               // 62
  // XXX we should add some enforcement that this is called on both the                                            // 63
  // client and the server. Otherwise, a user can                                                                  // 64
  // 'forbidClientAccountCreation' only on the client and while it looks                                           // 65
  // like their app is secure, the server will still accept createUser                                             // 66
  // calls. https://github.com/meteor/meteor/issues/828                                                            // 67
  //                                                                                                               // 68
  // @param options {Object} an object with fields:                                                                // 69
  // - sendVerificationEmail {Boolean}                                                                             // 70
  //     Send email address verification emails to new users created from                                          // 71
  //     client signups.                                                                                           // 72
  // - forbidClientAccountCreation {Boolean}                                                                       // 73
  //     Do not allow clients to create accounts directly.                                                         // 74
  // - restrictCreationByEmailDomain {Function or String}                                                          // 75
  //     Require created users to have an email matching the function or                                           // 76
  //     having the string as domain.                                                                              // 77
  // - loginExpirationInDays {Number}                                                                              // 78
  //     Number of days since login until a user is logged out (login token                                        // 79
  //     expires).                                                                                                 // 80
                                                                                                                   //
  /**                                                                                                              // 82
   * @summary Set global accounts options.                                                                         //
   * @locus Anywhere                                                                                               //
   * @param {Object} options                                                                                       //
   * @param {Boolean} options.sendVerificationEmail New users with an email address will receive an address verification email.
   * @param {Boolean} options.forbidClientAccountCreation Calls to [`createUser`](#accounts_createuser) from the client will be rejected. In addition, if you are using [accounts-ui](#accountsui), the "Create account" link will not be available.
   * @param {String | Function} options.restrictCreationByEmailDomain If set to a string, only allows new users if the domain part of their email address matches the string. If set to a function, only allows new users if the function returns true.  The function is passed the full email address of the proposed new user.  Works with password-based sign-in and external services that expose email addresses (Google, Facebook, GitHub). All existing users still can log in after enabling this option. Example: `Accounts.config({ restrictCreationByEmailDomain: 'school.edu' })`.
   * @param {Number} options.loginExpirationInDays The number of days from when a user logs in until their token expires and they are logged out. Defaults to 90. Set to `null` to disable login expiration.
   * @param {String} options.oauthSecretKey When using the `oauth-encryption` package, the 16 byte key using to encrypt sensitive account credentials in the database, encoded in base64.  This option may only be specifed on the server.  See packages/oauth-encryption/README.md for details.
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsCommon.prototype.config = function () {                                                                  // 10
    function config(options) {                                                                                     // 10
      var self = this;                                                                                             // 93
                                                                                                                   //
      // We don't want users to accidentally only call Accounts.config on the                                      // 95
      // client, where some of the options will have partial effects (eg removing                                  // 96
      // the "create account" button from accounts-ui if forbidClientAccountCreation                               // 97
      // is set, or redirecting Google login to a specific-domain page) without                                    // 98
      // having their full effects.                                                                                // 99
      if (Meteor.isServer) {                                                                                       // 100
        __meteor_runtime_config__.accountsConfigCalled = true;                                                     // 101
      } else if (!__meteor_runtime_config__.accountsConfigCalled) {                                                // 102
        // XXX would be nice to "crash" the client and replace the UI with an error                                // 103
        // message, but there's no trivial way to do this.                                                         // 104
        Meteor._debug("Accounts.config was called on the client but not on the " + "server; some configuration options may not take effect.");
      }                                                                                                            // 107
                                                                                                                   //
      // We need to validate the oauthSecretKey option at the time                                                 // 109
      // Accounts.config is called. We also deliberately don't store the                                           // 110
      // oauthSecretKey in Accounts._options.                                                                      // 111
      if (_.has(options, "oauthSecretKey")) {                                                                      // 112
        if (Meteor.isClient) throw new Error("The oauthSecretKey option may only be specified on the server");     // 113
        if (!Package["oauth-encryption"]) throw new Error("The oauth-encryption package must be loaded to set oauthSecretKey");
        Package["oauth-encryption"].OAuthEncryption.loadKey(options.oauthSecretKey);                               // 117
        options = _.omit(options, "oauthSecretKey");                                                               // 118
      }                                                                                                            // 119
                                                                                                                   //
      // validate option keys                                                                                      // 121
      var VALID_KEYS = ["sendVerificationEmail", "forbidClientAccountCreation", "restrictCreationByEmailDomain", "loginExpirationInDays"];
      _.each(_.keys(options), function (key) {                                                                     // 124
        if (!_.contains(VALID_KEYS, key)) {                                                                        // 125
          throw new Error("Accounts.config: Invalid key: " + key);                                                 // 126
        }                                                                                                          // 127
      });                                                                                                          // 128
                                                                                                                   //
      // set values in Accounts._options                                                                           // 130
      _.each(VALID_KEYS, function (key) {                                                                          // 131
        if (key in options) {                                                                                      // 132
          if (key in self._options) {                                                                              // 133
            throw new Error("Can't set `" + key + "` more than once");                                             // 134
          }                                                                                                        // 135
          self._options[key] = options[key];                                                                       // 136
        }                                                                                                          // 137
      });                                                                                                          // 138
    }                                                                                                              // 139
                                                                                                                   //
    return config;                                                                                                 // 10
  }();                                                                                                             // 10
                                                                                                                   //
  /**                                                                                                              // 141
   * @summary Register a callback to be called after a login attempt succeeds.                                     //
   * @locus Anywhere                                                                                               //
   * @param {Function} func The callback to be called when login is successful.                                    //
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsCommon.prototype.onLogin = function () {                                                                 // 10
    function onLogin(func) {                                                                                       // 10
      return this._onLoginHook.register(func);                                                                     // 147
    }                                                                                                              // 148
                                                                                                                   //
    return onLogin;                                                                                                // 10
  }();                                                                                                             // 10
                                                                                                                   //
  /**                                                                                                              // 150
   * @summary Register a callback to be called after a login attempt fails.                                        //
   * @locus Anywhere                                                                                               //
   * @param {Function} func The callback to be called after the login has failed.                                  //
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsCommon.prototype.onLoginFailure = function () {                                                          // 10
    function onLoginFailure(func) {                                                                                // 10
      return this._onLoginFailureHook.register(func);                                                              // 156
    }                                                                                                              // 157
                                                                                                                   //
    return onLoginFailure;                                                                                         // 10
  }();                                                                                                             // 10
                                                                                                                   //
  AccountsCommon.prototype._initConnection = function () {                                                         // 10
    function _initConnection(options) {                                                                            // 10
      if (!Meteor.isClient) {                                                                                      // 160
        return;                                                                                                    // 161
      }                                                                                                            // 162
                                                                                                                   //
      // The connection used by the Accounts system. This is the connection                                        // 164
      // that will get logged in by Meteor.login(), and this is the                                                // 165
      // connection whose login state will be reflected by Meteor.userId().                                        // 166
      //                                                                                                           // 167
      // It would be much preferable for this to be in accounts_client.js,                                         // 168
      // but it has to be here because it's needed to create the                                                   // 169
      // Meteor.users collection.                                                                                  // 170
                                                                                                                   //
      if (options.connection) {                                                                                    // 172
        this.connection = options.connection;                                                                      // 173
      } else if (options.ddpUrl) {                                                                                 // 174
        this.connection = DDP.connect(options.ddpUrl);                                                             // 175
      } else if (typeof __meteor_runtime_config__ !== "undefined" && __meteor_runtime_config__.ACCOUNTS_CONNECTION_URL) {
        // Temporary, internal hook to allow the server to point the client                                        // 178
        // to a different authentication server. This is for a very                                                // 179
        // particular use case that comes up when implementing a oauth                                             // 180
        // server. Unsupported and may go away at any point in time.                                               // 181
        //                                                                                                         // 182
        // We will eventually provide a general way to use account-base                                            // 183
        // against any DDP connection, not just one special one.                                                   // 184
        this.connection = DDP.connect(__meteor_runtime_config__.ACCOUNTS_CONNECTION_URL);                          // 185
      } else {                                                                                                     // 187
        this.connection = Meteor.connection;                                                                       // 188
      }                                                                                                            // 189
    }                                                                                                              // 190
                                                                                                                   //
    return _initConnection;                                                                                        // 10
  }();                                                                                                             // 10
                                                                                                                   //
  AccountsCommon.prototype._getTokenLifetimeMs = function () {                                                     // 10
    function _getTokenLifetimeMs() {                                                                               // 10
      return (this._options.loginExpirationInDays || DEFAULT_LOGIN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000;         // 193
    }                                                                                                              // 195
                                                                                                                   //
    return _getTokenLifetimeMs;                                                                                    // 10
  }();                                                                                                             // 10
                                                                                                                   //
  AccountsCommon.prototype._tokenExpiration = function () {                                                        // 10
    function _tokenExpiration(when) {                                                                              // 10
      // We pass when through the Date constructor for backwards compatibility;                                    // 198
      // `when` used to be a number.                                                                               // 199
      return new Date(new Date(when).getTime() + this._getTokenLifetimeMs());                                      // 200
    }                                                                                                              // 201
                                                                                                                   //
    return _tokenExpiration;                                                                                       // 10
  }();                                                                                                             // 10
                                                                                                                   //
  AccountsCommon.prototype._tokenExpiresSoon = function () {                                                       // 10
    function _tokenExpiresSoon(when) {                                                                             // 10
      var minLifetimeMs = .1 * this._getTokenLifetimeMs();                                                         // 204
      var minLifetimeCapMs = MIN_TOKEN_LIFETIME_CAP_SECS * 1000;                                                   // 205
      if (minLifetimeMs > minLifetimeCapMs) minLifetimeMs = minLifetimeCapMs;                                      // 206
      return new Date() > new Date(when) - minLifetimeMs;                                                          // 208
    }                                                                                                              // 209
                                                                                                                   //
    return _tokenExpiresSoon;                                                                                      // 10
  }();                                                                                                             // 10
                                                                                                                   //
  return AccountsCommon;                                                                                           // 10
}();                                                                                                               // 10
                                                                                                                   //
var Ap = AccountsCommon.prototype;                                                                                 // 212
                                                                                                                   //
// Note that Accounts is defined separately in accounts_client.js and                                              // 214
// accounts_server.js.                                                                                             // 215
                                                                                                                   //
/**                                                                                                                // 217
 * @summary Get the current user id, or `null` if no user is logged in. A reactive data source.                    //
 * @locus Anywhere but publish functions                                                                           //
 * @importFromPackage meteor                                                                                       //
 */                                                                                                                //
Meteor.userId = function () {                                                                                      // 222
  return Accounts.userId();                                                                                        // 223
};                                                                                                                 // 224
                                                                                                                   //
/**                                                                                                                // 226
 * @summary Get the current user record, or `null` if no user is logged in. A reactive data source.                //
 * @locus Anywhere but publish functions                                                                           //
 * @importFromPackage meteor                                                                                       //
 */                                                                                                                //
Meteor.user = function () {                                                                                        // 231
  return Accounts.user();                                                                                          // 232
};                                                                                                                 // 233
                                                                                                                   //
// how long (in days) until a login token expires                                                                  // 235
var DEFAULT_LOGIN_EXPIRATION_DAYS = 90;                                                                            // 236
// Clients don't try to auto-login with a token that is going to expire within                                     // 237
// .1 * DEFAULT_LOGIN_EXPIRATION_DAYS, capped at MIN_TOKEN_LIFETIME_CAP_SECS.                                      // 238
// Tries to avoid abrupt disconnects from expiring tokens.                                                         // 239
var MIN_TOKEN_LIFETIME_CAP_SECS = 3600; // one hour                                                                // 240
// how often (in milliseconds) we check for expired tokens                                                         // 241
EXPIRE_TOKENS_INTERVAL_MS = 600 * 1000; // 10 minutes                                                              // 242
// how long we wait before logging out clients when Meteor.logoutOtherClients is                                   // 243
// called                                                                                                          // 244
CONNECTION_CLOSE_DELAY_MS = 10 * 1000;                                                                             // 245
                                                                                                                   //
// loginServiceConfiguration and ConfigError are maintained for backwards compatibility                            // 247
Meteor.startup(function () {                                                                                       // 248
  var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;                                // 249
  Ap.loginServiceConfiguration = ServiceConfiguration.configurations;                                              // 251
  Ap.ConfigError = ServiceConfiguration.ConfigError;                                                               // 252
});                                                                                                                // 253
                                                                                                                   //
// Thrown when the user cancels the login process (eg, closes an oauth                                             // 255
// popup, declines retina scan, etc)                                                                               // 256
var lceName = 'Accounts.LoginCancelledError';                                                                      // 257
Ap.LoginCancelledError = Meteor.makeErrorType(lceName, function (description) {                                    // 258
  this.message = description;                                                                                      // 261
});                                                                                                                // 262
Ap.LoginCancelledError.prototype.name = lceName;                                                                   // 264
                                                                                                                   //
// This is used to transmit specific subclass errors over the wire. We should                                      // 266
// come up with a more generic way to do this (eg, with some sort of symbolic                                      // 267
// error code rather than a number).                                                                               // 268
Ap.LoginCancelledError.numericError = 0x8acdc2f;                                                                   // 269
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"accounts_rate_limit.js":["./accounts_common.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-base/accounts_rate_limit.js                                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var AccountsCommon;module.import("./accounts_common.js",{"AccountsCommon":function(v){AccountsCommon=v}});         // 1
                                                                                                                   //
var Ap = AccountsCommon.prototype;                                                                                 // 3
var defaultRateLimiterRuleId;                                                                                      // 4
// Removes default rate limiting rule                                                                              // 5
Ap.removeDefaultRateLimit = function () {                                                                          // 6
  var resp = DDPRateLimiter.removeRule(defaultRateLimiterRuleId);                                                  // 7
  defaultRateLimiterRuleId = null;                                                                                 // 8
  return resp;                                                                                                     // 9
};                                                                                                                 // 10
                                                                                                                   //
// Add a default rule of limiting logins, creating new users and password reset                                    // 12
// to 5 times every 10 seconds per connection.                                                                     // 13
Ap.addDefaultRateLimit = function () {                                                                             // 14
  if (!defaultRateLimiterRuleId) {                                                                                 // 15
    defaultRateLimiterRuleId = DDPRateLimiter.addRule({                                                            // 16
      userId: null,                                                                                                // 17
      clientAddress: null,                                                                                         // 18
      type: 'method',                                                                                              // 19
      name: function () {                                                                                          // 20
        function name(_name) {                                                                                     // 20
          return _.contains(['login', 'createUser', 'resetPassword', 'forgotPassword'], _name);                    // 21
        }                                                                                                          // 23
                                                                                                                   //
        return name;                                                                                               // 20
      }(),                                                                                                         // 20
      connectionId: function () {                                                                                  // 24
        function connectionId(_connectionId) {                                                                     // 24
          return true;                                                                                             // 25
        }                                                                                                          // 26
                                                                                                                   //
        return connectionId;                                                                                       // 24
      }()                                                                                                          // 24
    }, 5, 10000);                                                                                                  // 16
  }                                                                                                                // 28
};                                                                                                                 // 29
                                                                                                                   //
Ap.addDefaultRateLimit();                                                                                          // 31
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"accounts_server.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","./accounts_common.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-base/accounts_server.js                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({AccountsServer:function(){return AccountsServer}});var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});var AccountsCommon;module.import("./accounts_common.js",{"AccountsCommon":function(v){AccountsCommon=v}});
                                                                                                                   //
                                                                                                                   //
var crypto = Npm.require('crypto');                                                                                // 1
                                                                                                                   //
                                                                                                                   // 3
                                                                                                                   //
/**                                                                                                                // 5
 * @summary Constructor for the `Accounts` namespace on the server.                                                //
 * @locus Server                                                                                                   //
 * @class AccountsServer                                                                                           //
 * @extends AccountsCommon                                                                                         //
 * @instancename accountsServer                                                                                    //
 * @param {Object} server A server object such as `Meteor.server`.                                                 //
 */                                                                                                                //
var AccountsServer = function (_AccountsCommon) {                                                                  // 13
  _inherits(AccountsServer, _AccountsCommon);                                                                      // 13
                                                                                                                   //
  // Note that this constructor is less likely to be instantiated multiple                                         // 14
  // times than the `AccountsClient` constructor, because a single server                                          // 15
  // can provide only one set of methods.                                                                          // 16
  function AccountsServer(server) {                                                                                // 17
    _classCallCheck(this, AccountsServer);                                                                         // 17
                                                                                                                   //
    var _this = _possibleConstructorReturn(this, _AccountsCommon.call(this));                                      // 17
                                                                                                                   //
    _this._server = server || Meteor.server;                                                                       // 20
    // Set up the server's methods, as if by calling Meteor.methods.                                               // 21
    _this._initServerMethods();                                                                                    // 22
                                                                                                                   //
    _this._initAccountDataHooks();                                                                                 // 24
                                                                                                                   //
    // If autopublish is on, publish these user fields. Login service                                              // 26
    // packages (eg accounts-google) add to these by calling                                                       // 27
    // addAutopublishFields.  Notably, this isn't implemented with multiple                                        // 28
    // publishes since DDP only merges only across top-level fields, not                                           // 29
    // subfields (such as 'services.facebook.accessToken')                                                         // 30
    _this._autopublishFields = {                                                                                   // 31
      loggedInUser: ['profile', 'username', 'emails'],                                                             // 32
      otherUsers: ['profile', 'username']                                                                          // 33
    };                                                                                                             // 31
    _this._initServerPublications();                                                                               // 35
                                                                                                                   //
    // connectionId -> {connection, loginToken}                                                                    // 37
    _this._accountData = {};                                                                                       // 38
                                                                                                                   //
    // connection id -> observe handle for the login token that this connection is                                 // 40
    // currently associated with, or a number. The number indicates that we are in                                 // 41
    // the process of setting up the observe (using a number instead of a single                                   // 42
    // sentinel allows multiple attempts to set up the observe to identify which                                   // 43
    // one was theirs).                                                                                            // 44
    _this._userObservesForConnections = {};                                                                        // 45
    _this._nextUserObserveNumber = 1; // for the number described above.                                           // 46
                                                                                                                   //
    // list of all registered handlers.                                                                            // 48
    _this._loginHandlers = [];                                                                                     // 49
                                                                                                                   //
    setupUsersCollection(_this.users);                                                                             // 51
    setupDefaultLoginHandlers(_this);                                                                              // 52
    setExpireTokensInterval(_this);                                                                                // 53
                                                                                                                   //
    _this._validateLoginHook = new Hook({ bindEnvironment: false });                                               // 55
    _this._validateNewUserHooks = [defaultValidateNewUserHook.bind(_this)];                                        // 56
                                                                                                                   //
    _this._deleteSavedTokensForAllUsersOnStartup();                                                                // 60
                                                                                                                   //
    _this._skipCaseInsensitiveChecksForTest = {};                                                                  // 62
    return _this;                                                                                                  // 17
  }                                                                                                                // 63
                                                                                                                   //
  ///                                                                                                              // 65
  /// CURRENT USER                                                                                                 // 66
  ///                                                                                                              // 67
                                                                                                                   //
  // @override of "abstract" non-implementation in accounts_common.js                                              // 69
                                                                                                                   //
                                                                                                                   //
  AccountsServer.prototype.userId = function () {                                                                  // 13
    function userId() {                                                                                            // 13
      // This function only works if called inside a method. In theory, it                                         // 71
      // could also be called from publish statements, since they also                                             // 72
      // have a userId associated with them. However, given that publish                                           // 73
      // functions aren't reactive, using any of the infomation from                                               // 74
      // Meteor.user() in a publish function will always use the value                                             // 75
      // from when the function first runs. This is likely not what the                                            // 76
      // user expects. The way to make this work in a publish is to do                                             // 77
      // Meteor.find(this.userId).observe and recompute when the user                                              // 78
      // record changes.                                                                                           // 79
      var currentInvocation = DDP._CurrentInvocation.get();                                                        // 80
      if (!currentInvocation) throw new Error("Meteor.userId can only be invoked in method calls. Use this.userId in publish functions.");
      return currentInvocation.userId;                                                                             // 83
    }                                                                                                              // 84
                                                                                                                   //
    return userId;                                                                                                 // 13
  }();                                                                                                             // 13
                                                                                                                   //
  ///                                                                                                              // 86
  /// LOGIN HOOKS                                                                                                  // 87
  ///                                                                                                              // 88
                                                                                                                   //
  /**                                                                                                              // 90
   * @summary Validate login attempts.                                                                             //
   * @locus Server                                                                                                 //
   * @param {Function} func Called whenever a login is attempted (either successful or unsuccessful).  A login can be aborted by returning a falsy value or throwing an exception.
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsServer.prototype.validateLoginAttempt = function () {                                                    // 13
    function validateLoginAttempt(func) {                                                                          // 13
      // Exceptions inside the hook callback are passed up to us.                                                  // 96
      return this._validateLoginHook.register(func);                                                               // 97
    }                                                                                                              // 98
                                                                                                                   //
    return validateLoginAttempt;                                                                                   // 13
  }();                                                                                                             // 13
                                                                                                                   //
  /**                                                                                                              // 100
   * @summary Set restrictions on new user creation.                                                               //
   * @locus Server                                                                                                 //
   * @param {Function} func Called whenever a new user is created. Takes the new user object, and returns true to allow the creation or false to abort.
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsServer.prototype.validateNewUser = function () {                                                         // 13
    function validateNewUser(func) {                                                                               // 13
      this._validateNewUserHooks.push(func);                                                                       // 106
    }                                                                                                              // 107
                                                                                                                   //
    return validateNewUser;                                                                                        // 13
  }();                                                                                                             // 13
                                                                                                                   //
  ///                                                                                                              // 109
  /// CREATE USER HOOKS                                                                                            // 110
  ///                                                                                                              // 111
                                                                                                                   //
  /**                                                                                                              // 113
   * @summary Customize new user creation.                                                                         //
   * @locus Server                                                                                                 //
   * @param {Function} func Called whenever a new user is created. Return the new user object, or throw an `Error` to abort the creation.
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsServer.prototype.onCreateUser = function () {                                                            // 13
    function onCreateUser(func) {                                                                                  // 13
      if (this._onCreateUserHook) {                                                                                // 119
        throw new Error("Can only call onCreateUser once");                                                        // 120
      }                                                                                                            // 121
                                                                                                                   //
      this._onCreateUserHook = func;                                                                               // 123
    }                                                                                                              // 124
                                                                                                                   //
    return onCreateUser;                                                                                           // 13
  }();                                                                                                             // 13
                                                                                                                   //
  return AccountsServer;                                                                                           // 13
}(AccountsCommon);;                                                                                                // 13
                                                                                                                   //
var Ap = AccountsServer.prototype;                                                                                 // 127
                                                                                                                   //
// Give each login hook callback a fresh cloned copy of the attempt                                                // 129
// object, but don't clone the connection.                                                                         // 130
//                                                                                                                 // 131
function cloneAttemptWithConnection(connection, attempt) {                                                         // 132
  var clonedAttempt = EJSON.clone(attempt);                                                                        // 133
  clonedAttempt.connection = connection;                                                                           // 134
  return clonedAttempt;                                                                                            // 135
}                                                                                                                  // 136
                                                                                                                   //
Ap._validateLogin = function (connection, attempt) {                                                               // 138
  this._validateLoginHook.each(function (callback) {                                                               // 139
    var ret;                                                                                                       // 140
    try {                                                                                                          // 141
      ret = callback(cloneAttemptWithConnection(connection, attempt));                                             // 142
    } catch (e) {                                                                                                  // 143
      attempt.allowed = false;                                                                                     // 145
      // XXX this means the last thrown error overrides previous error                                             // 146
      // messages. Maybe this is surprising to users and we should make                                            // 147
      // overriding errors more explicit. (see                                                                     // 148
      // https://github.com/meteor/meteor/issues/1960)                                                             // 149
      attempt.error = e;                                                                                           // 150
      return true;                                                                                                 // 151
    }                                                                                                              // 152
    if (!ret) {                                                                                                    // 153
      attempt.allowed = false;                                                                                     // 154
      // don't override a specific error provided by a previous                                                    // 155
      // validator or the initial attempt (eg "incorrect password").                                               // 156
      if (!attempt.error) attempt.error = new Meteor.Error(403, "Login forbidden");                                // 157
    }                                                                                                              // 159
    return true;                                                                                                   // 160
  });                                                                                                              // 161
};                                                                                                                 // 162
                                                                                                                   //
Ap._successfulLogin = function (connection, attempt) {                                                             // 165
  this._onLoginHook.each(function (callback) {                                                                     // 166
    callback(cloneAttemptWithConnection(connection, attempt));                                                     // 167
    return true;                                                                                                   // 168
  });                                                                                                              // 169
};                                                                                                                 // 170
                                                                                                                   //
Ap._failedLogin = function (connection, attempt) {                                                                 // 172
  this._onLoginFailureHook.each(function (callback) {                                                              // 173
    callback(cloneAttemptWithConnection(connection, attempt));                                                     // 174
    return true;                                                                                                   // 175
  });                                                                                                              // 176
};                                                                                                                 // 177
                                                                                                                   //
///                                                                                                                // 180
/// LOGIN METHODS                                                                                                  // 181
///                                                                                                                // 182
                                                                                                                   //
// Login methods return to the client an object containing these                                                   // 184
// fields when the user was logged in successfully:                                                                // 185
//                                                                                                                 // 186
//   id: userId                                                                                                    // 187
//   token: *                                                                                                      // 188
//   tokenExpires: *                                                                                               // 189
//                                                                                                                 // 190
// tokenExpires is optional and intends to provide a hint to the                                                   // 191
// client as to when the token will expire. If not provided, the                                                   // 192
// client will call Accounts._tokenExpiration, passing it the date                                                 // 193
// that it received the token.                                                                                     // 194
//                                                                                                                 // 195
// The login method will throw an error back to the client if the user                                             // 196
// failed to log in.                                                                                               // 197
//                                                                                                                 // 198
//                                                                                                                 // 199
// Login handlers and service specific login methods such as                                                       // 200
// `createUser` internally return a `result` object containing these                                               // 201
// fields:                                                                                                         // 202
//                                                                                                                 // 203
//   type:                                                                                                         // 204
//     optional string; the service name, overrides the handler                                                    // 205
//     default if present.                                                                                         // 206
//                                                                                                                 // 207
//   error:                                                                                                        // 208
//     exception; if the user is not allowed to login, the reason why.                                             // 209
//                                                                                                                 // 210
//   userId:                                                                                                       // 211
//     string; the user id of the user attempting to login (if                                                     // 212
//     known), required for an allowed login.                                                                      // 213
//                                                                                                                 // 214
//   options:                                                                                                      // 215
//     optional object merged into the result returned by the login                                                // 216
//     method; used by HAMK from SRP.                                                                              // 217
//                                                                                                                 // 218
//   stampedLoginToken:                                                                                            // 219
//     optional object with `token` and `when` indicating the login                                                // 220
//     token is already present in the database, returned by the                                                   // 221
//     "resume" login handler.                                                                                     // 222
//                                                                                                                 // 223
// For convenience, login methods can also throw an exception, which                                               // 224
// is converted into an {error} result.  However, if the id of the                                                 // 225
// user attempting the login is known, a {userId, error} result should                                             // 226
// be returned instead since the user id is not captured when an                                                   // 227
// exception is thrown.                                                                                            // 228
//                                                                                                                 // 229
// This internal `result` object is automatically converted into the                                               // 230
// public {id, token, tokenExpires} object returned to the client.                                                 // 231
                                                                                                                   //
                                                                                                                   //
// Try a login method, converting thrown exceptions into an {error}                                                // 234
// result.  The `type` argument is a default, inserted into the result                                             // 235
// object if not explicitly returned.                                                                              // 236
//                                                                                                                 // 237
var tryLoginMethod = function tryLoginMethod(type, fn) {                                                           // 238
  var result;                                                                                                      // 239
  try {                                                                                                            // 240
    result = fn();                                                                                                 // 241
  } catch (e) {                                                                                                    // 242
    result = { error: e };                                                                                         // 244
  }                                                                                                                // 245
                                                                                                                   //
  if (result && !result.type && type) result.type = type;                                                          // 247
                                                                                                                   //
  return result;                                                                                                   // 250
};                                                                                                                 // 251
                                                                                                                   //
// Log in a user on a connection.                                                                                  // 254
//                                                                                                                 // 255
// We use the method invocation to set the user id on the connection,                                              // 256
// not the connection object directly. setUserId is tied to methods to                                             // 257
// enforce clear ordering of method application (using wait methods on                                             // 258
// the client, and a no setUserId after unblock restriction on the                                                 // 259
// server)                                                                                                         // 260
//                                                                                                                 // 261
// The `stampedLoginToken` parameter is optional.  When present, it                                                // 262
// indicates that the login token has already been inserted into the                                               // 263
// database and doesn't need to be inserted again.  (It's used by the                                              // 264
// "resume" login handler).                                                                                        // 265
Ap._loginUser = function (methodInvocation, userId, stampedLoginToken) {                                           // 266
  var self = this;                                                                                                 // 267
                                                                                                                   //
  if (!stampedLoginToken) {                                                                                        // 269
    stampedLoginToken = self._generateStampedLoginToken();                                                         // 270
    self._insertLoginToken(userId, stampedLoginToken);                                                             // 271
  }                                                                                                                // 272
                                                                                                                   //
  // This order (and the avoidance of yields) is important to make                                                 // 274
  // sure that when publish functions are rerun, they see a                                                        // 275
  // consistent view of the world: the userId is set and matches                                                   // 276
  // the login token on the connection (not that there is                                                          // 277
  // currently a public API for reading the login token on a                                                       // 278
  // connection).                                                                                                  // 279
  Meteor._noYieldsAllowed(function () {                                                                            // 280
    self._setLoginToken(userId, methodInvocation.connection, self._hashLoginToken(stampedLoginToken.token));       // 281
  });                                                                                                              // 286
                                                                                                                   //
  methodInvocation.setUserId(userId);                                                                              // 288
                                                                                                                   //
  return {                                                                                                         // 290
    id: userId,                                                                                                    // 291
    token: stampedLoginToken.token,                                                                                // 292
    tokenExpires: self._tokenExpiration(stampedLoginToken.when)                                                    // 293
  };                                                                                                               // 290
};                                                                                                                 // 295
                                                                                                                   //
// After a login method has completed, call the login hooks.  Note                                                 // 298
// that `attemptLogin` is called for *all* login attempts, even ones                                               // 299
// which aren't successful (such as an invalid password, etc).                                                     // 300
//                                                                                                                 // 301
// If the login is allowed and isn't aborted by a validate login hook                                              // 302
// callback, log in the user.                                                                                      // 303
//                                                                                                                 // 304
Ap._attemptLogin = function (methodInvocation, methodName, methodArgs, result) {                                   // 305
  if (!result) throw new Error("result is required");                                                              // 311
                                                                                                                   //
  // XXX A programming error in a login handler can lead to this occuring, and                                     // 314
  // then we don't call onLogin or onLoginFailure callbacks. Should                                                // 315
  // tryLoginMethod catch this case and turn it into an error?                                                     // 316
  if (!result.userId && !result.error) throw new Error("A login method must specify a userId or an error");        // 317
                                                                                                                   //
  var user;                                                                                                        // 320
  if (result.userId) user = this.users.findOne(result.userId);                                                     // 321
                                                                                                                   //
  var attempt = {                                                                                                  // 324
    type: result.type || "unknown",                                                                                // 325
    allowed: !!(result.userId && !result.error),                                                                   // 326
    methodName: methodName,                                                                                        // 327
    methodArguments: _.toArray(methodArgs)                                                                         // 328
  };                                                                                                               // 324
  if (result.error) attempt.error = result.error;                                                                  // 330
  if (user) attempt.user = user;                                                                                   // 332
                                                                                                                   //
  // _validateLogin may mutate `attempt` by adding an error and changing allowed                                   // 335
  // to false, but that's the only change it can make (and the user's callbacks                                    // 336
  // only get a clone of `attempt`).                                                                               // 337
  this._validateLogin(methodInvocation.connection, attempt);                                                       // 338
                                                                                                                   //
  if (attempt.allowed) {                                                                                           // 340
    var ret = _.extend(this._loginUser(methodInvocation, result.userId, result.stampedLoginToken), result.options || {});
    this._successfulLogin(methodInvocation.connection, attempt);                                                   // 349
    return ret;                                                                                                    // 350
  } else {                                                                                                         // 351
    this._failedLogin(methodInvocation.connection, attempt);                                                       // 353
    throw attempt.error;                                                                                           // 354
  }                                                                                                                // 355
};                                                                                                                 // 356
                                                                                                                   //
// All service specific login methods should go through this function.                                             // 359
// Ensure that thrown exceptions are caught and that login hook                                                    // 360
// callbacks are still called.                                                                                     // 361
//                                                                                                                 // 362
Ap._loginMethod = function (methodInvocation, methodName, methodArgs, type, fn) {                                  // 363
  return this._attemptLogin(methodInvocation, methodName, methodArgs, tryLoginMethod(type, fn));                   // 370
};                                                                                                                 // 376
                                                                                                                   //
// Report a login attempt failed outside the context of a normal login                                             // 379
// method. This is for use in the case where there is a multi-step login                                           // 380
// procedure (eg SRP based password login). If a method early in the                                               // 381
// chain fails, it should call this function to report a failure. There                                            // 382
// is no corresponding method for a successful login; methods that can                                             // 383
// succeed at logging a user in should always be actual login methods                                              // 384
// (using either Accounts._loginMethod or Accounts.registerLoginHandler).                                          // 385
Ap._reportLoginFailure = function (methodInvocation, methodName, methodArgs, result) {                             // 386
  var attempt = {                                                                                                  // 392
    type: result.type || "unknown",                                                                                // 393
    allowed: false,                                                                                                // 394
    error: result.error,                                                                                           // 395
    methodName: methodName,                                                                                        // 396
    methodArguments: _.toArray(methodArgs)                                                                         // 397
  };                                                                                                               // 392
                                                                                                                   //
  if (result.userId) {                                                                                             // 400
    attempt.user = this.users.findOne(result.userId);                                                              // 401
  }                                                                                                                // 402
                                                                                                                   //
  this._validateLogin(methodInvocation.connection, attempt);                                                       // 404
  this._failedLogin(methodInvocation.connection, attempt);                                                         // 405
                                                                                                                   //
  // _validateLogin may mutate attempt to set a new error message. Return                                          // 407
  // the modified version.                                                                                         // 408
  return attempt;                                                                                                  // 409
};                                                                                                                 // 410
                                                                                                                   //
///                                                                                                                // 413
/// LOGIN HANDLERS                                                                                                 // 414
///                                                                                                                // 415
                                                                                                                   //
// The main entry point for auth packages to hook in to login.                                                     // 417
//                                                                                                                 // 418
// A login handler is a login method which can return `undefined` to                                               // 419
// indicate that the login request is not handled by this handler.                                                 // 420
//                                                                                                                 // 421
// @param name {String} Optional.  The service name, used by default                                               // 422
// if a specific service name isn't returned in the result.                                                        // 423
//                                                                                                                 // 424
// @param handler {Function} A function that receives an options object                                            // 425
// (as passed as an argument to the `login` method) and returns one of:                                            // 426
// - `undefined`, meaning don't handle;                                                                            // 427
// - a login method result object                                                                                  // 428
                                                                                                                   //
Ap.registerLoginHandler = function (name, handler) {                                                               // 430
  if (!handler) {                                                                                                  // 431
    handler = name;                                                                                                // 432
    name = null;                                                                                                   // 433
  }                                                                                                                // 434
                                                                                                                   //
  this._loginHandlers.push({                                                                                       // 436
    name: name,                                                                                                    // 437
    handler: handler                                                                                               // 438
  });                                                                                                              // 436
};                                                                                                                 // 440
                                                                                                                   //
// Checks a user's credentials against all the registered login                                                    // 443
// handlers, and returns a login token if the credentials are valid. It                                            // 444
// is like the login method, except that it doesn't set the logged-in                                              // 445
// user on the connection. Throws a Meteor.Error if logging in fails,                                              // 446
// including the case where none of the login handlers handled the login                                           // 447
// request. Otherwise, returns {id: userId, token: *, tokenExpires: *}.                                            // 448
//                                                                                                                 // 449
// For example, if you want to login with a plaintext password, `options` could be                                 // 450
//   { user: { username: <username> }, password: <password> }, or                                                  // 451
//   { user: { email: <email> }, password: <password> }.                                                           // 452
                                                                                                                   //
// Try all of the registered login handlers until one of them doesn't                                              // 454
// return `undefined`, meaning it handled this call to `login`. Return                                             // 455
// that return value.                                                                                              // 456
Ap._runLoginHandlers = function (methodInvocation, options) {                                                      // 457
  for (var i = 0; i < this._loginHandlers.length; ++i) {                                                           // 458
    var handler = this._loginHandlers[i];                                                                          // 459
                                                                                                                   //
    var result = tryLoginMethod(handler.name, function () {                                                        // 461
      return handler.handler.call(methodInvocation, options);                                                      // 464
    });                                                                                                            // 465
                                                                                                                   //
    if (result) {                                                                                                  // 468
      return result;                                                                                               // 469
    }                                                                                                              // 470
                                                                                                                   //
    if (result !== undefined) {                                                                                    // 472
      throw new Meteor.Error(400, "A login handler should return a result or undefined");                          // 473
    }                                                                                                              // 474
  }                                                                                                                // 475
                                                                                                                   //
  return {                                                                                                         // 477
    type: null,                                                                                                    // 478
    error: new Meteor.Error(400, "Unrecognized options for login request")                                         // 479
  };                                                                                                               // 477
};                                                                                                                 // 481
                                                                                                                   //
// Deletes the given loginToken from the database.                                                                 // 483
//                                                                                                                 // 484
// For new-style hashed token, this will cause all connections                                                     // 485
// associated with the token to be closed.                                                                         // 486
//                                                                                                                 // 487
// Any connections associated with old-style unhashed tokens will be                                               // 488
// in the process of becoming associated with hashed tokens and then                                               // 489
// they'll get closed.                                                                                             // 490
Ap.destroyToken = function (userId, loginToken) {                                                                  // 491
  this.users.update(userId, {                                                                                      // 492
    $pull: {                                                                                                       // 493
      "services.resume.loginTokens": {                                                                             // 494
        $or: [{ hashedToken: loginToken }, { token: loginToken }]                                                  // 495
      }                                                                                                            // 494
    }                                                                                                              // 493
  });                                                                                                              // 492
};                                                                                                                 // 502
                                                                                                                   //
Ap._initServerMethods = function () {                                                                              // 504
  // The methods created in this function need to be created here so that                                          // 505
  // this variable is available in their scope.                                                                    // 506
  var accounts = this;                                                                                             // 507
                                                                                                                   //
  // This object will be populated with methods and then passed to                                                 // 509
  // accounts._server.methods further below.                                                                       // 510
  var methods = {};                                                                                                // 511
                                                                                                                   //
  // @returns {Object|null}                                                                                        // 513
  //   If successful, returns {token: reconnectToken, id: userId}                                                  // 514
  //   If unsuccessful (for example, if the user closed the oauth login popup),                                    // 515
  //     throws an error describing the reason                                                                     // 516
  methods.login = function (options) {                                                                             // 517
    var self = this;                                                                                               // 518
                                                                                                                   //
    // Login handlers should really also check whatever field they look at in                                      // 520
    // options, but we don't enforce it.                                                                           // 521
    check(options, Object);                                                                                        // 522
                                                                                                                   //
    var result = accounts._runLoginHandlers(self, options);                                                        // 524
                                                                                                                   //
    return accounts._attemptLogin(self, "login", arguments, result);                                               // 526
  };                                                                                                               // 527
                                                                                                                   //
  methods.logout = function () {                                                                                   // 529
    var token = accounts._getLoginToken(this.connection.id);                                                       // 530
    accounts._setLoginToken(this.userId, this.connection, null);                                                   // 531
    if (token && this.userId) accounts.destroyToken(this.userId, token);                                           // 532
    this.setUserId(null);                                                                                          // 534
  };                                                                                                               // 535
                                                                                                                   //
  // Delete all the current user's tokens and close all open connections logged                                    // 537
  // in as this user. Returns a fresh new login token that this client can                                         // 538
  // use. Tests set Accounts._noConnectionCloseDelayForTest to delete tokens                                       // 539
  // immediately instead of using a delay.                                                                         // 540
  //                                                                                                               // 541
  // XXX COMPAT WITH 0.7.2                                                                                         // 542
  // This single `logoutOtherClients` method has been replaced with two                                            // 543
  // methods, one that you call to get a new token, and another that you                                           // 544
  // call to remove all tokens except your own. The new design allows                                              // 545
  // clients to know when other clients have actually been logged                                                  // 546
  // out. (The `logoutOtherClients` method guarantees the caller that                                              // 547
  // the other clients will be logged out at some point, but makes no                                              // 548
  // guarantees about when.) This method is left in for backwards                                                  // 549
  // compatibility, especially since application code might be calling                                             // 550
  // this method directly.                                                                                         // 551
  //                                                                                                               // 552
  // @returns {Object} Object with token and tokenExpires keys.                                                    // 553
  methods.logoutOtherClients = function () {                                                                       // 554
    var self = this;                                                                                               // 555
    var user = accounts.users.findOne(self.userId, {                                                               // 556
      fields: {                                                                                                    // 557
        "services.resume.loginTokens": true                                                                        // 558
      }                                                                                                            // 557
    });                                                                                                            // 556
    if (user) {                                                                                                    // 561
      // Save the current tokens in the database to be deleted in                                                  // 562
      // CONNECTION_CLOSE_DELAY_MS ms. This gives other connections in the                                         // 563
      // caller's browser time to find the fresh token in localStorage. We save                                    // 564
      // the tokens in the database in case we crash before actually deleting                                      // 565
      // them.                                                                                                     // 566
      var tokens = user.services.resume.loginTokens;                                                               // 567
      var newToken = accounts._generateStampedLoginToken();                                                        // 568
      var userId = self.userId;                                                                                    // 569
      accounts.users.update(userId, {                                                                              // 570
        $set: {                                                                                                    // 571
          "services.resume.loginTokensToDelete": tokens,                                                           // 572
          "services.resume.haveLoginTokensToDelete": true                                                          // 573
        },                                                                                                         // 571
        $push: { "services.resume.loginTokens": accounts._hashStampedToken(newToken) }                             // 575
      });                                                                                                          // 570
      Meteor.setTimeout(function () {                                                                              // 577
        // The observe on Meteor.users will take care of closing the connections                                   // 578
        // associated with `tokens`.                                                                               // 579
        accounts._deleteSavedTokensForUser(userId, tokens);                                                        // 580
      }, accounts._noConnectionCloseDelayForTest ? 0 : CONNECTION_CLOSE_DELAY_MS);                                 // 581
      // We do not set the login token on this connection, but instead the                                         // 583
      // observe closes the connection and the client will reconnect with the                                      // 584
      // new token.                                                                                                // 585
      return {                                                                                                     // 586
        token: newToken.token,                                                                                     // 587
        tokenExpires: accounts._tokenExpiration(newToken.when)                                                     // 588
      };                                                                                                           // 586
    } else {                                                                                                       // 590
      throw new Meteor.Error("You are not logged in.");                                                            // 591
    }                                                                                                              // 592
  };                                                                                                               // 593
                                                                                                                   //
  // Generates a new login token with the same expiration as the                                                   // 595
  // connection's current token and saves it to the database. Associates                                           // 596
  // the connection with this new token and returns it. Throws an error                                            // 597
  // if called on a connection that isn't logged in.                                                               // 598
  //                                                                                                               // 599
  // @returns Object                                                                                               // 600
  //   If successful, returns { token: <new token>, id: <user id>,                                                 // 601
  //   tokenExpires: <expiration date> }.                                                                          // 602
  methods.getNewToken = function () {                                                                              // 603
    var self = this;                                                                                               // 604
    var user = accounts.users.findOne(self.userId, {                                                               // 605
      fields: { "services.resume.loginTokens": 1 }                                                                 // 606
    });                                                                                                            // 605
    if (!self.userId || !user) {                                                                                   // 608
      throw new Meteor.Error("You are not logged in.");                                                            // 609
    }                                                                                                              // 610
    // Be careful not to generate a new token that has a later                                                     // 611
    // expiration than the curren token. Otherwise, a bad guy with a                                               // 612
    // stolen token could use this method to stop his stolen token from                                            // 613
    // ever expiring.                                                                                              // 614
    var currentHashedToken = accounts._getLoginToken(self.connection.id);                                          // 615
    var currentStampedToken = _.find(user.services.resume.loginTokens, function (stampedToken) {                   // 616
      return stampedToken.hashedToken === currentHashedToken;                                                      // 619
    });                                                                                                            // 620
    if (!currentStampedToken) {                                                                                    // 622
      // safety belt: this should never happen                                                                     // 622
      throw new Meteor.Error("Invalid login token");                                                               // 623
    }                                                                                                              // 624
    var newStampedToken = accounts._generateStampedLoginToken();                                                   // 625
    newStampedToken.when = currentStampedToken.when;                                                               // 626
    accounts._insertLoginToken(self.userId, newStampedToken);                                                      // 627
    return accounts._loginUser(self, self.userId, newStampedToken);                                                // 628
  };                                                                                                               // 629
                                                                                                                   //
  // Removes all tokens except the token associated with the current                                               // 631
  // connection. Throws an error if the connection is not logged                                                   // 632
  // in. Returns nothing on success.                                                                               // 633
  methods.removeOtherTokens = function () {                                                                        // 634
    var self = this;                                                                                               // 635
    if (!self.userId) {                                                                                            // 636
      throw new Meteor.Error("You are not logged in.");                                                            // 637
    }                                                                                                              // 638
    var currentToken = accounts._getLoginToken(self.connection.id);                                                // 639
    accounts.users.update(self.userId, {                                                                           // 640
      $pull: {                                                                                                     // 641
        "services.resume.loginTokens": { hashedToken: { $ne: currentToken } }                                      // 642
      }                                                                                                            // 641
    });                                                                                                            // 640
  };                                                                                                               // 645
                                                                                                                   //
  // Allow a one-time configuration for a login service. Modifications                                             // 647
  // to this collection are also allowed in insecure mode.                                                         // 648
  methods.configureLoginService = function (options) {                                                             // 649
    check(options, Match.ObjectIncluding({ service: String }));                                                    // 650
    // Don't let random users configure a service we haven't added yet (so                                         // 651
    // that when we do later add it, it's set up with their configuration                                          // 652
    // instead of ours).                                                                                           // 653
    // XXX if service configuration is oauth-specific then this code should                                        // 654
    //     be in accounts-oauth; if it's not then the registry should be                                           // 655
    //     in this package                                                                                         // 656
    if (!(accounts.oauth && _.contains(accounts.oauth.serviceNames(), options.service))) {                         // 657
      throw new Meteor.Error(403, "Service unknown");                                                              // 659
    }                                                                                                              // 660
                                                                                                                   //
    var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;                              // 662
    if (ServiceConfiguration.configurations.findOne({ service: options.service })) throw new Meteor.Error(403, "Service " + options.service + " already configured");
                                                                                                                   //
    if (_.has(options, "secret") && usingOAuthEncryption()) options.secret = OAuthEncryption.seal(options.secret);
                                                                                                                   //
    ServiceConfiguration.configurations.insert(options);                                                           // 670
  };                                                                                                               // 671
                                                                                                                   //
  accounts._server.methods(methods);                                                                               // 673
};                                                                                                                 // 674
                                                                                                                   //
Ap._initAccountDataHooks = function () {                                                                           // 676
  var accounts = this;                                                                                             // 677
                                                                                                                   //
  accounts._server.onConnection(function (connection) {                                                            // 679
    accounts._accountData[connection.id] = {                                                                       // 680
      connection: connection                                                                                       // 681
    };                                                                                                             // 680
                                                                                                                   //
    connection.onClose(function () {                                                                               // 684
      accounts._removeTokenFromConnection(connection.id);                                                          // 685
      delete accounts._accountData[connection.id];                                                                 // 686
    });                                                                                                            // 687
  });                                                                                                              // 688
};                                                                                                                 // 689
                                                                                                                   //
Ap._initServerPublications = function () {                                                                         // 691
  var accounts = this;                                                                                             // 692
                                                                                                                   //
  // Publish all login service configuration fields other than secret.                                             // 694
  accounts._server.publish("meteor.loginServiceConfiguration", function () {                                       // 695
    var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;                              // 696
    return ServiceConfiguration.configurations.find({}, { fields: { secret: 0 } });                                // 698
  }, { is_auto: true }); // not techincally autopublish, but stops the warning.                                    // 699
                                                                                                                   //
  // Publish the current user's record to the client.                                                              // 701
  accounts._server.publish(null, function () {                                                                     // 702
    if (this.userId) {                                                                                             // 703
      return accounts.users.find({                                                                                 // 704
        _id: this.userId                                                                                           // 705
      }, {                                                                                                         // 704
        fields: {                                                                                                  // 707
          profile: 1,                                                                                              // 708
          username: 1,                                                                                             // 709
          emails: 1                                                                                                // 710
        }                                                                                                          // 707
      });                                                                                                          // 706
    } else {                                                                                                       // 713
      return null;                                                                                                 // 714
    }                                                                                                              // 715
  }, /*suppress autopublish warning*/{ is_auto: true });                                                           // 716
                                                                                                                   //
  // Use Meteor.startup to give other packages a chance to call                                                    // 718
  // addAutopublishFields.                                                                                         // 719
  Package.autopublish && Meteor.startup(function () {                                                              // 720
    // ['profile', 'username'] -> {profile: 1, username: 1}                                                        // 721
    var toFieldSelector = function toFieldSelector(fields) {                                                       // 722
      return _.object(_.map(fields, function (field) {                                                             // 723
        return [field, 1];                                                                                         // 724
      }));                                                                                                         // 725
    };                                                                                                             // 726
                                                                                                                   //
    accounts._server.publish(null, function () {                                                                   // 728
      if (this.userId) {                                                                                           // 729
        return accounts.users.find({                                                                               // 730
          _id: this.userId                                                                                         // 731
        }, {                                                                                                       // 730
          fields: toFieldSelector(accounts._autopublishFields.loggedInUser)                                        // 733
        });                                                                                                        // 732
      } else {                                                                                                     // 735
        return null;                                                                                               // 736
      }                                                                                                            // 737
    }, /*suppress autopublish warning*/{ is_auto: true });                                                         // 738
                                                                                                                   //
    // XXX this publish is neither dedup-able nor is it optimized by our special                                   // 740
    // treatment of queries on a specific _id. Therefore this will have O(n^2)                                     // 741
    // run-time performance every time a user document is changed (eg someone                                      // 742
    // logging in). If this is a problem, we can instead write a manual publish                                    // 743
    // function which filters out fields based on 'this.userId'.                                                   // 744
    accounts._server.publish(null, function () {                                                                   // 745
      var selector = this.userId ? {                                                                               // 746
        _id: { $ne: this.userId }                                                                                  // 747
      } : {};                                                                                                      // 746
                                                                                                                   //
      return accounts.users.find(selector, {                                                                       // 750
        fields: toFieldSelector(accounts._autopublishFields.otherUsers)                                            // 751
      });                                                                                                          // 750
    }, /*suppress autopublish warning*/{ is_auto: true });                                                         // 753
  });                                                                                                              // 754
};                                                                                                                 // 755
                                                                                                                   //
// Add to the list of fields or subfields to be automatically                                                      // 757
// published if autopublish is on. Must be called from top-level                                                   // 758
// code (ie, before Meteor.startup hooks run).                                                                     // 759
//                                                                                                                 // 760
// @param opts {Object} with:                                                                                      // 761
//   - forLoggedInUser {Array} Array of fields published to the logged-in user                                     // 762
//   - forOtherUsers {Array} Array of fields published to users that aren't logged in                              // 763
Ap.addAutopublishFields = function (opts) {                                                                        // 764
  this._autopublishFields.loggedInUser.push.apply(this._autopublishFields.loggedInUser, opts.forLoggedInUser);     // 765
  this._autopublishFields.otherUsers.push.apply(this._autopublishFields.otherUsers, opts.forOtherUsers);           // 767
};                                                                                                                 // 769
                                                                                                                   //
///                                                                                                                // 771
/// ACCOUNT DATA                                                                                                   // 772
///                                                                                                                // 773
                                                                                                                   //
// HACK: This is used by 'meteor-accounts' to get the loginToken for a                                             // 775
// connection. Maybe there should be a public way to do that.                                                      // 776
Ap._getAccountData = function (connectionId, field) {                                                              // 777
  var data = this._accountData[connectionId];                                                                      // 778
  return data && data[field];                                                                                      // 779
};                                                                                                                 // 780
                                                                                                                   //
Ap._setAccountData = function (connectionId, field, value) {                                                       // 782
  var data = this._accountData[connectionId];                                                                      // 783
                                                                                                                   //
  // safety belt. shouldn't happen. accountData is set in onConnection,                                            // 785
  // we don't have a connectionId until it is set.                                                                 // 786
  if (!data) return;                                                                                               // 787
                                                                                                                   //
  if (value === undefined) delete data[field];else data[field] = value;                                            // 790
};                                                                                                                 // 794
                                                                                                                   //
///                                                                                                                // 797
/// RECONNECT TOKENS                                                                                               // 798
///                                                                                                                // 799
/// support reconnecting using a meteor login token                                                                // 800
                                                                                                                   //
Ap._hashLoginToken = function (loginToken) {                                                                       // 802
  var hash = crypto.createHash('sha256');                                                                          // 803
  hash.update(loginToken);                                                                                         // 804
  return hash.digest('base64');                                                                                    // 805
};                                                                                                                 // 806
                                                                                                                   //
// {token, when} => {hashedToken, when}                                                                            // 809
Ap._hashStampedToken = function (stampedToken) {                                                                   // 810
  return _.extend(_.omit(stampedToken, 'token'), {                                                                 // 811
    hashedToken: this._hashLoginToken(stampedToken.token)                                                          // 812
  });                                                                                                              // 811
};                                                                                                                 // 814
                                                                                                                   //
// Using $addToSet avoids getting an index error if another client                                                 // 817
// logging in simultaneously has already inserted the new hashed                                                   // 818
// token.                                                                                                          // 819
Ap._insertHashedLoginToken = function (userId, hashedToken, query) {                                               // 820
  query = query ? _.clone(query) : {};                                                                             // 821
  query._id = userId;                                                                                              // 822
  this.users.update(query, {                                                                                       // 823
    $addToSet: {                                                                                                   // 824
      "services.resume.loginTokens": hashedToken                                                                   // 825
    }                                                                                                              // 824
  });                                                                                                              // 823
};                                                                                                                 // 828
                                                                                                                   //
// Exported for tests.                                                                                             // 831
Ap._insertLoginToken = function (userId, stampedToken, query) {                                                    // 832
  this._insertHashedLoginToken(userId, this._hashStampedToken(stampedToken), query);                               // 833
};                                                                                                                 // 838
                                                                                                                   //
Ap._clearAllLoginTokens = function (userId) {                                                                      // 841
  this.users.update(userId, {                                                                                      // 842
    $set: {                                                                                                        // 843
      'services.resume.loginTokens': []                                                                            // 844
    }                                                                                                              // 843
  });                                                                                                              // 842
};                                                                                                                 // 847
                                                                                                                   //
// test hook                                                                                                       // 849
Ap._getUserObserve = function (connectionId) {                                                                     // 850
  return this._userObservesForConnections[connectionId];                                                           // 851
};                                                                                                                 // 852
                                                                                                                   //
// Clean up this connection's association with the token: that is, stop                                            // 854
// the observe that we started when we associated the connection with                                              // 855
// this token.                                                                                                     // 856
Ap._removeTokenFromConnection = function (connectionId) {                                                          // 857
  if (_.has(this._userObservesForConnections, connectionId)) {                                                     // 858
    var observe = this._userObservesForConnections[connectionId];                                                  // 859
    if (typeof observe === 'number') {                                                                             // 860
      // We're in the process of setting up an observe for this connection. We                                     // 861
      // can't clean up that observe yet, but if we delete the placeholder for                                     // 862
      // this connection, then the observe will get cleaned up as soon as it has                                   // 863
      // been set up.                                                                                              // 864
      delete this._userObservesForConnections[connectionId];                                                       // 865
    } else {                                                                                                       // 866
      delete this._userObservesForConnections[connectionId];                                                       // 867
      observe.stop();                                                                                              // 868
    }                                                                                                              // 869
  }                                                                                                                // 870
};                                                                                                                 // 871
                                                                                                                   //
Ap._getLoginToken = function (connectionId) {                                                                      // 873
  return this._getAccountData(connectionId, 'loginToken');                                                         // 874
};                                                                                                                 // 875
                                                                                                                   //
// newToken is a hashed token.                                                                                     // 877
Ap._setLoginToken = function (userId, connection, newToken) {                                                      // 878
  var self = this;                                                                                                 // 879
                                                                                                                   //
  self._removeTokenFromConnection(connection.id);                                                                  // 881
  self._setAccountData(connection.id, 'loginToken', newToken);                                                     // 882
                                                                                                                   //
  if (newToken) {                                                                                                  // 884
    // Set up an observe for this token. If the token goes away, we need                                           // 885
    // to close the connection.  We defer the observe because there's                                              // 886
    // no need for it to be on the critical path for login; we just need                                           // 887
    // to ensure that the connection will get closed at some point if                                              // 888
    // the token gets deleted.                                                                                     // 889
    //                                                                                                             // 890
    // Initially, we set the observe for this connection to a number; this                                         // 891
    // signifies to other code (which might run while we yield) that we are in                                     // 892
    // the process of setting up an observe for this connection. Once the                                          // 893
    // observe is ready to go, we replace the number with the real observe                                         // 894
    // handle (unless the placeholder has been deleted or replaced by a                                            // 895
    // different placehold number, signifying that the connection was closed                                       // 896
    // already -- in this case we just clean up the observe that we started).                                      // 897
    var myObserveNumber = ++self._nextUserObserveNumber;                                                           // 898
    self._userObservesForConnections[connection.id] = myObserveNumber;                                             // 899
    Meteor.defer(function () {                                                                                     // 900
      // If something else happened on this connection in the meantime (it got                                     // 901
      // closed, or another call to _setLoginToken happened), just do                                              // 902
      // nothing. We don't need to start an observe for an old connection or old                                   // 903
      // token.                                                                                                    // 904
      if (self._userObservesForConnections[connection.id] !== myObserveNumber) {                                   // 905
        return;                                                                                                    // 906
      }                                                                                                            // 907
                                                                                                                   //
      var foundMatchingUser;                                                                                       // 909
      // Because we upgrade unhashed login tokens to hashed tokens at                                              // 910
      // login time, sessions will only be logged in with a hashed                                                 // 911
      // token. Thus we only need to observe hashed tokens here.                                                   // 912
      var observe = self.users.find({                                                                              // 913
        _id: userId,                                                                                               // 914
        'services.resume.loginTokens.hashedToken': newToken                                                        // 915
      }, { fields: { _id: 1 } }).observeChanges({                                                                  // 913
        added: function () {                                                                                       // 917
          function added() {                                                                                       // 917
            foundMatchingUser = true;                                                                              // 918
          }                                                                                                        // 919
                                                                                                                   //
          return added;                                                                                            // 917
        }(),                                                                                                       // 917
        removed: function () {                                                                                     // 920
          function removed() {                                                                                     // 920
            connection.close();                                                                                    // 921
            // The onClose callback for the connection takes care of                                               // 922
            // cleaning up the observe handle and any other state we have                                          // 923
            // lying around.                                                                                       // 924
          }                                                                                                        // 925
                                                                                                                   //
          return removed;                                                                                          // 920
        }()                                                                                                        // 920
      });                                                                                                          // 916
                                                                                                                   //
      // If the user ran another login or logout command we were waiting for the                                   // 928
      // defer or added to fire (ie, another call to _setLoginToken occurred),                                     // 929
      // then we let the later one win (start an observe, etc) and just stop our                                   // 930
      // observe now.                                                                                              // 931
      //                                                                                                           // 932
      // Similarly, if the connection was already closed, then the onClose                                         // 933
      // callback would have called _removeTokenFromConnection and there won't                                     // 934
      // be an entry in _userObservesForConnections. We can stop the observe.                                      // 935
      if (self._userObservesForConnections[connection.id] !== myObserveNumber) {                                   // 936
        observe.stop();                                                                                            // 937
        return;                                                                                                    // 938
      }                                                                                                            // 939
                                                                                                                   //
      self._userObservesForConnections[connection.id] = observe;                                                   // 941
                                                                                                                   //
      if (!foundMatchingUser) {                                                                                    // 943
        // We've set up an observe on the user associated with `newToken`,                                         // 944
        // so if the new token is removed from the database, we'll close                                           // 945
        // the connection. But the token might have already been deleted                                           // 946
        // before we set up the observe, which wouldn't have closed the                                            // 947
        // connection because the observe wasn't running yet.                                                      // 948
        connection.close();                                                                                        // 949
      }                                                                                                            // 950
    });                                                                                                            // 951
  }                                                                                                                // 952
};                                                                                                                 // 953
                                                                                                                   //
function setupDefaultLoginHandlers(accounts) {                                                                     // 955
  accounts.registerLoginHandler("resume", function (options) {                                                     // 956
    return defaultResumeLoginHandler.call(this, accounts, options);                                                // 957
  });                                                                                                              // 958
}                                                                                                                  // 959
                                                                                                                   //
// Login handler for resume tokens.                                                                                // 961
function defaultResumeLoginHandler(accounts, options) {                                                            // 962
  if (!options.resume) return undefined;                                                                           // 963
                                                                                                                   //
  check(options.resume, String);                                                                                   // 966
                                                                                                                   //
  var hashedToken = accounts._hashLoginToken(options.resume);                                                      // 968
                                                                                                                   //
  // First look for just the new-style hashed login token, to avoid                                                // 970
  // sending the unhashed token to the database in a query if we don't                                             // 971
  // need to.                                                                                                      // 972
  var user = accounts.users.findOne({ "services.resume.loginTokens.hashedToken": hashedToken });                   // 973
                                                                                                                   //
  if (!user) {                                                                                                     // 976
    // If we didn't find the hashed login token, try also looking for                                              // 977
    // the old-style unhashed token.  But we need to look for either                                               // 978
    // the old-style token OR the new-style token, because another                                                 // 979
    // client connection logging in simultaneously might have already                                              // 980
    // converted the token.                                                                                        // 981
    user = accounts.users.findOne({                                                                                // 982
      $or: [{ "services.resume.loginTokens.hashedToken": hashedToken }, { "services.resume.loginTokens.token": options.resume }]
    });                                                                                                            // 982
  }                                                                                                                // 988
                                                                                                                   //
  if (!user) return {                                                                                              // 990
    error: new Meteor.Error(403, "You've been logged out by the server. Please log in again.")                     // 992
  };                                                                                                               // 991
                                                                                                                   //
  // Find the token, which will either be an object with fields                                                    // 995
  // {hashedToken, when} for a hashed token or {token, when} for an                                                // 996
  // unhashed token.                                                                                               // 997
  var oldUnhashedStyleToken;                                                                                       // 998
  var token = _.find(user.services.resume.loginTokens, function (token) {                                          // 999
    return token.hashedToken === hashedToken;                                                                      // 1000
  });                                                                                                              // 1001
  if (token) {                                                                                                     // 1002
    oldUnhashedStyleToken = false;                                                                                 // 1003
  } else {                                                                                                         // 1004
    token = _.find(user.services.resume.loginTokens, function (token) {                                            // 1005
      return token.token === options.resume;                                                                       // 1006
    });                                                                                                            // 1007
    oldUnhashedStyleToken = true;                                                                                  // 1008
  }                                                                                                                // 1009
                                                                                                                   //
  var tokenExpires = accounts._tokenExpiration(token.when);                                                        // 1011
  if (new Date() >= tokenExpires) return {                                                                         // 1012
    userId: user._id,                                                                                              // 1014
    error: new Meteor.Error(403, "Your session has expired. Please log in again.")                                 // 1015
  };                                                                                                               // 1013
                                                                                                                   //
  // Update to a hashed token when an unhashed token is encountered.                                               // 1018
  if (oldUnhashedStyleToken) {                                                                                     // 1019
    // Only add the new hashed token if the old unhashed token still                                               // 1020
    // exists (this avoids resurrecting the token if it was deleted                                                // 1021
    // after we read it).  Using $addToSet avoids getting an index                                                 // 1022
    // error if another client logging in simultaneously has already                                               // 1023
    // inserted the new hashed token.                                                                              // 1024
    accounts.users.update({                                                                                        // 1025
      _id: user._id,                                                                                               // 1027
      "services.resume.loginTokens.token": options.resume                                                          // 1028
    }, { $addToSet: {                                                                                              // 1026
        "services.resume.loginTokens": {                                                                           // 1031
          "hashedToken": hashedToken,                                                                              // 1032
          "when": token.when                                                                                       // 1033
        }                                                                                                          // 1031
      } });                                                                                                        // 1030
                                                                                                                   //
    // Remove the old token *after* adding the new, since otherwise                                                // 1038
    // another client trying to login between our removing the old and                                             // 1039
    // adding the new wouldn't find a token to login with.                                                         // 1040
    accounts.users.update(user._id, {                                                                              // 1041
      $pull: {                                                                                                     // 1042
        "services.resume.loginTokens": { "token": options.resume }                                                 // 1043
      }                                                                                                            // 1042
    });                                                                                                            // 1041
  }                                                                                                                // 1046
                                                                                                                   //
  return {                                                                                                         // 1048
    userId: user._id,                                                                                              // 1049
    stampedLoginToken: {                                                                                           // 1050
      token: options.resume,                                                                                       // 1051
      when: token.when                                                                                             // 1052
    }                                                                                                              // 1050
  };                                                                                                               // 1048
}                                                                                                                  // 1055
                                                                                                                   //
// (Also used by Meteor Accounts server and tests).                                                                // 1057
//                                                                                                                 // 1058
Ap._generateStampedLoginToken = function () {                                                                      // 1059
  return {                                                                                                         // 1060
    token: Random.secret(),                                                                                        // 1061
    when: new Date()                                                                                               // 1062
  };                                                                                                               // 1060
};                                                                                                                 // 1064
                                                                                                                   //
///                                                                                                                // 1066
/// TOKEN EXPIRATION                                                                                               // 1067
///                                                                                                                // 1068
                                                                                                                   //
// Deletes expired tokens from the database and closes all open connections                                        // 1070
// associated with these tokens.                                                                                   // 1071
//                                                                                                                 // 1072
// Exported for tests. Also, the arguments are only used by                                                        // 1073
// tests. oldestValidDate is simulate expiring tokens without waiting                                              // 1074
// for them to actually expire. userId is used by tests to only expire                                             // 1075
// tokens for the test user.                                                                                       // 1076
Ap._expireTokens = function (oldestValidDate, userId) {                                                            // 1077
  var tokenLifetimeMs = this._getTokenLifetimeMs();                                                                // 1078
                                                                                                                   //
  // when calling from a test with extra arguments, you must specify both!                                         // 1080
  if (oldestValidDate && !userId || !oldestValidDate && userId) {                                                  // 1081
    throw new Error("Bad test. Must specify both oldestValidDate and userId.");                                    // 1082
  }                                                                                                                // 1083
                                                                                                                   //
  oldestValidDate = oldestValidDate || new Date(new Date() - tokenLifetimeMs);                                     // 1085
  var userFilter = userId ? { _id: userId } : {};                                                                  // 1087
                                                                                                                   //
  // Backwards compatible with older versions of meteor that stored login token                                    // 1090
  // timestamps as numbers.                                                                                        // 1091
  this.users.update(_.extend(userFilter, {                                                                         // 1092
    $or: [{ "services.resume.loginTokens.when": { $lt: oldestValidDate } }, { "services.resume.loginTokens.when": { $lt: +oldestValidDate } }]
  }), {                                                                                                            // 1092
    $pull: {                                                                                                       // 1098
      "services.resume.loginTokens": {                                                                             // 1099
        $or: [{ when: { $lt: oldestValidDate } }, { when: { $lt: +oldestValidDate } }]                             // 1100
      }                                                                                                            // 1099
    }                                                                                                              // 1098
  }, { multi: true });                                                                                             // 1097
  // The observe on Meteor.users will take care of closing connections for                                         // 1107
  // expired tokens.                                                                                               // 1108
};                                                                                                                 // 1109
                                                                                                                   //
// @override from accounts_common.js                                                                               // 1111
Ap.config = function (options) {                                                                                   // 1112
  // Call the overridden implementation of the method.                                                             // 1113
  var superResult = AccountsCommon.prototype.config.apply(this, arguments);                                        // 1114
                                                                                                                   //
  // If the user set loginExpirationInDays to null, then we need to clear the                                      // 1116
  // timer that periodically expires tokens.                                                                       // 1117
  if (_.has(this._options, "loginExpirationInDays") && this._options.loginExpirationInDays === null && this.expireTokenInterval) {
    Meteor.clearInterval(this.expireTokenInterval);                                                                // 1121
    this.expireTokenInterval = null;                                                                               // 1122
  }                                                                                                                // 1123
                                                                                                                   //
  return superResult;                                                                                              // 1125
};                                                                                                                 // 1126
                                                                                                                   //
function setExpireTokensInterval(accounts) {                                                                       // 1128
  accounts.expireTokenInterval = Meteor.setInterval(function () {                                                  // 1129
    accounts._expireTokens();                                                                                      // 1130
  }, EXPIRE_TOKENS_INTERVAL_MS);                                                                                   // 1131
}                                                                                                                  // 1132
                                                                                                                   //
///                                                                                                                // 1135
/// OAuth Encryption Support                                                                                       // 1136
///                                                                                                                // 1137
                                                                                                                   //
var OAuthEncryption = Package["oauth-encryption"] && Package["oauth-encryption"].OAuthEncryption;                  // 1139
                                                                                                                   //
function usingOAuthEncryption() {                                                                                  // 1143
  return OAuthEncryption && OAuthEncryption.keyIsLoaded();                                                         // 1144
}                                                                                                                  // 1145
                                                                                                                   //
// OAuth service data is temporarily stored in the pending credentials                                             // 1148
// collection during the oauth authentication process.  Sensitive data                                             // 1149
// such as access tokens are encrypted without the user id because                                                 // 1150
// we don't know the user id yet.  We re-encrypt these fields with the                                             // 1151
// user id included when storing the service data permanently in                                                   // 1152
// the users collection.                                                                                           // 1153
//                                                                                                                 // 1154
function pinEncryptedFieldsToUser(serviceData, userId) {                                                           // 1155
  _.each(_.keys(serviceData), function (key) {                                                                     // 1156
    var value = serviceData[key];                                                                                  // 1157
    if (OAuthEncryption && OAuthEncryption.isSealed(value)) value = OAuthEncryption.seal(OAuthEncryption.open(value), userId);
    serviceData[key] = value;                                                                                      // 1160
  });                                                                                                              // 1161
}                                                                                                                  // 1162
                                                                                                                   //
// Encrypt unencrypted login service secrets when oauth-encryption is                                              // 1165
// added.                                                                                                          // 1166
//                                                                                                                 // 1167
// XXX For the oauthSecretKey to be available here at startup, the                                                 // 1168
// developer must call Accounts.config({oauthSecretKey: ...}) at load                                              // 1169
// time, instead of in a Meteor.startup block, because the startup                                                 // 1170
// block in the app code will run after this accounts-base startup                                                 // 1171
// block.  Perhaps we need a post-startup callback?                                                                // 1172
                                                                                                                   //
Meteor.startup(function () {                                                                                       // 1174
  if (!usingOAuthEncryption()) {                                                                                   // 1175
    return;                                                                                                        // 1176
  }                                                                                                                // 1177
                                                                                                                   //
  var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;                                // 1179
                                                                                                                   //
  ServiceConfiguration.configurations.find({                                                                       // 1182
    $and: [{                                                                                                       // 1183
      secret: { $exists: true }                                                                                    // 1184
    }, {                                                                                                           // 1183
      "secret.algorithm": { $exists: false }                                                                       // 1186
    }]                                                                                                             // 1185
  }).forEach(function (config) {                                                                                   // 1182
    ServiceConfiguration.configurations.update(config._id, {                                                       // 1189
      $set: {                                                                                                      // 1190
        secret: OAuthEncryption.seal(config.secret)                                                                // 1191
      }                                                                                                            // 1190
    });                                                                                                            // 1189
  });                                                                                                              // 1194
});                                                                                                                // 1195
                                                                                                                   //
// XXX see comment on Accounts.createUser in passwords_server about adding a                                       // 1197
// second "server options" argument.                                                                               // 1198
function defaultCreateUserHook(options, user) {                                                                    // 1199
  if (options.profile) user.profile = options.profile;                                                             // 1200
  return user;                                                                                                     // 1202
}                                                                                                                  // 1203
                                                                                                                   //
// Called by accounts-password                                                                                     // 1205
Ap.insertUserDoc = function (options, user) {                                                                      // 1206
  // - clone user document, to protect from modification                                                           // 1207
  // - add createdAt timestamp                                                                                     // 1208
  // - prepare an _id, so that you can modify other collections (eg                                                // 1209
  // create a first task for every new user)                                                                       // 1210
  //                                                                                                               // 1211
  // XXX If the onCreateUser or validateNewUser hooks fail, we might                                               // 1212
  // end up having modified some other collection                                                                  // 1213
  // inappropriately. The solution is probably to have onCreateUser                                                // 1214
  // accept two callbacks - one that gets called before inserting                                                  // 1215
  // the user document (in which you can modify its contents), and                                                 // 1216
  // one that gets called after (in which you should change other                                                  // 1217
  // collections)                                                                                                  // 1218
  user = _.extend({                                                                                                // 1219
    createdAt: new Date(),                                                                                         // 1220
    _id: Random.id()                                                                                               // 1221
  }, user);                                                                                                        // 1219
                                                                                                                   //
  if (user.services) {                                                                                             // 1224
    _.each(user.services, function (serviceData) {                                                                 // 1225
      pinEncryptedFieldsToUser(serviceData, user._id);                                                             // 1226
    });                                                                                                            // 1227
  }                                                                                                                // 1228
                                                                                                                   //
  var fullUser;                                                                                                    // 1230
  if (this._onCreateUserHook) {                                                                                    // 1231
    fullUser = this._onCreateUserHook(options, user);                                                              // 1232
                                                                                                                   //
    // This is *not* part of the API. We need this because we can't isolate                                        // 1234
    // the global server environment between tests, meaning we can't test                                          // 1235
    // both having a create user hook set and not having one set.                                                  // 1236
    if (fullUser === 'TEST DEFAULT HOOK') fullUser = defaultCreateUserHook(options, user);                         // 1237
  } else {                                                                                                         // 1239
    fullUser = defaultCreateUserHook(options, user);                                                               // 1240
  }                                                                                                                // 1241
                                                                                                                   //
  _.each(this._validateNewUserHooks, function (hook) {                                                             // 1243
    if (!hook(fullUser)) throw new Meteor.Error(403, "User validation failed");                                    // 1244
  });                                                                                                              // 1246
                                                                                                                   //
  var userId;                                                                                                      // 1248
  try {                                                                                                            // 1249
    userId = this.users.insert(fullUser);                                                                          // 1250
  } catch (e) {                                                                                                    // 1251
    // XXX string parsing sucks, maybe                                                                             // 1252
    // https://jira.mongodb.org/browse/SERVER-3069 will get fixed one day                                          // 1253
    if (e.name !== 'MongoError') throw e;                                                                          // 1254
    if (e.code !== 11000) throw e;                                                                                 // 1255
    if (e.err.indexOf('emails.address') !== -1) throw new Meteor.Error(403, "Email already exists.");              // 1256
    if (e.err.indexOf('username') !== -1) throw new Meteor.Error(403, "Username already exists.");                 // 1258
    // XXX better error reporting for services.facebook.id duplicate, etc                                          // 1260
    throw e;                                                                                                       // 1261
  }                                                                                                                // 1262
  return userId;                                                                                                   // 1263
};                                                                                                                 // 1264
                                                                                                                   //
// Helper function: returns false if email does not match company domain from                                      // 1266
// the configuration.                                                                                              // 1267
Ap._testEmailDomain = function (email) {                                                                           // 1268
  var domain = this._options.restrictCreationByEmailDomain;                                                        // 1269
  return !domain || _.isFunction(domain) && domain(email) || _.isString(domain) && new RegExp('@' + Meteor._escapeRegExp(domain) + '$', 'i').test(email);
};                                                                                                                 // 1274
                                                                                                                   //
// Validate new user's email or Google/Facebook/GitHub account's email                                             // 1276
function defaultValidateNewUserHook(user) {                                                                        // 1277
  var self = this;                                                                                                 // 1278
  var domain = self._options.restrictCreationByEmailDomain;                                                        // 1279
  if (!domain) return true;                                                                                        // 1280
                                                                                                                   //
  var emailIsGood = false;                                                                                         // 1283
  if (!_.isEmpty(user.emails)) {                                                                                   // 1284
    emailIsGood = _.any(user.emails, function (email) {                                                            // 1285
      return self._testEmailDomain(email.address);                                                                 // 1286
    });                                                                                                            // 1287
  } else if (!_.isEmpty(user.services)) {                                                                          // 1288
    // Find any email of any service and check it                                                                  // 1289
    emailIsGood = _.any(user.services, function (service) {                                                        // 1290
      return service.email && self._testEmailDomain(service.email);                                                // 1291
    });                                                                                                            // 1292
  }                                                                                                                // 1293
                                                                                                                   //
  if (emailIsGood) return true;                                                                                    // 1295
                                                                                                                   //
  if (_.isString(domain)) throw new Meteor.Error(403, "@" + domain + " email required");else throw new Meteor.Error(403, "Email doesn't match the criteria.");
}                                                                                                                  // 1302
                                                                                                                   //
///                                                                                                                // 1304
/// MANAGING USER OBJECTS                                                                                          // 1305
///                                                                                                                // 1306
                                                                                                                   //
// Updates or creates a user after we authenticate with a 3rd party.                                               // 1308
//                                                                                                                 // 1309
// @param serviceName {String} Service name (eg, twitter).                                                         // 1310
// @param serviceData {Object} Data to store in the user's record                                                  // 1311
//        under services[serviceName]. Must include an "id" field                                                  // 1312
//        which is a unique identifier for the user in the service.                                                // 1313
// @param options {Object, optional} Other options to pass to insertUserDoc                                        // 1314
//        (eg, profile)                                                                                            // 1315
// @returns {Object} Object with token and id keys, like the result                                                // 1316
//        of the "login" method.                                                                                   // 1317
//                                                                                                                 // 1318
Ap.updateOrCreateUserFromExternalService = function (serviceName, serviceData, options) {                          // 1319
  options = _.clone(options || {});                                                                                // 1324
                                                                                                                   //
  if (serviceName === "password" || serviceName === "resume") throw new Error("Can't use updateOrCreateUserFromExternalService with internal service " + serviceName);
  if (!_.has(serviceData, 'id')) throw new Error("Service data for service " + serviceName + " must include id");  // 1330
                                                                                                                   //
  // Look for a user with the appropriate service user id.                                                         // 1334
  var selector = {};                                                                                               // 1335
  var serviceIdKey = "services." + serviceName + ".id";                                                            // 1336
                                                                                                                   //
  // XXX Temporary special case for Twitter. (Issue #629)                                                          // 1338
  //   The serviceData.id will be a string representation of an integer.                                           // 1339
  //   We want it to match either a stored string or int representation.                                           // 1340
  //   This is to cater to earlier versions of Meteor storing twitter                                              // 1341
  //   user IDs in number form, and recent versions storing them as strings.                                       // 1342
  //   This can be removed once migration technology is in place, and twitter                                      // 1343
  //   users stored with integer IDs have been migrated to string IDs.                                             // 1344
  if (serviceName === "twitter" && !isNaN(serviceData.id)) {                                                       // 1345
    selector["$or"] = [{}, {}];                                                                                    // 1346
    selector["$or"][0][serviceIdKey] = serviceData.id;                                                             // 1347
    selector["$or"][1][serviceIdKey] = parseInt(serviceData.id, 10);                                               // 1348
  } else {                                                                                                         // 1349
    selector[serviceIdKey] = serviceData.id;                                                                       // 1350
  }                                                                                                                // 1351
                                                                                                                   //
  var user = this.users.findOne(selector);                                                                         // 1353
                                                                                                                   //
  if (user) {                                                                                                      // 1355
    pinEncryptedFieldsToUser(serviceData, user._id);                                                               // 1356
                                                                                                                   //
    // We *don't* process options (eg, profile) for update, but we do replace                                      // 1358
    // the serviceData (eg, so that we keep an unexpired access token and                                          // 1359
    // don't cache old email addresses in serviceData.email).                                                      // 1360
    // XXX provide an onUpdateUser hook which would let apps update                                                // 1361
    //     the profile too                                                                                         // 1362
    var setAttrs = {};                                                                                             // 1363
    _.each(serviceData, function (value, key) {                                                                    // 1364
      setAttrs["services." + serviceName + "." + key] = value;                                                     // 1365
    });                                                                                                            // 1366
                                                                                                                   //
    // XXX Maybe we should re-use the selector above and notice if the update                                      // 1368
    //     touches nothing?                                                                                        // 1369
    this.users.update(user._id, {                                                                                  // 1370
      $set: setAttrs                                                                                               // 1371
    });                                                                                                            // 1370
                                                                                                                   //
    return {                                                                                                       // 1374
      type: serviceName,                                                                                           // 1375
      userId: user._id                                                                                             // 1376
    };                                                                                                             // 1374
  } else {                                                                                                         // 1379
    // Create a new user with the service data. Pass other options through to                                      // 1380
    // insertUserDoc.                                                                                              // 1381
    user = { services: {} };                                                                                       // 1382
    user.services[serviceName] = serviceData;                                                                      // 1383
    return {                                                                                                       // 1384
      type: serviceName,                                                                                           // 1385
      userId: this.insertUserDoc(options, user)                                                                    // 1386
    };                                                                                                             // 1384
  }                                                                                                                // 1388
};                                                                                                                 // 1389
                                                                                                                   //
function setupUsersCollection(users) {                                                                             // 1391
  ///                                                                                                              // 1392
  /// RESTRICTING WRITES TO USER OBJECTS                                                                           // 1393
  ///                                                                                                              // 1394
  users.allow({                                                                                                    // 1395
    // clients can modify the profile field of their own document, and                                             // 1396
    // nothing else.                                                                                               // 1397
    update: function () {                                                                                          // 1398
      function update(userId, user, fields, modifier) {                                                            // 1398
        // make sure it is our record                                                                              // 1399
        if (user._id !== userId) return false;                                                                     // 1400
                                                                                                                   //
        // user can only modify the 'profile' field. sets to multiple                                              // 1403
        // sub-keys (eg profile.foo and profile.bar) are merged into entry                                         // 1404
        // in the fields list.                                                                                     // 1405
        if (fields.length !== 1 || fields[0] !== 'profile') return false;                                          // 1406
                                                                                                                   //
        return true;                                                                                               // 1409
      }                                                                                                            // 1410
                                                                                                                   //
      return update;                                                                                               // 1398
    }(),                                                                                                           // 1398
    fetch: ['_id'] // we only look at _id.                                                                         // 1411
  });                                                                                                              // 1395
                                                                                                                   //
  /// DEFAULT INDEXES ON USERS                                                                                     // 1414
  users._ensureIndex('username', { unique: 1, sparse: 1 });                                                        // 1415
  users._ensureIndex('emails.address', { unique: 1, sparse: 1 });                                                  // 1416
  users._ensureIndex('services.resume.loginTokens.hashedToken', { unique: 1, sparse: 1 });                         // 1417
  users._ensureIndex('services.resume.loginTokens.token', { unique: 1, sparse: 1 });                               // 1419
  // For taking care of logoutOtherClients calls that crashed before the                                           // 1421
  // tokens were deleted.                                                                                          // 1422
  users._ensureIndex('services.resume.haveLoginTokensToDelete', { sparse: 1 });                                    // 1423
  // For expiring login tokens                                                                                     // 1425
  users._ensureIndex("services.resume.loginTokens.when", { sparse: 1 });                                           // 1426
}                                                                                                                  // 1427
                                                                                                                   //
///                                                                                                                // 1429
/// CLEAN UP FOR `logoutOtherClients`                                                                              // 1430
///                                                                                                                // 1431
                                                                                                                   //
Ap._deleteSavedTokensForUser = function (userId, tokensToDelete) {                                                 // 1433
  if (tokensToDelete) {                                                                                            // 1434
    this.users.update(userId, {                                                                                    // 1435
      $unset: {                                                                                                    // 1436
        "services.resume.haveLoginTokensToDelete": 1,                                                              // 1437
        "services.resume.loginTokensToDelete": 1                                                                   // 1438
      },                                                                                                           // 1436
      $pullAll: {                                                                                                  // 1440
        "services.resume.loginTokens": tokensToDelete                                                              // 1441
      }                                                                                                            // 1440
    });                                                                                                            // 1435
  }                                                                                                                // 1444
};                                                                                                                 // 1445
                                                                                                                   //
Ap._deleteSavedTokensForAllUsersOnStartup = function () {                                                          // 1447
  var self = this;                                                                                                 // 1448
                                                                                                                   //
  // If we find users who have saved tokens to delete on startup, delete                                           // 1450
  // them now. It's possible that the server could have crashed and come                                           // 1451
  // back up before new tokens are found in localStorage, but this                                                 // 1452
  // shouldn't happen very often. We shouldn't put a delay here because                                            // 1453
  // that would give a lot of power to an attacker with a stolen login                                             // 1454
  // token and the ability to crash the server.                                                                    // 1455
  Meteor.startup(function () {                                                                                     // 1456
    self.users.find({                                                                                              // 1457
      "services.resume.haveLoginTokensToDelete": true                                                              // 1458
    }, {                                                                                                           // 1457
      "services.resume.loginTokensToDelete": 1                                                                     // 1460
    }).forEach(function (user) {                                                                                   // 1459
      self._deleteSavedTokensForUser(user._id, user.services.resume.loginTokensToDelete);                          // 1462
    });                                                                                                            // 1466
  });                                                                                                              // 1467
};                                                                                                                 // 1468
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"url_server.js":["./accounts_server.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-base/url_server.js                                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var AccountsServer;module.import("./accounts_server.js",{"AccountsServer":function(v){AccountsServer=v}});         // 1
                                                                                                                   //
// XXX These should probably not actually be public?                                                               // 3
                                                                                                                   //
AccountsServer.prototype.urls = {                                                                                  // 5
  resetPassword: function () {                                                                                     // 6
    function resetPassword(token) {                                                                                // 6
      return Meteor.absoluteUrl('#/reset-password/' + token);                                                      // 7
    }                                                                                                              // 8
                                                                                                                   //
    return resetPassword;                                                                                          // 6
  }(),                                                                                                             // 6
                                                                                                                   //
  verifyEmail: function () {                                                                                       // 10
    function verifyEmail(token) {                                                                                  // 10
      return Meteor.absoluteUrl('#/verify-email/' + token);                                                        // 11
    }                                                                                                              // 12
                                                                                                                   //
    return verifyEmail;                                                                                            // 10
  }(),                                                                                                             // 10
                                                                                                                   //
  enrollAccount: function () {                                                                                     // 14
    function enrollAccount(token) {                                                                                // 14
      return Meteor.absoluteUrl('#/enroll-account/' + token);                                                      // 15
    }                                                                                                              // 16
                                                                                                                   //
    return enrollAccount;                                                                                          // 14
  }()                                                                                                              // 14
};                                                                                                                 // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}}},{"extensions":[".js",".json"]});
var exports = require("./node_modules/meteor/accounts-base/server_main.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['accounts-base'] = exports, {
  Accounts: Accounts
});

})();

//# sourceMappingURL=accounts-base.js.map
