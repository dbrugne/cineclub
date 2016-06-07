webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(38);

	var _reactRedux = __webpack_require__(168);

	var _configureStore = __webpack_require__(190);

	var _configureStore2 = _interopRequireDefault(_configureStore);

	var _history = __webpack_require__(201);

	var _reactRouter = __webpack_require__(227);

	var _reactRouterRedux = __webpack_require__(191);

	var _App = __webpack_require__(264);

	var _App2 = _interopRequireDefault(_App);

	var _NotFound = __webpack_require__(271);

	var _NotFound2 = _interopRequireDefault(_NotFound);

	var _WhatsNew = __webpack_require__(272);

	var _WhatsNew2 = _interopRequireDefault(_WhatsNew);

	var _Medias = __webpack_require__(280);

	var _Medias2 = _interopRequireDefault(_Medias);

	var _Media = __webpack_require__(281);

	var _Media2 = _interopRequireDefault(_Media);

	var _Admin = __webpack_require__(283);

	var _Admin2 = _interopRequireDefault(_Admin);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var browserHistory = (0, _reactRouter.useRouterHistory)(_history.createHistory)({
	  basename: '/app'
	});

	var store = (0, _configureStore2.default)(browserHistory);

	var history = (0, _reactRouterRedux.syncHistoryWithStore)(browserHistory, store);

	(0, _reactDom.render)(_react2.default.createElement(
	  _reactRedux.Provider,
	  { store: store },
	  _react2.default.createElement(
	    _reactRouter.Router,
	    { history: history },
	    _react2.default.createElement(
	      _reactRouter.Route,
	      { path: '/', component: _App2.default },
	      _react2.default.createElement(_reactRouter.IndexRoute, { component: _WhatsNew2.default }),
	      _react2.default.createElement(_reactRouter.Route, { path: 'medias', component: _Medias2.default }),
	      _react2.default.createElement(_reactRouter.Route, { path: '/medias/:mediaId', component: _Media2.default }),
	      _react2.default.createElement(_reactRouter.Route, { path: 'admin', component: _Admin2.default }),
	      _react2.default.createElement(_reactRouter.Route, { path: '*', component: _NotFound2.default })
	    )
	  )
	), document.getElementById('app'));

/***/ },

/***/ 190:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = configureStore;

	var _redux = __webpack_require__(175);

	var _reactRouterRedux = __webpack_require__(191);

	var _reduxThunk = __webpack_require__(196);

	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

	var _reduxLogger = __webpack_require__(197);

	var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

	var _WhatsNewReducer = __webpack_require__(198);

	var _WhatsNewReducer2 = _interopRequireDefault(_WhatsNewReducer);

	var _MediasReducer = __webpack_require__(199);

	var _MediasReducer2 = _interopRequireDefault(_MediasReducer);

	var _MediaReducer = __webpack_require__(200);

	var _MediaReducer2 = _interopRequireDefault(_MediaReducer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var reducers = (0, _redux.combineReducers)({
	  whatsnew: _WhatsNewReducer2.default,
	  medias: _MediasReducer2.default,
	  media: _MediaReducer2.default,
	  routing: _reactRouterRedux.routerReducer
	});

	// store


	// reducers
	function configureStore(history, initialState) {
	  return (0, _redux.createStore)(reducers, initialState, (0, _redux.applyMiddleware)((0, _reactRouterRedux.routerMiddleware)(history), _reduxThunk2.default, (0, _reduxLogger2.default)()));
	}

/***/ },

/***/ 198:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = WhatsNewReducer;
	var initialState = {
	  period: 1,
	  isFetching: false,
	  error: null,
	  movies: [],
	  series: [],
	  unknown: [],
	  removed: [],
	  lastUpdated: null
	};

	function WhatsNewReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case 'WN_CHANGE_PERIOD':
	      return Object.assign({}, state, { period: action.period });
	    case 'WN_REQUEST':
	      return Object.assign({}, state, {
	        isFetching: true
	      });
	    case 'WN_RECEIVE':
	      return Object.assign({}, state, {
	        isFetching: false,
	        movies: action.movies,
	        series: action.series,
	        unknown: action.unknown,
	        removed: action.removed,
	        lastUpdated: action.receivedAt
	      });
	    case 'WN_ERROR':
	      return Object.assign({}, state, {
	        error: action.error.message,
	        isFetching: false
	      });

	    default:
	      return state;
	  }
	}

/***/ },

/***/ 199:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = MediaReducer;
	var initialState = {
	  isFetching: false,
	  error: null,
	  search: null,
	  category: null,
	  page: 1,
	  pages: 0,
	  items: [],
	  lastFetch: null
	};

	function MediaReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case 'MEDIAS_SEARCH':
	      return Object.assign({}, state, {
	        search: action.search,
	        page: 1
	      });
	    case 'MEDIAS_CATEGORY':
	      return Object.assign({}, state, {
	        category: action.category,
	        page: 1
	      });
	    case 'MEDIAS_PAGE':
	      return Object.assign({}, state, {
	        page: action.page
	      });
	    case 'MEDIAS_REQUEST':
	      return Object.assign({}, state, {
	        isFetching: true
	      });
	    case 'MEDIAS_RECEIVE':
	      return Object.assign({}, state, {
	        isFetching: false,
	        error: null,
	        items: action.items ? action.items : [],
	        pages: action.pages ? action.pages : 0,
	        lastFetch: Date.now()
	      });
	    case 'MEDIAS_ERROR':
	      return Object.assign({}, state, {
	        error: action.error.message,
	        isFetching: false,
	        items: [],
	        pages: 0,
	        lastFetch: null
	      });

	    default:
	      return state;
	  }
	}

/***/ },

/***/ 200:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = MediaReducer;
	var initialState = {
	  isFetching: false,
	  error: null,
	  data: null
	};

	function MediaReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case 'MEDIA_REQUEST':
	      return Object.assign({}, state, {
	        isFetching: true
	      });
	    case 'MEDIA_RECEIVE':
	      return Object.assign({}, state, {
	        isFetching: false,
	        data: action.data
	      });
	    case 'MEDIA_ERROR':
	      return Object.assign({}, state, {
	        error: action.error.message,
	        isFetching: false
	      });

	    default:
	      return state;
	  }
	}

