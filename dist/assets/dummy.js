"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('dummy/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'dummy/config/environment'], function (exports, _ember, _emberResolver, _emberLoadInitializers, _dummyConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _dummyConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _dummyConfigEnvironment['default'].podModulePrefix,
    Resolver: _emberResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _dummyConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('dummy/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'dummy/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _dummyConfigEnvironment) {

  var name = _dummyConfigEnvironment['default'].APP.name;
  var version = _dummyConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('dummy/controllers/array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('dummy/controllers/object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('dummy/ember-cli-facebook-js-sdk/tests/modules/ember-cli-facebook-js-sdk/services/fb.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint - modules/ember-cli-facebook-js-sdk/services/fb.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-cli-facebook-js-sdk/services/fb.js should pass jshint.');
  });
});
define('dummy/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'dummy/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _dummyConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_dummyConfigEnvironment['default'].APP.name, _dummyConfigEnvironment['default'].APP.version)
  };
});
define('dummy/initializers/export-application-global', ['exports', 'ember', 'dummy/config/environment'], function (exports, _ember, _dummyConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_dummyConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _dummyConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_dummyConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define("dummy/instance-initializers/browser/clear-double-boot", ["exports"], function (exports) {
  /*globals Ember*/

  // When using `ember fastboot --serve-assets` the application output will
  // already be rendered to the DOM when the actual JavaScript loads. Ember
  // does not automatically clear its `rootElement` so this leads to the
  // "double" applications being visible at once (only the "bottom" one is
  // running via JS and is interactive).
  //
  // This removes any pre-rendered ember-view elements, so that the booting
  // application will replace the pre-rendered output

  exports["default"] = {
    name: "clear-double-boot",

    initialize: function initialize(instance) {
      var originalDidCreateRootView = instance.didCreateRootView;

      instance.didCreateRootView = function () {
        var elements = document.querySelectorAll(instance.rootElement + ' .ember-view');
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          element.parentNode.removeChild(element);
        }

        originalDidCreateRootView.apply(instance, arguments);
      };
    }
  };
});
define('dummy/locations/none', ['exports', 'ember'], function (exports, _ember) {
  var computed = _ember['default'].computed;
  var reads = _ember['default'].computed.reads;
  var service = _ember['default'].inject.service;
  var get = _ember['default'].get;
  var getOwner = _ember['default'].getOwner;
  exports['default'] = _ember['default'].NoneLocation.extend({
    implementation: 'fastboot',
    fastboot: service(),

    _fastbootHeadersEnabled: computed(function () {
      var config = getOwner(this).resolveRegistration('config:environment');
      return !!get(config, 'fastboot.fastbootHeaders');
    }),

    _redirectCode: computed(function () {
      var TEMPORARY_REDIRECT_CODE = 307;
      var config = getOwner(this).resolveRegistration('config:environment');
      return get(config, 'fastboot.redirectCode') || TEMPORARY_REDIRECT_CODE;
    }),

    _response: reads('fastboot.response'),
    _request: reads('fastboot.request'),

    setURL: function setURL(path) {
      if (get(this, 'fastboot.isFastBoot')) {
        var currentPath = get(this, 'path');
        var isInitialPath = !currentPath || currentPath.length === 0;
        var isTransitioning = currentPath !== path;
        var response = get(this, '_response');

        if (isTransitioning && !isInitialPath) {
          var protocol = get(this, '_request.protocol');
          var host = get(this, '_request.host');
          var redirectURL = protocol + '://' + host + path;

          response.statusCode = this.get('_redirectCode');
          response.headers.set('location', redirectURL);
        }

        // for testing and debugging
        if (get(this, '_fastbootHeadersEnabled')) {
          response.headers.set('x-fastboot-path', path);
        }
      }

      this._super.apply(this, arguments);
    }
  });
});
define('dummy/router', ['exports', 'ember', 'dummy/config/environment'], function (exports, _ember, _dummyConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _dummyConfigEnvironment['default'].locationType
  });

  Router.map(function () {});

  exports['default'] = Router;
});
define('dummy/services/fastboot', ['exports', 'ember'], function (exports, _ember) {
  var deprecate = _ember['default'].deprecate;
  var computed = _ember['default'].computed;
  var get = _ember['default'].get;
  var deprecatingAlias = computed.deprecatingAlias;
  var readOnly = computed.readOnly;

  var RequestObject = _ember['default'].Object.extend({
    init: function init() {
      this._super.apply(this, arguments);

      var request = this.request;
      delete this.request;

      this.cookies = request.cookies;
      this.headers = request.headers;
      this.queryParams = request.queryParams;
      this.path = request.path;
      this.protocol = request.protocol;
      this._host = function () {
        return request.host();
      };
    },

    host: computed(function () {
      return this._host();
    })
  });

  var Shoebox = _ember['default'].Object.extend({
    put: function put(key, value) {
      _ember['default'].assert('shoebox.put is only invoked from the FastBoot rendered application', this.get('fastboot.isFastBoot'));
      _ember['default'].assert('the provided key is a string', typeof key === 'string');

      var fastbootInfo = this.get('fastboot._fastbootInfo');
      if (!fastbootInfo.shoebox) {
        fastbootInfo.shoebox = {};
      }

      fastbootInfo.shoebox[key] = value;
    },

    retrieve: function retrieve(key) {
      if (this.get('fastboot.isFastBoot')) {
        var shoebox = this.get('fastboot._fastbootInfo.shoebox');
        if (!shoebox) {
          return;
        }

        return shoebox[key];
      }

      var shoeboxItem = this.get(key);
      if (shoeboxItem) {
        return shoeboxItem;
      }

      var el = document.querySelector('#shoebox-' + key);
      if (!el) {
        return;
      }
      var valueString = el.textContent;
      if (!valueString) {
        return;
      }

      shoeboxItem = JSON.parse(valueString);
      this.set(key, shoeboxItem);

      return shoeboxItem;
    }
  });

  exports['default'] = _ember['default'].Service.extend({
    cookies: deprecatingAlias('request.cookies', { id: 'fastboot.cookies-to-request', until: '0.9.9' }),
    headers: deprecatingAlias('request.headers', { id: 'fastboot.headers-to-request', until: '0.9.9' }),

    init: function init() {
      this._super.apply(this, arguments);

      var shoebox = Shoebox.create({ fastboot: this });
      this.set('shoebox', shoebox);
    },

    host: computed(function () {
      deprecate('Usage of fastboot service\'s `host` property is deprecated.  Please use `request.host` instead.', false, { id: 'fastboot.host-to-request', until: '0.9.9' });

      return this._fastbootInfo.request.host();
    }),

    response: readOnly('_fastbootInfo.response'),

    request: computed(function () {
      if (!get(this, 'isFastBoot')) return null;
      return RequestObject.create({ request: get(this, '_fastbootInfo.request') });
    }),

    isFastBoot: computed(function () {
      return typeof FastBoot !== 'undefined';
    }),

    deferRendering: function deferRendering(promise) {
      _ember['default'].assert('deferRendering requires a promise or thennable object', typeof promise.then === 'function');
      this._fastbootInfo.deferRendering(promise);
    }
  });
});
/* global FastBoot */
define('dummy/services/fb', ['exports', 'ember-cli-facebook-js-sdk/services/fb'], function (exports, _emberCliFacebookJsSdkServicesFb) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFacebookJsSdkServicesFb['default'];
    }
  });
});
define("dummy/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        dom.setAttribute(el1, "id", "title");
        var el2 = dom.createTextNode("Welcome to Ember");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [3, 0], [3, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('dummy/config/environment', ['ember'], function(Ember) {
  var prefix = 'dummy';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (!runningTests) {
  require("dummy/app")["default"].create({"name":"ember-cli-facebook-js-sdk","version":"1.0.4+8c9d275c"});
}

define('~fastboot/app-factory', ['dummy/app', 'dummy/config/environment'], function(App, config) {
  App = App['default'];
  config = config['default'];

  return {
    'default': function() {
      return App.create(config.APP);
    }
  };
});


/* jshint ignore:end */
//# sourceMappingURL=dummy.map