/***/ },

/***/ 201:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _deprecate = __webpack_require__(202);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	var _createLocation2 = __webpack_require__(204);

	var _createLocation3 = _interopRequireDefault(_createLocation2);

	var _createBrowserHistory = __webpack_require__(207);

	var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

	exports.createHistory = _createBrowserHistory2['default'];

	var _createHashHistory2 = __webpack_require__(218);

	var _createHashHistory3 = _interopRequireDefault(_createHashHistory2);

	exports.createHashHistory = _createHashHistory3['default'];

	var _createMemoryHistory2 = __webpack_require__(219);

	var _createMemoryHistory3 = _interopRequireDefault(_createMemoryHistory2);

	exports.createMemoryHistory = _createMemoryHistory3['default'];

	var _useBasename2 = __webpack_require__(220);

	var _useBasename3 = _interopRequireDefault(_useBasename2);

	exports.useBasename = _useBasename3['default'];

	var _useBeforeUnload2 = __webpack_require__(221);

	var _useBeforeUnload3 = _interopRequireDefault(_useBeforeUnload2);

	exports.useBeforeUnload = _useBeforeUnload3['default'];

	var _useQueries2 = __webpack_require__(222);

	var _useQueries3 = _interopRequireDefault(_useQueries2);

	exports.useQueries = _useQueries3['default'];

	var _Actions2 = __webpack_require__(205);

	var _Actions3 = _interopRequireDefault(_Actions2);

	exports.Actions = _Actions3['default'];

	// deprecated

	var _enableBeforeUnload2 = __webpack_require__(225);

	var _enableBeforeUnload3 = _interopRequireDefault(_enableBeforeUnload2);

	exports.enableBeforeUnload = _enableBeforeUnload3['default'];

	var _enableQueries2 = __webpack_require__(226);

	var _enableQueries3 = _interopRequireDefault(_enableQueries2);

	exports.enableQueries = _enableQueries3['default'];
	var createLocation = _deprecate2['default'](_createLocation3['default'], 'Using createLocation without a history instance is deprecated; please use history.createLocation instead');
	exports.createLocation = createLocation;

/***/ },

/***/ 221:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _warning = __webpack_require__(203);

	var _warning2 = _interopRequireDefault(_warning);

	var _ExecutionEnvironment = __webpack_require__(208);

	var _DOMUtils = __webpack_require__(209);

	var _deprecate = __webpack_require__(202);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	function startBeforeUnloadListener(getBeforeUnloadPromptMessage) {
	  function listener(event) {
	    var message = getBeforeUnloadPromptMessage();

	    if (typeof message === 'string') {
	      (event || window.event).returnValue = message;
	      return message;
	    }
	  }

	  _DOMUtils.addEventListener(window, 'beforeunload', listener);

	  return function () {
	    _DOMUtils.removeEventListener(window, 'beforeunload', listener);
	  };
	}

	/**
	 * Returns a new createHistory function that can be used to create
	 * history objects that know how to use the beforeunload event in web
	 * browsers to cancel navigation.
	 */
	function useBeforeUnload(createHistory) {
	  return function (options) {
	    var history = createHistory(options);

	    var stopBeforeUnloadListener = undefined;
	    var beforeUnloadHooks = [];

	    function getBeforeUnloadPromptMessage() {
	      var message = undefined;

	      for (var i = 0, len = beforeUnloadHooks.length; message == null && i < len; ++i) {
	        message = beforeUnloadHooks[i].call();
	      }return message;
	    }

	    function listenBeforeUnload(hook) {
	      beforeUnloadHooks.push(hook);

	      if (beforeUnloadHooks.length === 1) {
	        if (_ExecutionEnvironment.canUseDOM) {
	          stopBeforeUnloadListener = startBeforeUnloadListener(getBeforeUnloadPromptMessage);
	        } else {
	          process.env.NODE_ENV !== 'production' ? _warning2['default'](false, 'listenBeforeUnload only works in DOM environments') : undefined;
	        }
	      }

	      return function () {
	        beforeUnloadHooks = beforeUnloadHooks.filter(function (item) {
	          return item !== hook;
	        });

	        if (beforeUnloadHooks.length === 0 && stopBeforeUnloadListener) {
	          stopBeforeUnloadListener();
	          stopBeforeUnloadListener = null;
	        }
	      };
	    }

	    // deprecated
	    function registerBeforeUnloadHook(hook) {
	      if (_ExecutionEnvironment.canUseDOM && beforeUnloadHooks.indexOf(hook) === -1) {
	        beforeUnloadHooks.push(hook);

	        if (beforeUnloadHooks.length === 1) stopBeforeUnloadListener = startBeforeUnloadListener(getBeforeUnloadPromptMessage);
	      }
	    }

	    // deprecated
	    function unregisterBeforeUnloadHook(hook) {
	      if (beforeUnloadHooks.length > 0) {
	        beforeUnloadHooks = beforeUnloadHooks.filter(function (item) {
	          return item !== hook;
	        });

	        if (beforeUnloadHooks.length === 0) stopBeforeUnloadListener();
	      }
	    }

	    return _extends({}, history, {
	      listenBeforeUnload: listenBeforeUnload,

	      registerBeforeUnloadHook: _deprecate2['default'](registerBeforeUnloadHook, 'registerBeforeUnloadHook is deprecated; use listenBeforeUnload instead'),
	      unregisterBeforeUnloadHook: _deprecate2['default'](unregisterBeforeUnloadHook, 'unregisterBeforeUnloadHook is deprecated; use the callback returned from listenBeforeUnload instead')
	    });
	  };
	}

	exports['default'] = useBeforeUnload;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },

/***/ 225:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _deprecate = __webpack_require__(202);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	var _useBeforeUnload = __webpack_require__(221);

	var _useBeforeUnload2 = _interopRequireDefault(_useBeforeUnload);

	exports['default'] = _deprecate2['default'](_useBeforeUnload2['default'], 'enableBeforeUnload is deprecated, use useBeforeUnload instead');
	module.exports = exports['default'];

/***/ },

/***/ 226:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _deprecate = __webpack_require__(202);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	var _useQueries = __webpack_require__(222);

	var _useQueries2 = _interopRequireDefault(_useQueries);

	exports['default'] = _deprecate2['default'](_useQueries2['default'], 'enableQueries is deprecated, use useQueries instead');
	module.exports = exports['default'];

/***/ },

/***/ 264:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Navigation = __webpack_require__(265);

	var _Navigation2 = _interopRequireDefault(_Navigation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var App = function App(props) {
	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(_Navigation2.default, { currentLocation: props.location.pathname }),
	    props.children
	  );
	};

	App.propTypes = {
	  location: _react2.default.PropTypes.object,
	  children: _react2.default.PropTypes.node
	};

	exports.default = App;

/***/ },

/***/ 265:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(168);

	var _reactRouter = __webpack_require__(227);

	var _reactRouterRedux = __webpack_require__(191);

	var _MediasActions = __webpack_require__(266);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Navigation = function (_React$Component) {
	  _inherits(Navigation, _React$Component);

	  function Navigation(props) {
	    _classCallCheck(this, Navigation);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Navigation).call(this, props));

	    _this.onSearchChange = _this.onSearchChange.bind(_this);
	    _this.onSearchSubmit = _this.onSearchSubmit.bind(_this);
	    return _this;
	  }

	  _createClass(Navigation, [{
	    key: 'onSearchChange',
	    value: function onSearchChange(e) {
	      if (this.props.currentLocation !== '/medias') {
	        this.props.dispatch((0, _reactRouterRedux.push)('medias'));
	      }

	      var search = e.target.value;
	      this.props.dispatch((0, _MediasActions.changeSearch)(search));
	    }
	  }, {
	    key: 'onSearchSubmit',
	    value: function onSearchSubmit() {
	      if (this.props.currentLocation !== '/medias') {
	        this.props.dispatch((0, _reactRouterRedux.push)('medias'));
	      }
	      this.props.dispatch((0, _MediasActions.fetchMedias)(this.props.search, this.props.category, 1));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'nav',
	        { className: 'navbar navbar-default navbar-fixed-top' },
	        _react2.default.createElement(
	          'div',
	          { className: 'container' },
	          _react2.default.createElement(
	            'div',
	            { className: 'navbar-header' },
	            _react2.default.createElement(
	              'button',
	              {
	                type: 'button',
	                className: 'navbar-toggle collapsed',
	                'data-toggle': 'collapse',
	                'data-target': '#bs-example-navbar-collapse-1',
	                'aria-expanded': 'false'
	              },
	              _react2.default.createElement(
	                'span',
	                { className: 'sr-only' },
	                'Toggle navigation'
	              ),
	              _react2.default.createElement('span', { className: 'icon-bar' }),
	              _react2.default.createElement('span', { className: 'icon-bar' }),
	              _react2.default.createElement('span', { className: 'icon-bar' })
	            ),
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { className: 'navbar-brand', to: '/' },
	              'Ciné-club'
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'collapse navbar-collapse', id: 'bs-example-navbar-collapse-1' },
	            _react2.default.createElement(
	              'ul',
	              { className: 'nav navbar-nav' },
	              _react2.default.createElement(
	                'li',
	                { className: this.props.currentLocation === '/medias' ? 'active' : null },
	                _react2.default.createElement(
	                  _reactRouter.Link,
	                  { to: '/medias' },
	                  'Medias'
	                )
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'navbar-form navbar-left', role: 'search' },
	              _react2.default.createElement(
	                'div',
	                { className: 'form-group' },
	                _react2.default.createElement('input', {
	                  type: 'text',
	                  className: 'form-control',
	                  placeholder: 'Search',
	                  onChange: this.onSearchChange,
	                  value: this.props.search
	                })
	              ),
	              _react2.default.createElement(
	                'button',
	                { className: 'btn btn-default', onClick: this.onSearchSubmit },
	                'Submit'
	              )
	            ),
	            _react2.default.createElement(
	              'ul',
	              { className: 'nav navbar-nav navbar-right' },
	              _react2.default.createElement(
	                'li',
	                { className: this.props.currentLocation === '/admin' ? 'active' : null },
	                _react2.default.createElement(
	                  _reactRouter.Link,
	                  { to: '/admin' },
	                  'Admin'
	                )
	              ),
	              _react2.default.createElement(
	                'li',
	                { className: this.props.currentLocation === '/logout' ? 'active' : null },
	                _react2.default.createElement(
	                  _reactRouter.Link,
	                  { to: '/logout' },
	                  'Logout'
	                )
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Navigation;
	}(_react2.default.Component);

	Navigation.propTypes = {
	  dispatch: _react2.default.PropTypes.func,
	  currentLocation: _react2.default.PropTypes.string,
	  search: _react2.default.PropTypes.string,
	  category: _react2.default.PropTypes.string
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  return {
	    search: state.medias.search || '',
	    category: state.medias.category || ''
	  };
	})(Navigation);

/***/ },

/***/ 266:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.changeSearch = changeSearch;
	exports.changeCategory = changeCategory;
	exports.changePage = changePage;
	exports.request = request;
	exports.receive = receive;
	exports.error = error;
	exports.fetchMedias = fetchMedias;

	var _fetchWrapper = __webpack_require__(267);

	var _fetchWrapper2 = _interopRequireDefault(_fetchWrapper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function changeSearch(search) {
	  return {
	    type: 'MEDIAS_SEARCH',
	    search: search
	  };
	}

	function changeCategory(category) {
	  return {
	    type: 'MEDIAS_CATEGORY',
	    category: category
	  };
	}

	function changePage(page) {
	  return {
	    type: 'MEDIAS_PAGE',
	    page: page
	  };
	}

	function request() {
	  return { type: 'MEDIAS_REQUEST' };
	}

	function receive(pages, items) {
	  return {
	    type: 'MEDIAS_RECEIVE',
	    pages: pages,
	    items: items
	  };
	}

	function error(err) {
	  return {
	    type: 'MEDIAS_ERROR',
	    error: err
	  };
	}

	var PAGE_SIZE = 25;
	function fetchMedias(search, category, page) {
	  return function (dispatch, getState) {
	    var isFetching = getState().medias.isFetching;
	    if (isFetching) {
	      return Promise.resolve();
	    }

	    dispatch(request());

	    var query = {
	      page: {
	        size: PAGE_SIZE,
	        number: page
	      },
	      filter: {}
	    };
	    if (category && category !== 'all') {
	      query.filter.category = category;
	    }
	    if (search) {
	      query.filter.search = search;
	    }

	    return (0, _fetchWrapper2.default)('/api/medias', query).then(function (response) {
	      if (response.error) {
	        return Promise.reject(new Error(response.error.title));
	      }

	      return dispatch(receive(response.meta['total-pages'], response.data));
	    }).catch(function (err) {
	      return dispatch(error(err));
	    });
	  };
	}

/***/ },

/***/ 267:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var fetch = __webpack_require__(268);
	var flatten = __webpack_require__(270);

	module.exports = function (baseUrl, queries) {
	  return new Promise(function (resolve, reject) {
	    // encode url
	    var url = baseUrl;
	    if (queries) {
	      (function () {
	        var params = flatten(queries);
	        var parameters = Object.keys(params).map(function (k) {
	          return encodeURI(k) + '=' + encodeURI(params[k]);
	        });
	        url = url + '?' + parameters.join('&');
	      })();
	    }

	    var result = {};
	    var headers = {
	      'Content-Type': 'application/vnd.api+json',
	      Accept: 'application/vnd.api+json'
	    };
	    fetch(url, { headers: headers }).then(function (response) {
	      result.status = response.status;
	      return response.json().then(function (json) {
	        if (json.meta) {
	          result.meta = json.meta;
	        }
	        if (json.data) {
	          result.data = json.data;
	        }
	        if (json.errors) {
	          result.error = json.errors[0];
	        }
	        return resolve(result);
	      }).catch(function () {
	        return reject(new Error('Non-JSON response'));
	      });
	    }).catch(function () {
	      return reject(new Error('Transport error'));
	    });
	  });
	};

/***/ },

/***/ 268:
/***/ function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(269);
	module.exports = self.fetch.bind(self);


/***/ },

/***/ 270:
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	function flatten(o) {
	  var flat = {};
	  Object.keys(o).forEach(function (i) {
	    if (!o.hasOwnProperty(i)) {
	      return;
	    }

	    if (typeof o[i] === 'undefined') {
	      return;
	    }

	    if (_typeof(o[i]) !== 'object' || o[i] === null) {
	      flat[i] = o[i];
	      return;
	    }

	    var flatObject = flatten(o[i]);
	    Object.keys(flatObject).forEach(function (x) {
	      if (!flatObject.hasOwnProperty(x)) {
	        return;
	      }

	      if (typeof flatObject[x] === 'undefined') {
	        return;
	      }

	      if (x.indexOf('[') === -1) {
	        flat[i + '[' + x + ']'] = flatObject[x];
	      } else {
	        flat[i + '[' + x.substr(0, x.indexOf('[')) + ']' + x.substr(x.indexOf('['))] = flatObject[x];
	      }
	    });
	  });

	  return flat;
	}

	module.exports = flatten;

/***/ },

/***/ 271:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var NotFound = function NotFound() {
	  return _react2.default.createElement(
	    "div",
	    null,
	    _react2.default.createElement(
	      "div",
	      { className: "index" },
	      "🎥"
	    ),
	    _react2.default.createElement(
	      "h1",
	      { className: "text-center" },
	      "Not found"
	    )
	  );
	};

	exports.default = NotFound;

/***/ },

/***/ 272:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(168);

	var _WhatsNewActions = __webpack_require__(273);

	var _Left = __webpack_require__(274);

	var _Left2 = _interopRequireDefault(_Left);

	var _Right = __webpack_require__(277);

	var _Right2 = _interopRequireDefault(_Right);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Whatsnew = function (_React$Component) {
	  _inherits(Whatsnew, _React$Component);

	  function Whatsnew() {
	    _classCallCheck(this, Whatsnew);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Whatsnew).apply(this, arguments));
	  }

	  _createClass(Whatsnew, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.props.fetchWhatsNew(this.props.period);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (nextProps.period !== this.props.period) {
	        nextProps.fetchWhatsNew(nextProps.period);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: 'row' },
	        _react2.default.createElement(_Left2.default, this.props),
	        _react2.default.createElement(_Right2.default, { period: this.props.period, onPeriodChange: this.props.onPeriodChange })
	      );
	    }
	  }]);

	  return Whatsnew;
	}(_react2.default.Component);

	Whatsnew.propTypes = {
	  error: _react2.default.PropTypes.string,
	  fetchWhatsNew: _react2.default.PropTypes.func,
	  isFetching: _react2.default.PropTypes.bool,
	  period: _react2.default.PropTypes.number,
	  onPeriodChange: _react2.default.PropTypes.func,
	  movies: _react2.default.PropTypes.array,
	  series: _react2.default.PropTypes.array,
	  unknown: _react2.default.PropTypes.array,
	  removed: _react2.default.PropTypes.array
	};

	function mapDispatchToProps(dispatch) {
	  return {
	    onPeriodChange: function onPeriodChange(period) {
	      return dispatch((0, _WhatsNewActions.changePeriod)(period));
	    },
	    fetchWhatsNew: function fetchWhatsNew(period) {
	      return dispatch((0, _WhatsNewActions.fetchWhatsNew)(period));
	    }
	  };
	}

	exports.default = (0, _reactRedux.connect)(function (_ref) {
	  var whatsnew = _ref.whatsnew;
	  return whatsnew;
	}, mapDispatchToProps)(Whatsnew);

/***/ },

/***/ 273:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.changePeriod = changePeriod;
	exports.request = request;
	exports.receive = receive;
	exports.error = error;
	exports.fetchWhatsNew = fetchWhatsNew;

	var _fetchWrapper = __webpack_require__(267);

	var _fetchWrapper2 = _interopRequireDefault(_fetchWrapper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function changePeriod(period) {
	  return { type: 'WN_CHANGE_PERIOD', period: period };
	}

	function request() {
	  return { type: 'WN_REQUEST' };
	}

	function receive(json) {
	  return {
	    type: 'WN_RECEIVE',
	    movies: json.movies ? json.movies.map(function (m) {
	      return m.data;
	    }) : [],
	    series: json.series ? json.series.map(function (m) {
	      return m.data;
	    }) : [],
	    unknown: json.unknown ? json.unknown.map(function (m) {
	      return m.data;
	    }) : [],
	    removed: json.removed ? json.removed.map(function (m) {
	      return m.data;
	    }) : [],
	    receivedAt: Date.now()
	  };
	}

	function error(err) {
	  return {
	    type: 'WN_ERROR',
	    error: err
	  };
	}

	function fetchWhatsNew(period) {
	  return function (dispatch) {
	    dispatch(request());

	    return (0, _fetchWrapper2.default)('/api/whatsnew', { period: period }).then(function (response) {
	      if (response.error) {
	        return Promise.reject(new Error(response.error.title));
	      }

	      return dispatch(receive(response.data));
	    }).catch(function (err) {
	      return dispatch(error(err));
	    });
	  };
	}

/***/ },

/***/ 274:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(227);

	var _Section = __webpack_require__(275);

	var _Section2 = _interopRequireDefault(_Section);

	var _Card = __webpack_require__(276);

	var _Card2 = _interopRequireDefault(_Card);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Left = function Left(props) {
	  if (props.isFetching === true) {
	    return _react2.default.createElement(
	      'div',
	      { className: 'col-md-10' },
	      'Loading...'
	    );
	  }

	  var headerCss = void 0;
	  var headerContent = void 0;
	  var isEmpty = !props.movies.length && !props.series.length && !props.unknown.length && !props.removed.length;
	  if (props.error) {
	    headerCss = 'bg-danger';
	    headerContent = 'Error while retrieving what\'s new: ' + props.error;
	  } else if (isEmpty) {
	    headerCss = 'bg-warning';
	    headerContent = 'Nothing new during this period, try changing it in the right column.';
	  } else {
	    headerCss = 'dn';
	  }

	  return _react2.default.createElement(
	    'div',
	    { className: 'col-md-10' },
	    _react2.default.createElement(
	      'h1',
	      null,
	      'What\'s new'
	    ),
	    _react2.default.createElement(
	      'div',
	      { className: 'p15 ' + headerCss },
	      headerContent
	    ),
	    _react2.default.createElement(
	      _Section2.default,
	      { className: 'movies', title: 'Movies' },
	      props.movies.map(function (e) {
	        return _react2.default.createElement(_Card2.default, { key: e.id, data: e, mode: 'small' });
	      })
	    ),
	    _react2.default.createElement(
	      _Section2.default,
	      { className: 'series', title: 'Series' },
	      props.series.map(function (e) {
	        return _react2.default.createElement(_Card2.default, { key: e.title, data: e, mode: 'small' });
	      })
	    ),
	    _react2.default.createElement(
	      _Section2.default,
	      { className: 'unknown', title: 'Unknown' },
	      props.unknown.map(function (e) {
	        return _react2.default.createElement(
	          _reactRouter.Link,
	          { className: 'db', key: e.id, to: '/medias/' + e.id },
	          e.base
	        );
	      })
	    ),
	    _react2.default.createElement(
	      _Section2.default,
	      { className: 'removed', title: 'Removed' },
	      props.removed.map(function (e) {
	        return _react2.default.createElement(
	          _reactRouter.Link,
	          { className: 'db', key: e.id, to: '/medias/' + e.id },
	          e.base
	        );
	      })
	    )
	  );
	};

	Left.propTypes = {
	  isFetching: _react2.default.PropTypes.bool,
	  error: _react2.default.PropTypes.string,
	  movies: _react2.default.PropTypes.array,
	  series: _react2.default.PropTypes.array,
	  unknown: _react2.default.PropTypes.array,
	  removed: _react2.default.PropTypes.array
	};

	exports.default = Left;

/***/ },

/***/ 275:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Section = function Section(props) {
	  if (!props.children.length) {
	    return _react2.default.createElement("div", null);
	  }

	  return _react2.default.createElement(
	    "div",
	    { id: props.className, className: props.className },
	    _react2.default.createElement(
	      "h3",
	      { className: "bb" },
	      props.title
	    ),
	    _react2.default.createElement(
	      "div",
	      null,
	      props.children
	    )
	  );
	};

	Section.propTypes = {
	  title: _react2.default.PropTypes.string.isRequired,
	  className: _react2.default.PropTypes.string,
	  children: _react2.default.PropTypes.node
	};

	exports.default = Section;

/***/ },

/***/ 276:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(227);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var leftPad = function leftPad(int) {
	  return int <= 9 ? '0' + int : int;
	};

	var Card = function (_React$Component) {
	  _inherits(Card, _React$Component);

	  function Card() {
	    _classCallCheck(this, Card);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Card).apply(this, arguments));
	  }

	  _createClass(Card, [{
	    key: 'title',
	    value: function title() {
	      var data = this.props.data;
	      var right = null;
	      if (data.category === 'movie') {
	        right = data.category + ', ' + data.year;
	      } else if (data.category === 'tv' && !data.episodes) {
	        var season = data.season ? 'S' + leftPad(data.season) : null;
	        var episode = data.episode ? 'E' + leftPad(data.episode) : null;
	        right = data.category + ', ' + season + episode;
	      } else {
	        right = data.category;
	      }

	      var title = !data.episodes ? _react2.default.createElement(
	        _reactRouter.Link,
	        { to: '/medias/' + data.id },
	        data.title
	      ) : data.title;

	      return _react2.default.createElement(
	        'h3',
	        { className: 'mt0' },
	        title,
	        ' ',
	        _react2.default.createElement(
	          'small',
	          null,
	          right
	        )
	      );
	    }
	  }, {
	    key: 'detail',
	    value: function detail() {
	      var data = this.props.data;
	      var i = [];
	      if (data.original_title) {
	        i.push(data.original_title);
	      }
	      if (data.genres) {
	        i.push(data.genres);
	      }
	      if (data.votes) {
	        i.push(data.votes);
	      }
	      return _react2.default.createElement(
	        'div',
	        { className: 'text-muted' },
	        i.join(' | ')
	      );
	    }
	  }, {
	    key: 'overview',
	    value: function overview() {
	      if (!this.props.data.overview) {
	        return null;
	      }

	      var overview = this.props.mode === 'small' && this.props.data.overview.length > 230 ? this.props.data.overview.substr(0, 230) + ' (...)' : this.props.data.overview;

	      return _react2.default.createElement(
	        'div',
	        { className: 'mt10' },
	        _react2.default.createElement(
	          'h4',
	          null,
	          'Synopsis'
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'overview' },
	          overview
	        )
	      );
	    }
	  }, {
	    key: 'episodes',
	    value: function episodes() {
	      if (!this.props.data.episodes || !this.props.data.episodes.length) {
	        return null;
	      }

	      var data = this.props.data;

	      return _react2.default.createElement(
	        'div',
	        { className: 'mt10' },
	        data.episodes.map(function (e) {
	          var season = leftPad(e.season);
	          var episode = leftPad(e.episode);
	          return _react2.default.createElement(
	            'div',
	            { key: e.id },
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { to: '/medias/' + e.id },
	              'Season ',
	              _react2.default.createElement(
	                'strong',
	                null,
	                season
	              ),
	              ' ',
	              'episode ',
	              _react2.default.createElement(
	                'strong',
	                null,
	                episode
	              )
	            )
	          );
	        })
	      );
	    }
	  }, {
	    key: 'additional',
	    value: function additional() {
	      if (this.props.mode === 'small') {
	        return null;
	      }

	      var data = this.props.data;

	      var language = !data.language ? null : _react2.default.createElement(
	        'span',
	        null,
	        _react2.default.createElement(
	          'strong',
	          { className: 'text-muted' },
	          'language'
	        ),
	        ' ',
	        data.language
	      );
	      var quality = !data.quality ? null : _react2.default.createElement(
	        'span',
	        null,
	        _react2.default.createElement(
	          'strong',
	          { className: 'text-muted' },
	          'quality'
	        ),
	        ' ',
	        data.quality
	      );
	      var codec = !data.codec ? null : _react2.default.createElement(
	        'span',
	        null,
	        _react2.default.createElement(
	          'strong',
	          { className: 'text-muted' },
	          'codec'
	        ),
	        ' ',
	        data.codec
	      );
	      var size = !data.size ? null : _react2.default.createElement(
	        'span',
	        null,
	        _react2.default.createElement(
	          'strong',
	          { className: 'text-muted' },
	          'size'
	        ),
	        ' ',
	        data.size
	      );
	      var created = null;
	      if (data.created) {
	        var cd = new Date(data.created);
	        created = _react2.default.createElement(
	          'span',
	          null,
	          _react2.default.createElement(
	            'strong',
	            { className: 'text-muted' },
	            'downloaded on'
	          ),
	          ' ',
	          cd.toDateString()
	        );
	      }
	      var removed = null;
	      if (data.removed) {
	        var rd = new Date(data.removed);
	        removed = _react2.default.createElement(
	          'span',
	          null,
	          _react2.default.createElement(
	            'strong',
	            { className: 'text-muted' },
	            'deleted on'
	          ),
	          ' ',
	          rd.toDateString()
	        );
	      }

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'bg-info text-center pt20 pr5 pb20 pl5 mt30 mb30' },
	          data.path
	        ),
	        _react2.default.createElement(
	          'ul',
	          { className: 'list-inline text-right' },
	          language,
	          ' ',
	          quality,
	          ' ',
	          codec,
	          ' ',
	          size
	        ),
	        _react2.default.createElement(
	          'ul',
	          { className: 'list-inline text-right text-muted small' },
	          _react2.default.createElement(
	            'li',
	            null,
	            _react2.default.createElement(
	              'strong',
	              null,
	              'id'
	            ),
	            ' ',
	            data.id
	          ),
	          created,
	          removed
	        )
	      );
	    }
	  }, {
	    key: 'seemore',
	    value: function seemore() {
	      if (this.props.mode === 'large') {
	        return null;
	      }
	      if (this.props.data.episodes) {
	        return null;
	      }
	      return _react2.default.createElement(
	        'p',
	        { className: 'text-right mt10' },
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: '/medias/' + this.props.data.id },
	          'see more'
	        )
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (!this.props.data) {
	        return null;
	      }

	      var data = this.props.data;

	      return _react2.default.createElement(
	        'div',
	        { className: 'row p-media bb mb15 pb10' },
	        _react2.default.createElement(
	          'div',
	          { className: 'col-xs-2' },
	          _react2.default.createElement('img', {
	            className: 'img-responsive poster',
	            src: data.poster,
	            alt: data.title + ' poster'
	          })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'col-xs-10' },
	          this.title(),
	          this.detail(),
	          this.overview(),
	          this.episodes(),
	          this.additional(),
	          this.seemore()
	        )
	      );
	    }
	  }]);

	  return Card;
	}(_react2.default.Component);

	Card.propTypes = {
	  data: _react2.default.PropTypes.object,
	  mode: _react2.default.PropTypes.oneOf(['small', 'large']).isRequired
	};

	exports.default = Card;

/***/ },

/***/ 277:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _SelectPeriod = __webpack_require__(278);

	var _SelectPeriod2 = _interopRequireDefault(_SelectPeriod);

	var _SelectEmail = __webpack_require__(279);

	var _SelectEmail2 = _interopRequireDefault(_SelectEmail);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Right = function Right(props) {
	  return _react2.default.createElement(
	    'div',
	    { className: 'col-md-2' },
	    _react2.default.createElement(_SelectPeriod2.default, {
	      period: props.period,
	      onPeriodChange: function onPeriodChange(e) {
	        props.onPeriodChange(parseInt(e.target.value, 10));
	      }
	    }),
	    _react2.default.createElement(
	      'div',
	      { className: 'mt10 text-left' },
	      'Jump to :',
	      ' ',
	      _react2.default.createElement(
	        'a',
	        { href: '#movies' },
	        'Movies'
	      ),
	      ' ',
	      _react2.default.createElement(
	        'a',
	        { href: '#series' },
	        'Series'
	      ),
	      ' ',
	      _react2.default.createElement(
	        'a',
	        { href: '#unknown' },
	        'Unknown'
	      ),
	      ' ',
	      _react2.default.createElement(
	        'a',
	        { href: '#removed' },
	        'Removed'
	      ),
	      ' '
	    ),
	    _react2.default.createElement('hr', null),
	    _react2.default.createElement(_SelectEmail2.default, { period: props.period })
	  );
	};

	Right.propTypes = {
	  period: _react2.default.PropTypes.number,
	  onPeriodChange: _react2.default.PropTypes.func
	};

	exports.default = Right;

/***/ },

/***/ 278:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PeriodSelector = function PeriodSelector(props) {
	  var from = 1;
	  var to = 10;

	  var options = [];
	  for (var i = from; i <= to; i++) {
	    options.push(_react2.default.createElement(
	      "option",
	      { key: i, value: i },
	      i,
	      " day(s)"
	    ));
	  }

	  return _react2.default.createElement(
	    "form",
	    { className: "form-inline pt20" },
	    _react2.default.createElement(
	      "div",
	      { className: "form-group" },
	      _react2.default.createElement(
	        "label",
	        { className: "mr10", htmlFor: "period" },
	        "Period"
	      ),
	      _react2.default.createElement(
	        "select",
	        {
	          className: "form-control",
	          id: "period",
	          defaultValue: props.period,
	          onChange: props.onPeriodChange
	        },
	        options
	      )
	    )
	  );
	};

	PeriodSelector.propTypes = {
	  period: _react2.default.PropTypes.number,
	  onPeriodChange: _react2.default.PropTypes.func
	};

	exports.default = PeriodSelector;

/***/ },

/***/ 279:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var EmailSelector = function (_React$Component) {
	  _inherits(EmailSelector, _React$Component);

	  function EmailSelector(props) {
	    _classCallCheck(this, EmailSelector);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EmailSelector).call(this, props));

	    _this.state = {
	      premailer: false
	    };
	    _this.onPremailerChange = _this.onPremailerChange.bind(_this);
	    _this.onSeeEmail = _this.onSeeEmail.bind(_this);
	    return _this;
	  }

	  _createClass(EmailSelector, [{
	    key: "onPremailerChange",
	    value: function onPremailerChange(event) {
	      this.setState({ premailer: !!event.target.checked });
	    }
	  }, {
	    key: "onSeeEmail",
	    value: function onSeeEmail(event) {
	      event.preventDefault();
	      window.open("/email?period=" + this.props.period + "&premailer=" + this.state.premailer);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2.default.createElement(
	        "form",
	        { className: "form-inline mt10" },
	        _react2.default.createElement(
	          "div",
	          { className: "form-group" },
	          _react2.default.createElement(
	            "button",
	            {
	              className: "btn btn-default form-control",
	              onClick: this.onSeeEmail
	            },
	            "See daily email"
	          )
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "checkbox" },
	          _react2.default.createElement(
	            "label",
	            null,
	            _react2.default.createElement("input", {
	              type: "checkbox",
	              value: "1",
	              onChange: this.onPremailerChange
	            }),
	            ' ',
	            "w/ premailer"
	          )
	        )
	      );
	    }
	  }]);

	  return EmailSelector;
	}(_react2.default.Component);

	EmailSelector.propTypes = {
	  period: _react2.default.PropTypes.number.isRequired
	};

	exports.default = EmailSelector;

/***/ },

/***/ 280:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(168);

	var _MediasActions = __webpack_require__(266);

	var _Card = __webpack_require__(276);

	var _Card2 = _interopRequireDefault(_Card);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Medias = function (_React$Component) {
	  _inherits(Medias, _React$Component);

	  function Medias() {
	    _classCallCheck(this, Medias);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Medias).apply(this, arguments));
	  }

	  _createClass(Medias, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.props.dispatch((0, _MediasActions.fetchMedias)(this.props.search, this.props.category, this.props.page));
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (nextProps.search !== this.props.search || nextProps.category !== this.props.category || nextProps.page !== this.props.page) {
	        this.props.dispatch((0, _MediasActions.fetchMedias)(nextProps.search, nextProps.category, nextProps.page));
	      }
	    }
	  }, {
	    key: 'pagination',
	    value: function pagination() {
	      var _this2 = this;

	      if (this.props.pages === 0) {
	        return null;
	      }

	      var firstActive = this.props.page !== 1 ? '' : 'disabled';
	      var lastActive = this.props.page !== this.props.pages ? '' : 'disabled';

	      var change = function change(e, i) {
	        e.preventDefault();
	        _this2.props.dispatch((0, _MediasActions.changePage)(i));
	      };

	      var pageLinks = [];

	      var _loop = function _loop(i) {
	        pageLinks.push(_react2.default.createElement(
	          'li',
	          { key: i, className: _this2.props.page === i ? 'active' : '' },
	          _react2.default.createElement(
	            'a',
	            { href: '#', onClick: function onClick(e) {
	                return change(e, i);
	              } },
	            i
	          )
	        ));
	      };

	      for (var i = 1; i <= this.props.pages; i++) {
	        _loop(i);
	      }

	      return _react2.default.createElement(
	        'nav',
	        null,
	        _react2.default.createElement(
	          'ul',
	          { className: 'pagination' },
	          _react2.default.createElement(
	            'li',
	            { className: firstActive },
	            _react2.default.createElement(
	              'a',
	              { href: '#', onClick: function onClick(e) {
	                  return change(e, 1);
	                } },
	              _react2.default.createElement(
	                'span',
	                null,
	                '«'
	              )
	            )
	          ),
	          pageLinks,
	          _react2.default.createElement(
	            'li',
	            { className: lastActive },
	            _react2.default.createElement(
	              'a',
	              { href: '#', onClick: function onClick(e) {
	                  return change(e, _this2.props.pages);
	                } },
	              _react2.default.createElement(
	                'span',
	                null,
	                '»'
	              )
	            )
	          )
	        )
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;

	      if (this.props.isFetching === true) {
	        return _react2.default.createElement(
	          'div',
	          null,
	          'Loading...'
	        );
	      }

	      var headerCss = void 0;
	      var headerContent = void 0;
	      if (this.props.error) {
	        headerCss = 'bg-danger';
	        headerContent = 'Error while retrieving: ' + this.props.error;
	      } else if (!this.props.items.length) {
	        headerCss = 'bg-warning';
	        headerContent = 'Nothing found.';
	      } else {
	        headerCss = 'dn';
	      }

	      var title = this.props.search ? 'Search for: "' + this.props.search + '"' : 'Medias list';

	      var change = function change(e) {
	        e.preventDefault();
	        _this3.props.dispatch((0, _MediasActions.changeCategory)(e.target.value));
	      };
	      var pagination = this.pagination();

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'h1',
	          null,
	          title
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'row' },
	          _react2.default.createElement('div', { className: 'col-sm-7' }),
	          _react2.default.createElement(
	            'form',
	            { className: 'form-horizontal col-sm-5' },
	            _react2.default.createElement(
	              'div',
	              { className: 'form-group' },
	              _react2.default.createElement(
	                'label',
	                { className: 'col-sm-3 control-label' },
	                'Filter by'
	              ),
	              _react2.default.createElement(
	                'div',
	                { className: 'col-sm-9' },
	                _react2.default.createElement(
	                  'select',
	                  {
	                    className: 'form-control',
	                    defaultValue: this.props.category,
	                    onChange: change
	                  },
	                  _react2.default.createElement(
	                    'option',
	                    { value: '' },
	                    'all'
	                  ),
	                  _react2.default.createElement(
	                    'option',
	                    { value: 'movie' },
	                    'movie'
	                  ),
	                  _react2.default.createElement(
	                    'option',
	                    { value: 'tv' },
	                    'tv'
	                  ),
	                  _react2.default.createElement(
	                    'option',
	                    { value: 'unknown' },
	                    'unknown'
	                  )
	                )
	              )
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'p15 ' + headerCss },
	          headerContent
	        ),
	        pagination,
	        _react2.default.createElement(
	          'div',
	          null,
	          this.props.items.map(function (i) {
	            return _react2.default.createElement(
	              _Card2.default,
	              { data: i, key: i.id, mode: 'small' },
	              i.title
	            );
	          })
	        ),
	        pagination
	      );
	    }
	  }]);

	  return Medias;
	}(_react2.default.Component);

	Medias.propTypes = {
	  dispatch: _react2.default.PropTypes.func,
	  isFetching: _react2.default.PropTypes.bool,
	  error: _react2.default.PropTypes.string,
	  search: _react2.default.PropTypes.string,
	  category: _react2.default.PropTypes.string,
	  page: _react2.default.PropTypes.number,
	  pages: _react2.default.PropTypes.number,
	  items: _react2.default.PropTypes.array
	};

	exports.default = (0, _reactRedux.connect)(function (_ref) {
	  var medias = _ref.medias;
	  return medias;
	}, null)(Medias);

/***/ },

/***/ 281:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(168);

	var _reactRouterRedux = __webpack_require__(191);

	var _MediaActions = __webpack_require__(282);

	var _Card = __webpack_require__(276);

	var _Card2 = _interopRequireDefault(_Card);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Media = function (_React$Component) {
	  _inherits(Media, _React$Component);

	  function Media(props) {
	    _classCallCheck(this, Media);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Media).call(this, props));

	    _this.goBack = _this.goBack.bind(_this);
	    return _this;
	  }

	  _createClass(Media, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.props.dispatch((0, _MediaActions.fetchMedia)(this.props.params.mediaId));
	    }
	  }, {
	    key: 'goBack',
	    value: function goBack(e) {
	      e.preventDefault();
	      this.props.dispatch((0, _reactRouterRedux.goBack)());
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.props.isFetching === true) {
	        return _react2.default.createElement(
	          'div',
	          null,
	          'Loading...'
	        );
	      }

	      var headerCss = void 0;
	      var headerContent = void 0;
	      if (this.props.error) {
	        headerCss = 'bg-danger';
	        headerContent = 'Error while retrieving: ' + this.props.error;
	      } else if (!this.props.data) {
	        headerCss = 'bg-warning';
	        headerContent = 'Nothing found.';
	      } else {
	        headerCss = 'dn';
	      }

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'mb15' },
	          _react2.default.createElement(
	            'a',
	            { href: '#', onClick: this.goBack },
	            '< Back'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'p15 ' + headerCss },
	          headerContent
	        ),
	        _react2.default.createElement(_Card2.default, { data: this.props.data, mode: 'large' })
	      );
	    }
	  }]);

	  return Media;
	}(_react2.default.Component);

	Media.propTypes = {
	  dispatch: _react2.default.PropTypes.func,
	  error: _react2.default.PropTypes.string,
	  params: _react2.default.PropTypes.object,
	  data: _react2.default.PropTypes.object,
	  isFetching: _react2.default.PropTypes.bool
	};

	exports.default = (0, _reactRedux.connect)(function (_ref) {
	  var media = _ref.media;
	  return media;
	})(Media);

/***/ },

/***/ 282:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.request = request;
	exports.receive = receive;
	exports.error = error;
	exports.fetchMedia = fetchMedia;

	var _fetchWrapper = __webpack_require__(267);

	var _fetchWrapper2 = _interopRequireDefault(_fetchWrapper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function request() {
	  return { type: 'MEDIA_REQUEST' };
	}

	function receive(data) {
	  return {
	    type: 'MEDIA_RECEIVE',
	    data: data
	  };
	}

	function error(err) {
	  return {
	    type: 'MEDIA_ERROR',
	    error: err
	  };
	}

	function fetchMedia(id) {
	  return function (dispatch) {
	    dispatch(request());

	    return (0, _fetchWrapper2.default)('/api/medias/' + id).then(function (response) {
	      if (response.error) {
	        return Promise.reject(new Error(response.error.title));
	      }

	      return dispatch(receive(response.data));
	    }).catch(function (err) {
	      return dispatch(error(err));
	    });
	  };
	}

/***/ },

/***/ 283:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Admin = function Admin() {
	  return _react2.default.createElement(
	    "div",
	    { className: "row" },
	    _react2.default.createElement(
	      "h1",
	      null,
	      "Admin features"
	    ),
	    _react2.default.createElement(
	      "button",
	      { className: "btn btn-default", type: "submit" },
	      "Launch sync"
	    ),
	    _react2.default.createElement(
	      "button",
	      { className: "btn btn-default", type: "submit" },
	      "Launch push"
	    ),
	    _react2.default.createElement(
	      "button",
	      { className: "btn btn-default", type: "submit" },
	      "Launch purge"
	    )
	  );
	};

	exports.default = Admin;

/***/ }

});