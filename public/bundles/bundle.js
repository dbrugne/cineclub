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

	var _history = __webpack_require__(202);

	var _reactRouter = __webpack_require__(228);

	var _reactRouterRedux = __webpack_require__(191);

	var _App = __webpack_require__(265);

	var _App2 = _interopRequireDefault(_App);

	var _NotFound = __webpack_require__(535);

	var _NotFound2 = _interopRequireDefault(_NotFound);

	var _WhatsNew = __webpack_require__(536);

	var _WhatsNew2 = _interopRequireDefault(_WhatsNew);

	var _Medias = __webpack_require__(657);

	var _Medias2 = _interopRequireDefault(_Medias);

	var _Media = __webpack_require__(660);

	var _Media2 = _interopRequireDefault(_Media);

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

	var _DecorationReducer = __webpack_require__(201);

	var _DecorationReducer2 = _interopRequireDefault(_DecorationReducer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// reducers

	var reducers = (0, _redux.combineReducers)({
	  whatsnew: _WhatsNewReducer2.default,
	  medias: _MediasReducer2.default,
	  media: _MediaReducer2.default,
	  decoration: _DecorationReducer2.default,
	  routing: _reactRouterRedux.routerReducer
	});

	// store
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
	  removed: []
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
	        removed: action.removed
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
	  category: 'decorated',
	  page: 1,
	  pages: 0,
	  items: []
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
	        pages: action.pages ? action.pages : 0
	      });
	    case 'MEDIAS_ERROR':
	      return Object.assign({}, state, {
	        error: action.error.message,
	        isFetching: false,
	        items: [],
	        pages: 0
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
	  isPatching: false,
	  error: null,
	  data: null
	};

	function MediaReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case 'DECORATION_RECEIVE':
	      return Object.assign({}, state, {
	        error: null
	      });
	    case 'MEDIA_REQUEST':
	      return Object.assign({}, state, {
	        isFetching: true
	      });
	    case 'MEDIA_RECEIVE':
	      return Object.assign({}, state, {
	        isFetching: false,
	        isPatching: false,
	        error: null,
	        data: action.data
	      });
	    case 'MEDIA_ERROR':
	      return Object.assign({}, state, {
	        error: action.error.message,
	        isFetching: false
	      });
	    case 'MEDIA_DECORATION_REQUEST':
	      return Object.assign({}, state, {
	        isPatching: true
	      });

	    default:
	      return state;
	  }
	}

/***/ },

/***/ 201:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = DecorationReducer;
	var initialState = {
	  isFetching: false,
	  didFetch: false,
	  search: null,
	  page: 1,
	  pages: 0,
	  items: [],
	  force: false,
	  chosen: null,
	  didConfirm: false
	};

	function DecorationReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case 'MEDIA_REQUEST':
	    case 'MEDIA_RECEIVE':
	    case 'MEDIA_ERROR':
	      return Object.assign({}, state, {
	        isFetching: false,
	        didFetch: false,
	        search: null,
	        page: 1,
	        pages: 0,
	        items: [],
	        force: false,
	        chosen: null,
	        didConfirm: false
	      });
	    case 'DECORATION_FORCE':
	      return Object.assign({}, state, {
	        force: !state.force,
	        didFetch: false,
	        page: 1,
	        pages: 0,
	        items: [],
	        chosen: null,
	        didConfirm: false
	      });
	    case 'DECORATION_SEARCH':
	      return Object.assign({}, state, {
	        search: action.search,
	        page: 1
	      });
	    case 'DECORATION_PAGE':
	      return Object.assign({}, state, {
	        page: action.page
	      });
	    case 'DECORATION_REQUEST':
	      return Object.assign({}, state, {
	        isFetching: true,
	        didFetch: false,
	        pages: 0,
	        items: [],
	        chosen: null,
	        didConfirm: false
	      });
	    case 'DECORATION_RECEIVE':
	      return Object.assign({}, state, {
	        isFetching: false,
	        didFetch: true,
	        items: action.items ? action.items : [],
	        pages: action.pages ? action.pages : 0
	      });

	    case 'DECORATION_CHOOSE':
	      return Object.assign({}, state, { chosen: action.chosen });
	    case 'DECORATION_CONFIRM':
	      return Object.assign({}, state, { didConfirm: true });
	    case 'DECORATION_CANCEL':
	      return Object.assign({}, state, { chosen: null, didConfirm: false });

	    default:
	      return state;
	  }
	}

/***/ },

/***/ 202:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _deprecate = __webpack_require__(203);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	var _createLocation2 = __webpack_require__(205);

	var _createLocation3 = _interopRequireDefault(_createLocation2);

	var _createBrowserHistory = __webpack_require__(208);

	var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

	exports.createHistory = _createBrowserHistory2['default'];

	var _createHashHistory2 = __webpack_require__(219);

	var _createHashHistory3 = _interopRequireDefault(_createHashHistory2);

	exports.createHashHistory = _createHashHistory3['default'];

	var _createMemoryHistory2 = __webpack_require__(220);

	var _createMemoryHistory3 = _interopRequireDefault(_createMemoryHistory2);

	exports.createMemoryHistory = _createMemoryHistory3['default'];

	var _useBasename2 = __webpack_require__(221);

	var _useBasename3 = _interopRequireDefault(_useBasename2);

	exports.useBasename = _useBasename3['default'];

	var _useBeforeUnload2 = __webpack_require__(222);

	var _useBeforeUnload3 = _interopRequireDefault(_useBeforeUnload2);

	exports.useBeforeUnload = _useBeforeUnload3['default'];

	var _useQueries2 = __webpack_require__(223);

	var _useQueries3 = _interopRequireDefault(_useQueries2);

	exports.useQueries = _useQueries3['default'];

	var _Actions2 = __webpack_require__(206);

	var _Actions3 = _interopRequireDefault(_Actions2);

	exports.Actions = _Actions3['default'];

	// deprecated

	var _enableBeforeUnload2 = __webpack_require__(226);

	var _enableBeforeUnload3 = _interopRequireDefault(_enableBeforeUnload2);

	exports.enableBeforeUnload = _enableBeforeUnload3['default'];

	var _enableQueries2 = __webpack_require__(227);

	var _enableQueries3 = _interopRequireDefault(_enableQueries2);

	exports.enableQueries = _enableQueries3['default'];
	var createLocation = _deprecate2['default'](_createLocation3['default'], 'Using createLocation without a history instance is deprecated; please use history.createLocation instead');
	exports.createLocation = createLocation;

/***/ },

/***/ 222:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _warning = __webpack_require__(204);

	var _warning2 = _interopRequireDefault(_warning);

	var _ExecutionEnvironment = __webpack_require__(209);

	var _DOMUtils = __webpack_require__(210);

	var _deprecate = __webpack_require__(203);

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

/***/ 226:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _deprecate = __webpack_require__(203);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	var _useBeforeUnload = __webpack_require__(222);

	var _useBeforeUnload2 = _interopRequireDefault(_useBeforeUnload);

	exports['default'] = _deprecate2['default'](_useBeforeUnload2['default'], 'enableBeforeUnload is deprecated, use useBeforeUnload instead');
	module.exports = exports['default'];

/***/ },

/***/ 227:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _deprecate = __webpack_require__(203);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	var _useQueries = __webpack_require__(223);

	var _useQueries2 = _interopRequireDefault(_useQueries);

	exports['default'] = _deprecate2['default'](_useQueries2['default'], 'enableQueries is deprecated, use useQueries instead');
	module.exports = exports['default'];

/***/ },

/***/ 265:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Navigation = __webpack_require__(266);

	var _Navigation2 = _interopRequireDefault(_Navigation);

	var _reactBootstrap = __webpack_require__(267);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var App = function App(props) {
	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(_Navigation2.default, { currentLocation: props.location.pathname }),
	    _react2.default.createElement(
	      _reactBootstrap.Grid,
	      null,
	      props.children
	    )
	  );
	};

	App.propTypes = {
	  location: _react2.default.PropTypes.object,
	  children: _react2.default.PropTypes.node
	};

	exports.default = App;

/***/ },

/***/ 266:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(168);

	var _reactRouter = __webpack_require__(228);

	var _reactRouterRedux = __webpack_require__(191);

	var _reactBootstrap = __webpack_require__(267);

	var _MediasActions = __webpack_require__(530);

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
	        this.props.goToMedias();
	      }

	      this.props.changeSearch(e.target.value);
	    }
	  }, {
	    key: 'onSearchSubmit',
	    value: function onSearchSubmit() {
	      if (this.props.currentLocation !== '/medias') {
	        this.props.goToMedias();
	      }
	      this.props.fetchMedias(this.props.search, this.props.category);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _reactBootstrap.Navbar,
	        { fixedTop: true },
	        _react2.default.createElement(
	          _reactBootstrap.Navbar.Header,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Navbar.Brand,
	            null,
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { to: '/' },
	              'Ciné-club'
	            )
	          ),
	          _react2.default.createElement(_reactBootstrap.Navbar.Toggle, null)
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Navbar.Collapse,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Nav,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.NavItem,
	              { eventKey: 1, active: this.props.currentLocation === '/medias' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: '/medias' },
	                'Medias'
	              )
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Navbar.Form,
	              { pullLeft: true },
	              _react2.default.createElement(
	                _reactBootstrap.FormGroup,
	                null,
	                _react2.default.createElement(_reactBootstrap.FormControl, {
	                  type: 'text',
	                  placeholder: 'Search',
	                  onChange: this.onSearchChange,
	                  value: this.props.search
	                })
	              ),
	              ' ',
	              _react2.default.createElement(
	                _reactBootstrap.Button,
	                { type: 'submit', onClick: this.onSearchSubmit },
	                'Submit'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Nav,
	            { pullRight: true },
	            _react2.default.createElement(
	              _reactBootstrap.NavItem,
	              { eventKey: 3, active: this.props.currentLocation === '/logout' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: '/logout' },
	                'Logout'
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
	  currentLocation: _react2.default.PropTypes.string,
	  search: _react2.default.PropTypes.string,
	  category: _react2.default.PropTypes.string,
	  goToMedias: _react2.default.PropTypes.func,
	  changeSearch: _react2.default.PropTypes.func,
	  fetchMedias: _react2.default.PropTypes.func
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  return {
	    search: state.medias.search || '',
	    category: state.medias.category || ''
	  };
	}, function (dispatch) {
	  return {
	    goToMedias: function goToMedias() {
	      return dispatch((0, _reactRouterRedux.push)('medias'));
	    },
	    changeSearch: function changeSearch(search) {
	      return dispatch((0, _MediasActions.changeSearch)(search));
	    },
	    fetchMedias: function fetchMedias(search, category) {
	      return dispatch((0, _MediasActions.fetchMedias)(search, category, 1));
	    }
	  };
	})(Navigation);

/***/ },

/***/ 530:
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

	var _fetchWrapper = __webpack_require__(531);

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
	      query.filter.type = category;
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

/***/ 531:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var fetch = __webpack_require__(532);
	var flatten = __webpack_require__(534);

	module.exports = function (baseUrl, queries, opts) {
	  return new Promise(function (resolve, reject) {
	    var url = baseUrl;
	    var options = opts || {};

	    // query
	    if (queries) {
	      (function () {
	        var params = flatten(queries);
	        var parameters = Object.keys(params).map(function (k) {
	          return encodeURI(k) + '=' + encodeURI(params[k]);
	        });
	        url = url + '?' + parameters.join('&');
	      })();
	    }

	    // body
	    if (options.body) {
	      options.body = JSON.stringify(options.body);
	    }

	    // headers
	    options = Object.assign({
	      headers: {
	        'Content-Type': 'application/vnd.api+json',
	        Accept: 'application/vnd.api+json'
	      }
	    }, options);

	    var result = {};
	    fetch(url, options).then(function (response) {
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

/***/ 532:
/***/ function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(533);
	module.exports = self.fetch.bind(self);


/***/ },

/***/ 534:
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

/***/ 535:
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

/***/ 536:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(168);

	var _WhatsNewActions = __webpack_require__(537);

	var _reactBootstrap = __webpack_require__(267);

	var _Content = __webpack_require__(538);

	var _Content2 = _interopRequireDefault(_Content);

	var _SelectPeriod = __webpack_require__(655);

	var _SelectPeriod2 = _interopRequireDefault(_SelectPeriod);

	var _SelectEmail = __webpack_require__(656);

	var _SelectEmail2 = _interopRequireDefault(_SelectEmail);

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
	      this.props.fetch(this.props.period);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (nextProps.period !== this.props.period) {
	        this.props.fetch(nextProps.period);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _reactBootstrap.Row,
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { md: 10 },
	          _react2.default.createElement(_Content2.default, this.props)
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { md: 2 },
	          _react2.default.createElement(_SelectPeriod2.default, this.props),
	          _react2.default.createElement('hr', null),
	          _react2.default.createElement(_SelectEmail2.default, this.props)
	        )
	      );
	    }
	  }]);

	  return Whatsnew;
	}(_react2.default.Component);

	Whatsnew.propTypes = {
	  error: _react2.default.PropTypes.string,
	  isFetching: _react2.default.PropTypes.bool,
	  period: _react2.default.PropTypes.number,
	  onPeriodChange: _react2.default.PropTypes.func,
	  movies: _react2.default.PropTypes.array,
	  series: _react2.default.PropTypes.array,
	  unknown: _react2.default.PropTypes.array,
	  removed: _react2.default.PropTypes.array,
	  fetch: _react2.default.PropTypes.func
	};

	exports.default = (0, _reactRedux.connect)(function (_ref) {
	  var whatsnew = _ref.whatsnew;
	  return whatsnew;
	}, function (dispatch) {
	  return {
	    changePeriod: function changePeriod(period) {
	      return dispatch((0, _WhatsNewActions.changePeriod)(period));
	    },
	    fetch: function fetch(period) {
	      return dispatch((0, _WhatsNewActions.fetchWhatsNew)(period));
	    }
	  };
	})(Whatsnew);

/***/ },

/***/ 537:
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

	var _fetchWrapper = __webpack_require__(531);

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
	    }) : []
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

/***/ 538:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(228);

	var _Section = __webpack_require__(539);

	var _Section2 = _interopRequireDefault(_Section);

	var _Card = __webpack_require__(540);

	var _Card2 = _interopRequireDefault(_Card);

	var _Header = __webpack_require__(653);

	var _Header2 = _interopRequireDefault(_Header);

	var _Loading = __webpack_require__(654);

	var _Loading2 = _interopRequireDefault(_Loading);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Left = function Left(props) {
	  if (props.isFetching === true) {
	    return _react2.default.createElement(_Loading2.default, null);
	  }

	  var isEmpty = !props.movies.length && !props.series.length && !props.unknown.length && !props.removed.length;

	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'h1',
	      null,
	      'What\'s new'
	    ),
	    _react2.default.createElement(
	      'div',
	      { className: 'mt10 mb10 text-right' },
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
	    _react2.default.createElement(_Header2.default, { error: props.error, nothing: isEmpty }),
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

/***/ 539:
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

/***/ 540:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(228);

	var _reactBootstrap = __webpack_require__(267);

	var _reactYoutube = __webpack_require__(541);

	var _reactYoutube2 = _interopRequireDefault(_reactYoutube);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var leftPad = function leftPad(int) {
	  return int <= 9 ? '0' + int : int;
	};

	var Card = function (_React$Component) {
	  _inherits(Card, _React$Component);

	  function Card(props) {
	    _classCallCheck(this, Card);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Card).call(this, props));

	    _this.state = {
	      showModal: false,
	      modalContent: null
	    };
	    _this.openModal = _this.openModal.bind(_this);
	    _this.closeModal = _this.closeModal.bind(_this);
	    return _this;
	  }

	  _createClass(Card, [{
	    key: 'openModal',
	    value: function openModal(modalContent) {
	      this.setState({
	        showModal: true,
	        modalContent: modalContent
	      });
	    }
	  }, {
	    key: 'closeModal',
	    value: function closeModal() {
	      this.setState({
	        showModal: false,
	        modalContent: null
	      });
	    }
	  }, {
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
	      if (data.decoration) {
	        i.push('status: ' + data.decoration);
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
	      var data = this.props.data;

	      var t = void 0;
	      if (data.episodeInfo && data.episodeInfo.name) {
	        t = _react2.default.createElement(
	          'h4',
	          { className: 'mt10' },
	          'Season ',
	          data.season,
	          ', Episode ',
	          data.episode,
	          ': ',
	          data.episodeInfo.name,
	          ' ',
	          _react2.default.createElement(
	            'small',
	            null,
	            'released: ',
	            data.episodeInfo.air_date
	          )
	        );
	      }

	      var e = void 0;
	      if (data.episodeInfo && data.episodeInfo.overview) {
	        e = this.props.mode === 'small' && data.episodeInfo.overview > 230 ? data.episodeInfo.overview.substr(0, 230) + ' (...)' : data.episodeInfo.overview;

	        e = _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'div',
	            { className: 'overview' },
	            e
	          )
	        );
	      }

	      var s = void 0;
	      if (data.overview) {
	        s = this.props.mode === 'small' && data.overview.length > 230 ? data.overview.substr(0, 230) + ' (...)' : data.overview;

	        s = _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'h4',
	            null,
	            'Show overview'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'overview' },
	            s
	          )
	        );
	      }

	      if (!t && !e && !s) {
	        return null;
	      }

	      return _react2.default.createElement(
	        'div',
	        { className: 'mt10' },
	        t,
	        e,
	        s
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
	          'li',
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
	          'li',
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

	      var tmdbId = null;
	      if (data.tmdbId) {
	        var element = null;
	        if (data.category === 'movie' || data.category === 'tv') {
	          var onOpenTmdbPage = function onOpenTmdbPage() {
	            event.preventDefault();
	            window.open('https://www.themoviedb.org/' + data.category + '/' + data.tmdbId);
	          };
	          element = _react2.default.createElement(
	            'a',
	            { href: '#', onClick: onOpenTmdbPage },
	            data.tmdbId
	          );
	        } else {
	          element = data.tmdbId;
	        }

	        tmdbId = _react2.default.createElement(
	          'li',
	          null,
	          _react2.default.createElement(
	            'strong',
	            { className: 'text-muted' },
	            'TMDB id'
	          ),
	          ' ',
	          element
	        );
	      }

	      var imdbId = null;
	      if (data.imdbId) {
	        var element2 = null;
	        if (data.category === 'movie' || data.category === 'tv') {
	          var onOpenImdbPage = function onOpenImdbPage() {
	            event.preventDefault();
	            window.open('http://www.imdb.com/title/' + data.imdbId);
	          };
	          element2 = _react2.default.createElement(
	            'a',
	            { href: '#', onClick: onOpenImdbPage },
	            data.imdbId
	          );
	        } else {
	          element2 = data.imdbId;
	        }

	        imdbId = _react2.default.createElement(
	          'li',
	          null,
	          _react2.default.createElement(
	            'strong',
	            { className: 'text-muted' },
	            'IMDB id'
	          ),
	          ' ',
	          element2
	        );
	      }

	      return _react2.default.createElement(
	        'div',
	        { className: 'mt10' },
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
	          ' ',
	          tmdbId,
	          ' ',
	          imdbId,
	          ' ',
	          created,
	          ' ',
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
	    key: 'videos',
	    value: function videos() {
	      var _this2 = this;

	      if (this.props.mode === 'small' || !this.props.data.videos) {
	        return null;
	      }

	      var options = {
	        playerVars: {
	          autoplay: 1
	        }
	      };

	      return _react2.default.createElement(
	        'div',
	        { className: 'mt10' },
	        _react2.default.createElement(
	          'h4',
	          null,
	          'Videos'
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          this.props.data.videos.map(function (v) {
	            return _react2.default.createElement(
	              _reactBootstrap.Col,
	              { key: v.key, xs: 6, md: 4 },
	              _react2.default.createElement(_reactBootstrap.Thumbnail, { src: 'http://img.youtube.com/vi/' + v.key + '/mqdefault.jpg' }),
	              _react2.default.createElement(
	                _reactBootstrap.Button,
	                {
	                  className: 'cp',
	                  bsSize: 'large',
	                  style: {
	                    position: 'absolute',
	                    left: '41%',
	                    top: '35%'
	                  },
	                  onClick: function onClick() {
	                    _this2.openModal(_react2.default.createElement(_reactYoutube2.default, { videoId: v.key, opts: options }));
	                  }
	                },
	                _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'play' })
	              )
	            );
	          })
	        )
	      );
	    }
	  }, {
	    key: 'images',
	    value: function images() {
	      var _this3 = this;

	      if (this.props.mode === 'small' || !this.props.data.images) {
	        return null;
	      }

	      return _react2.default.createElement(
	        'div',
	        { className: 'mt10' },
	        _react2.default.createElement(
	          'h4',
	          null,
	          'Images'
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          this.props.data.images.map(function (i) {
	            return _react2.default.createElement(
	              _reactBootstrap.Col,
	              { key: i.file_path, xs: 6, md: 2 },
	              _react2.default.createElement(_reactBootstrap.Thumbnail, {
	                className: 'cp',
	                src: 'https://image.tmdb.org/t/p/w185/' + i.file_path,
	                onClick: function onClick() {
	                  _this3.openModal(_react2.default.createElement(_reactBootstrap.Image, {
	                    responsive: true, src: 'https://image.tmdb.org/t/p/w780/' + i.file_path,
	                    style: { margin: 'auto' }
	                  }));
	                }
	              })
	            );
	          })
	        )
	      );
	    }
	  }, {
	    key: 'credits',
	    value: function credits() {
	      if (this.props.mode === 'small' || !this.props.data.credits) {
	        return null;
	      }

	      var openPerson = function openPerson(id) {
	        return function (e) {
	          e.preventDefault();
	          window.open('https://www.themoviedb.org/person/' + id);
	        };
	      };

	      var Person = function Person(props) {
	        return _react2.default.createElement(
	          _reactBootstrap.Col,
	          { key: props.name, xs: 6, sm: 3, className: 'm5 p5', style: { minHeight: 72 } },
	          _react2.default.createElement(_reactBootstrap.Image, {
	            className: 'pull-left mr10 cp',
	            style: { width: 45, height: 68 },
	            src: props.profile_path ? 'https://image.tmdb.org/t/p/w92/' + props.profile_path : 'http://placehold.it/45?text=no+image',
	            alt: props.name,
	            onClick: openPerson(props.id)
	          }),
	          _react2.default.createElement(
	            'div',
	            { className: 'mt5' },
	            _react2.default.createElement(
	              'strong',
	              { className: 'cp', onClick: openPerson(props.id) },
	              props.name
	            ),
	            props.character ? _react2.default.createElement(
	              'p',
	              null,
	              'as ',
	              props.character
	            ) : null
	          )
	        );
	      };

	      var direction = null;
	      if (this.props.data.credits.direction) {
	        direction = _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 12 },
	            _react2.default.createElement(
	              'h4',
	              null,
	              'Directed by'
	            )
	          ),
	          this.props.data.credits.direction.map(function (p) {
	            return _react2.default.createElement(Person, p);
	          })
	        );
	      }

	      var cast = null;
	      if (this.props.data.credits.cast) {
	        cast = _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 12 },
	            _react2.default.createElement(
	              'h4',
	              null,
	              'With'
	            )
	          ),
	          this.props.data.credits.cast.map(function (p) {
	            return _react2.default.createElement(Person, p);
	          })
	        );
	      }

	      var guest = null;
	      if (this.props.data.credits.guest) {
	        guest = _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 12 },
	            _react2.default.createElement(
	              'h4',
	              null,
	              'Guest stars'
	            )
	          ),
	          this.props.data.credits.guest.map(function (p) {
	            return _react2.default.createElement(Person, p);
	          })
	        );
	      }

	      if (!direction && !cast && !guest) {
	        return null;
	      }

	      return _react2.default.createElement(
	        'div',
	        { className: 'mt10' },
	        direction,
	        cast,
	        guest
	      );
	    }
	  }, {
	    key: 'decorated',
	    value: function decorated(data) {
	      return _react2.default.createElement(
	        _reactBootstrap.Grid,
	        { className: 'p-media bb mb15 pb10' },
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 12, sm: 2 },
	            _react2.default.createElement(_reactBootstrap.Image, {
	              responsive: true,
	              className: 'poster mb10',
	              src: data.poster,
	              alt: data.title + ' poster'
	            })
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 12, sm: 10 },
	            this.title(),
	            this.detail(),
	            this.overview(),
	            this.episodes(),
	            this.additional(),
	            this.seemore()
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 12 },
	            _react2.default.createElement(
	              'div',
	              { className: 'bg-info text-center pt20 pr5 pb20 pl5' },
	              data.path
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 12 },
	            this.videos(),
	            this.images(),
	            this.credits()
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Modal,
	          { show: this.state.showModal, bsSize: 'large', onHide: this.closeModal },
	          _react2.default.createElement(_reactBootstrap.Modal.Header, { closeButton: true }),
	          _react2.default.createElement(
	            _reactBootstrap.Modal.Body,
	            null,
	            _react2.default.createElement(
	              'div',
	              { className: 'text-center' },
	              this.state.modalContent
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Modal.Footer,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Button,
	              { onClick: this.closeModal },
	              'Close'
	            )
	          )
	        )
	      );
	    }
	  }, {
	    key: 'unknown',
	    value: function unknown(data) {
	      var title = data.base;
	      if (data.title) {
	        title = data.title;
	      }
	      return _react2.default.createElement(
	        _reactBootstrap.Row,
	        { className: 'p-media bb mb15 pb10' },
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          null,
	          _react2.default.createElement(
	            'h4',
	            { className: 'mt0' },
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { to: '/medias/' + data.id },
	              title,
	              ' '
	            )
	          ),
	          _react2.default.createElement(
	            'ul',
	            { className: 'list-inline text-muted small' },
	            _react2.default.createElement(
	              'li',
	              null,
	              _react2.default.createElement(
	                'strong',
	                null,
	                'path:'
	              ),
	              ' ',
	              data.path
	            )
	          )
	        )
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var data = this.props.data;
	      if (!data) {
	        return null;
	      }

	      if (this.props.mode === 'small') {
	        if (data.decoration === 'undecorated' || data.decoration === 'failed') {
	          return this.unknown(data);
	        }
	      }

	      return this.decorated(data);
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

/***/ 653:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Header = function Header(props) {
	  var headerCss = void 0;
	  var headerContent = void 0;
	  if (props.error) {
	    headerCss = 'bg-danger';
	    headerContent = 'Error while retrieving: ' + props.error;
	  } else if (props.nothing) {
	    headerCss = 'bg-warning';
	    headerContent = 'Nothing found.';
	  } else {
	    headerCss = 'dn';
	  }

	  return _react2.default.createElement(
	    'div',
	    { className: 'p15 ' + headerCss },
	    headerContent
	  );
	};

	Header.propTypes = {
	  error: _react2.default.PropTypes.string,
	  nothing: _react2.default.PropTypes.bool
	};

	exports.default = Header;

/***/ },

/***/ 654:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactBootstrap = __webpack_require__(267);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Loading = function Loading() {
	  return _react2.default.createElement(
	    'div',
	    { className: 'text-center loading' },
	    _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'repeat' }),
	    _react2.default.createElement(
	      'div',
	      { className: 'mt10' },
	      'Loading...'
	    )
	  );
	};

	exports.default = Loading;

/***/ },

/***/ 655:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactBootstrap = __webpack_require__(267);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PeriodSelector = function PeriodSelector(props) {
	  var from = 1;
	  var to = 10;

	  var options = [];
	  for (var i = from; i <= to; i++) {
	    options.push(_react2.default.createElement(
	      'option',
	      { key: i, value: i },
	      i,
	      ' day(s)'
	    ));
	  }

	  return _react2.default.createElement(
	    _reactBootstrap.Form,
	    { inline: true, className: 'pt20' },
	    _react2.default.createElement(
	      _reactBootstrap.FormGroup,
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.ControlLabel,
	        { className: 'mr10' },
	        'Period'
	      ),
	      _react2.default.createElement(
	        _reactBootstrap.FormControl,
	        {
	          componentClass: 'select',
	          defaultValue: props.period,
	          onChange: function onChange(e) {
	            return props.changePeriod(parseInt(e.target.value, 10));
	          }
	        },
	        options
	      )
	    )
	  );
	};

	PeriodSelector.propTypes = {
	  period: _react2.default.PropTypes.number,
	  changePeriod: _react2.default.PropTypes.func
	};

	exports.default = PeriodSelector;

/***/ },

/***/ 656:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactBootstrap = __webpack_require__(267);

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
	    key: 'onPremailerChange',
	    value: function onPremailerChange(event) {
	      this.setState({ premailer: !!event.target.checked });
	    }
	  }, {
	    key: 'onSeeEmail',
	    value: function onSeeEmail(event) {
	      event.preventDefault();
	      window.open('/email?period=' + this.props.period + '&premailer=' + this.state.premailer);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _reactBootstrap.Form,
	        { inline: true, className: 'mt10' },
	        _react2.default.createElement(
	          _reactBootstrap.Button,
	          { type: 'submit', onClick: this.onSeeEmail },
	          'See daily email'
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Checkbox,
	          { onChange: this.onPremailerChange },
	          'w/ premailer'
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

/***/ 657:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(168);

	var _MediasActions = __webpack_require__(530);

	var _Header = __webpack_require__(653);

	var _Header2 = _interopRequireDefault(_Header);

	var _Pagination = __webpack_require__(658);

	var _Pagination2 = _interopRequireDefault(_Pagination);

	var _Card = __webpack_require__(540);

	var _Card2 = _interopRequireDefault(_Card);

	var _Loading = __webpack_require__(654);

	var _Loading2 = _interopRequireDefault(_Loading);

	var _SelectCategory = __webpack_require__(659);

	var _SelectCategory2 = _interopRequireDefault(_SelectCategory);

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
	      this.props.fetch(this.props.search, this.props.category, this.props.page);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (nextProps.search !== this.props.search || nextProps.category !== this.props.category || nextProps.page !== this.props.page) {
	        this.props.fetch(nextProps.search, nextProps.category, nextProps.page);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.props.isFetching === true) {
	        return _react2.default.createElement(_Loading2.default, null);
	      }

	      var title = this.props.search ? 'Search for: "' + this.props.search + '"' : 'Medias list';

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'h1',
	          null,
	          title
	        ),
	        _react2.default.createElement(_Header2.default, { error: this.props.error, nothing: !this.props.items.length }),
	        _react2.default.createElement(_SelectCategory2.default, this.props),
	        _react2.default.createElement(_Pagination2.default, this.props),
	        this.props.items.map(function (i) {
	          return _react2.default.createElement(
	            _Card2.default,
	            { data: i, key: i.id, mode: 'small' },
	            i.title
	          );
	        }),
	        _react2.default.createElement(_Pagination2.default, this.props)
	      );
	    }
	  }]);

	  return Medias;
	}(_react2.default.Component);

	Medias.propTypes = {
	  isFetching: _react2.default.PropTypes.bool,
	  error: _react2.default.PropTypes.string,
	  search: _react2.default.PropTypes.string,
	  category: _react2.default.PropTypes.string,
	  page: _react2.default.PropTypes.number,
	  pages: _react2.default.PropTypes.number,
	  items: _react2.default.PropTypes.array,
	  changeCategory: _react2.default.PropTypes.func,
	  changePage: _react2.default.PropTypes.func,
	  fetch: _react2.default.PropTypes.func
	};

	exports.default = (0, _reactRedux.connect)(function (_ref) {
	  var medias = _ref.medias;
	  return medias;
	}, function (dispatch) {
	  return {
	    changeCategory: function changeCategory(category) {
	      return dispatch((0, _MediasActions.changeCategory)(category));
	    },
	    changePage: function changePage(page) {
	      return dispatch((0, _MediasActions.changePage)(page));
	    },
	    fetch: function fetch(s, c, p) {
	      return dispatch((0, _MediasActions.fetchMedias)(s, c, p));
	    }
	  };
	})(Medias);

/***/ },

/***/ 658:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactBootstrap = __webpack_require__(267);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AdvancedPagination = function AdvancedPagination(props) {
	  if (props.pages < 1) {
	    return null;
	  }

	  return _react2.default.createElement(_reactBootstrap.Pagination, {
	    prev: true,
	    next: true,
	    first: true,
	    last: true,
	    ellipsis: true,
	    boundaryLinks: true,
	    items: props.pages,
	    maxButtons: 5,
	    activePage: props.page,
	    onSelect: props.changePage
	  });
	};

	AdvancedPagination.propTypes = {
	  pages: _react2.default.PropTypes.number,
	  page: _react2.default.PropTypes.number,
	  changePage: _react2.default.PropTypes.func
	};

	exports.default = AdvancedPagination;

/***/ },

/***/ 659:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactBootstrap = __webpack_require__(267);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SelectCategory = function SelectCategory(props) {
	  return _react2.default.createElement(
	    _reactBootstrap.Form,
	    { inline: true, className: 'text-right' },
	    _react2.default.createElement(
	      _reactBootstrap.FormGroup,
	      { controlId: 'formControlsSelect' },
	      _react2.default.createElement(
	        _reactBootstrap.ControlLabel,
	        { className: 'mr10' },
	        'Filter by'
	      ),
	      _react2.default.createElement(
	        _reactBootstrap.FormControl,
	        {
	          componentClass: 'select',
	          defaultValue: props.category,
	          onChange: function onChange(e) {
	            return props.changeCategory(e.target.value);
	          }
	        },
	        _react2.default.createElement(
	          'option',
	          { value: 'decorated' },
	          'movie & tv'
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
	          { value: 'undecorated' },
	          'not already analysed'
	        ),
	        _react2.default.createElement(
	          'option',
	          { value: 'failed' },
	          'analyse failed'
	        )
	      )
	    )
	  );
	};

	SelectCategory.propTypes = {
	  category: _react2.default.PropTypes.string,
	  changeCategory: _react2.default.PropTypes.func
	};

	exports.default = SelectCategory;

/***/ },

/***/ 660:
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

	var _MediaActions = __webpack_require__(661);

	var _Header = __webpack_require__(653);

	var _Header2 = _interopRequireDefault(_Header);

	var _Loading = __webpack_require__(654);

	var _Loading2 = _interopRequireDefault(_Loading);

	var _Card = __webpack_require__(540);

	var _Card2 = _interopRequireDefault(_Card);

	var _Decoration = __webpack_require__(662);

	var _Decoration2 = _interopRequireDefault(_Decoration);

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
	      this.props.fetch(this.props.params.mediaId);
	    }
	  }, {
	    key: 'goBack',
	    value: function goBack(e) {
	      e.preventDefault();
	      this.props.goBack();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      if (this.props.isFetching === true) {
	        return _react2.default.createElement(_Loading2.default, null);
	      }

	      var data = this.props.data || {};

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
	        _react2.default.createElement(_Header2.default, { error: this.props.error, nothing: !this.props.data }),
	        _react2.default.createElement(_Card2.default, { data: data, mode: 'large' }),
	        _react2.default.createElement(_Decoration2.default, {
	          decoration: data.decoration,
	          initialSearch: data.title,
	          decorate: function decorate(id, type) {
	            return _this2.props.decorate(_this2.props.params.mediaId, id, type);
	          }
	        })
	      );
	    }
	  }]);

	  return Media;
	}(_react2.default.Component);

	Media.propTypes = {
	  error: _react2.default.PropTypes.string,
	  params: _react2.default.PropTypes.object,
	  data: _react2.default.PropTypes.object,
	  isFetching: _react2.default.PropTypes.bool,
	  fetch: _react2.default.PropTypes.func,
	  decorate: _react2.default.PropTypes.func,
	  goBack: _react2.default.PropTypes.func
	};

	exports.default = (0, _reactRedux.connect)(function (_ref) {
	  var media = _ref.media;
	  return media;
	}, function (dispatch) {
	  return {
	    goBack: function goBack() {
	      return dispatch((0, _reactRouterRedux.goBack)());
	    },
	    fetch: function fetch(id) {
	      return dispatch((0, _MediaActions.fetchMedia)(id));
	    },
	    decorate: function decorate(id, tmdbId, tmdbType) {
	      return dispatch((0, _MediaActions.decorate)(id, tmdbId, tmdbType));
	    }
	  };
	})(Media);

/***/ },

/***/ 661:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.request = request;
	exports.receive = receive;
	exports.error = error;
	exports.fetchMedia = fetchMedia;
	exports.patchRequest = patchRequest;
	exports.decorate = decorate;

	var _fetchWrapper = __webpack_require__(531);

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

	function patchRequest() {
	  return { type: 'MEDIA_DECORATION_REQUEST' };
	}
	function decorate(id, tmdbId, tmdbType) {
	  return function (dispatch, getState) {
	    var isPatching = getState().media.isPatching;
	    if (isPatching) {
	      return Promise.resolve();
	    }

	    dispatch(patchRequest());

	    var options = {
	      method: 'POST',
	      body: {
	        tmdbId: tmdbId,
	        tmdbType: tmdbType
	      }
	    };

	    return (0, _fetchWrapper2.default)('/api/medias/' + id + '/decoration', null, options).then(function (response) {
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

/***/ 662:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(168);

	var _DecorationActions = __webpack_require__(663);

	var _Loading = __webpack_require__(654);

	var _Loading2 = _interopRequireDefault(_Loading);

	var _Form = __webpack_require__(664);

	var _Form2 = _interopRequireDefault(_Form);

	var _Results = __webpack_require__(665);

	var _Results2 = _interopRequireDefault(_Results);

	var _Confirmation = __webpack_require__(666);

	var _Confirmation2 = _interopRequireDefault(_Confirmation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Decoration = function (_React$Component) {
	  _inherits(Decoration, _React$Component);

	  function Decoration() {
	    _classCallCheck(this, Decoration);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Decoration).apply(this, arguments));
	  }

	  _createClass(Decoration, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      if (!this.props.search && this.props.initialSearch) {
	        this.props.changeSearch(this.props.initialSearch);
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (nextProps.page !== this.props.page) {
	        this.props.submitSearch(nextProps.search, nextProps.page);
	      }
	      if (nextProps.chosen && nextProps.didConfirm) {
	        this.props.decorate(nextProps.chosen.id, nextProps.chosen.media_type);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var loading = null;
	      if (this.props.isFetching === true) {
	        loading = _react2.default.createElement(_Loading2.default, null);
	      }

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_Confirmation2.default, this.props),
	        _react2.default.createElement(_Form2.default, this.props),
	        loading,
	        _react2.default.createElement(_Results2.default, this.props)
	      );
	    }
	  }]);

	  return Decoration;
	}(_react2.default.Component);

	Decoration.propTypes = {
	  search: _react2.default.PropTypes.string,
	  initialSearch: _react2.default.PropTypes.string,
	  page: _react2.default.PropTypes.number,
	  isFetching: _react2.default.PropTypes.bool,
	  chosen: _react2.default.PropTypes.any,
	  didConfirm: _react2.default.PropTypes.bool,
	  changeSearch: _react2.default.PropTypes.func,
	  submitSearch: _react2.default.PropTypes.func,
	  changePage: _react2.default.PropTypes.func,
	  decorate: _react2.default.PropTypes.func
	};

	exports.default = (0, _reactRedux.connect)(function (_ref) {
	  var decoration = _ref.decoration;
	  return decoration;
	}, function (dispatch) {
	  return {
	    changeSearch: function changeSearch(search) {
	      return dispatch((0, _DecorationActions.changeSearch)(search));
	    },
	    submitSearch: function submitSearch(search, page) {
	      return dispatch((0, _DecorationActions.fetchTmdb)(search, page));
	    },
	    changePage: function changePage(page) {
	      return dispatch((0, _DecorationActions.changePage)(page));
	    },
	    forceDecoration: function forceDecoration() {
	      return dispatch((0, _DecorationActions.force)());
	    },
	    choose: function choose(data) {
	      return dispatch((0, _DecorationActions.choose)(data));
	    },
	    confirm: function confirm() {
	      return dispatch((0, _DecorationActions.confirm)());
	    },
	    cancel: function cancel() {
	      return dispatch((0, _DecorationActions.cancel)());
	    }
	  };
	})(Decoration);

/***/ },

/***/ 663:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.force = force;
	exports.changeSearch = changeSearch;
	exports.changePage = changePage;
	exports.request = request;
	exports.receive = receive;
	exports.fetchTmdb = fetchTmdb;
	exports.choose = choose;
	exports.confirm = confirm;
	exports.cancel = cancel;

	var _fetchWrapper = __webpack_require__(531);

	var _fetchWrapper2 = _interopRequireDefault(_fetchWrapper);

	var _MediaActions = __webpack_require__(661);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function force() {
	  return {
	    type: 'DECORATION_FORCE',
	    force: true
	  };
	}

	function changeSearch(search) {
	  return {
	    type: 'DECORATION_SEARCH',
	    search: search
	  };
	}

	function changePage(page) {
	  return {
	    type: 'DECORATION_PAGE',
	    page: page
	  };
	}

	function request() {
	  return { type: 'DECORATION_REQUEST' };
	}

	function receive(pages, items) {
	  return {
	    type: 'DECORATION_RECEIVE',
	    pages: pages,
	    items: items
	  };
	}

	function fetchTmdb(search, page) {
	  return function (dispatch, getState) {
	    var isFetching = getState().decoration.isFetching;
	    if (isFetching) {
	      return Promise.resolve();
	    }
	    if (!search) {
	      return Promise.resolve();
	    }

	    dispatch(request());

	    var query = {
	      page: {
	        number: page
	      },
	      filter: {
	        search: search || undefined
	      }
	    };
	    if (search) {
	      query.filter.search = search;
	    }

	    return (0, _fetchWrapper2.default)('/api/tmdb', query).then(function (response) {
	      if (response.error) {
	        return Promise.reject(new Error(response.error.title));
	      }

	      return dispatch(receive(response.meta['total-pages'], response.data));
	    }).catch(function (err) {
	      return dispatch((0, _MediaActions.error)(err));
	    });
	  };
	}

	function choose(chosen) {
	  return {
	    type: 'DECORATION_CHOOSE',
	    chosen: chosen
	  };
	}

	function confirm() {
	  return { type: 'DECORATION_CONFIRM' };
	}

	function cancel() {
	  return { type: 'DECORATION_CANCEL' };
	}

/***/ },

/***/ 664:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactBootstrap = __webpack_require__(267);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var DecorationForm = function DecorationForm(props) {
	  if (!props.force && props.decoration === 'decorated') {
	    return _react2.default.createElement(
	      _reactBootstrap.Button,
	      {
	        bsStyle: 'success',
	        onClick: props.forceDecoration
	      },
	      'Decorated: click to change'
	    );
	  }

	  var onFormSubmit = function onFormSubmit(e) {
	    e.preventDefault();
	    props.submitSearch(props.search, props.page);
	  };

	  return _react2.default.createElement(
	    _reactBootstrap.Form,
	    { inline: true, className: 'mb10', onSubmit: onFormSubmit },
	    _react2.default.createElement(
	      _reactBootstrap.FormGroup,
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.ControlLabel,
	        null,
	        'Search'
	      ),
	      ' ',
	      _react2.default.createElement(_reactBootstrap.FormControl, {
	        type: 'text',
	        placeholder: 'Search',
	        value: props.search,
	        onChange: function onChange(e) {
	          return props.changeSearch(e.target.value);
	        }
	      })
	    ),
	    ' ',
	    _react2.default.createElement(
	      _reactBootstrap.Button,
	      { onClick: function onClick() {
	          return props.submitSearch(props.search, props.page);
	        } },
	      'Submit'
	    ),
	    _react2.default.createElement(
	      _reactBootstrap.Button,
	      { bsStyle: 'link', onClick: props.forceDecoration },
	      'Cancel'
	    )
	  );
	};

	DecorationForm.propTypes = {
	  search: _react2.default.PropTypes.string,
	  page: _react2.default.PropTypes.number,
	  forceDecoration: _react2.default.PropTypes.func,
	  changeSearch: _react2.default.PropTypes.func,
	  submitSearch: _react2.default.PropTypes.func
	};

	exports.default = DecorationForm;

/***/ },

/***/ 665:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactBootstrap = __webpack_require__(267);

	var _Pagination = __webpack_require__(658);

	var _Pagination2 = _interopRequireDefault(_Pagination);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var POSTER_BASE = 'https://image.tmdb.org/t/p/w92/';
	var getPosterComponent = function getPosterComponent(poster) {
	  return poster ? _react2.default.createElement(_reactBootstrap.Image, { src: '' + POSTER_BASE + poster }) : null;
	};

	var Results = function Results(props) {
	  if (!props.items || !props.items.length) {
	    return props.didFetch ? _react2.default.createElement(
	      'div',
	      null,
	      'no result found'
	    ) : null;
	  }

	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(_Pagination2.default, props),
	    _react2.default.createElement(
	      _reactBootstrap.Table,
	      { striped: true, bordered: true, condensed: true, hover: true },
	      _react2.default.createElement(
	        'thead',
	        null,
	        _react2.default.createElement(
	          'tr',
	          null,
	          _react2.default.createElement(
	            'th',
	            null,
	            '#'
	          ),
	          _react2.default.createElement(
	            'th',
	            null,
	            'poster'
	          ),
	          _react2.default.createElement(
	            'th',
	            null,
	            'overview'
	          ),
	          _react2.default.createElement(
	            'th',
	            null,
	            'action'
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'tbody',
	        null,
	        props.items.map(function (i) {
	          return _react2.default.createElement(
	            'tr',
	            { key: i.id },
	            _react2.default.createElement(
	              'td',
	              null,
	              i.id
	            ),
	            _react2.default.createElement(
	              'td',
	              null,
	              getPosterComponent(i.poster_path)
	            ),
	            _react2.default.createElement(
	              'td',
	              null,
	              _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(
	                  'strong',
	                  null,
	                  'title:'
	                ),
	                ' ',
	                i.title || i.name || '-',
	                ' ',
	                _react2.default.createElement(
	                  'small',
	                  null,
	                  i.release_date ? '(' + i.release_date.substr(0, 4) + ')' : null
	                )
	              ),
	              _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(
	                  'strong',
	                  null,
	                  'original title:'
	                ),
	                ' ',
	                i.original_title || i.original_name || '-'
	              ),
	              _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(
	                  'strong',
	                  null,
	                  'category:'
	                ),
	                ' ',
	                i.media_type || '-'
	              ),
	              _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(
	                  'strong',
	                  null,
	                  'overview:'
	                ),
	                ' ',
	                i.overview || '-'
	              )
	            ),
	            _react2.default.createElement(
	              'td',
	              null,
	              _react2.default.createElement(
	                _reactBootstrap.Button,
	                { onClick: function onClick() {
	                    return props.choose(i);
	                  } },
	                'choose!'
	              )
	            )
	          );
	        })
	      )
	    ),
	    _react2.default.createElement(_Pagination2.default, props)
	  );
	};

	Results.propTypes = {
	  didFetch: _react2.default.PropTypes.bool,
	  items: _react2.default.PropTypes.array,
	  pages: _react2.default.PropTypes.number,
	  page: _react2.default.PropTypes.number,
	  changePage: _react2.default.PropTypes.func,
	  choose: _react2.default.PropTypes.func
	};

	exports.default = Results;

/***/ },

/***/ 666:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactBootstrap = __webpack_require__(267);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var POSTER_BASE = 'https://image.tmdb.org/t/p/w92/';
	var getPosterComponent = function getPosterComponent(poster) {
	  return poster ? _react2.default.createElement(_reactBootstrap.Image, { src: '' + POSTER_BASE + poster }) : null;
	};

	var Confirmation = function Confirmation(props) {
	  if (!props.chosen || props.didConfirm) {
	    return null;
	  }

	  return _react2.default.createElement(
	    'div',
	    { className: 'static-modal' },
	    _react2.default.createElement(
	      _reactBootstrap.Modal.Dialog,
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.Modal.Header,
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Modal.Title,
	          null,
	          'Confirm your choice?'
	        )
	      ),
	      _react2.default.createElement(
	        _reactBootstrap.Modal.Body,
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 6, md: 2 },
	            getPosterComponent(props.chosen.poster_path)
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 12, md: 10 },
	            _react2.default.createElement(
	              'div',
	              null,
	              _react2.default.createElement(
	                'strong',
	                null,
	                'title:'
	              ),
	              ' ',
	              props.chosen.title || props.chosen.name || '-',
	              ' ',
	              _react2.default.createElement(
	                'small',
	                null,
	                props.chosen.release_date ? '(' + props.chosen.release_date.substr(0, 4) + ')' : null
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              null,
	              _react2.default.createElement(
	                'strong',
	                null,
	                'original title:'
	              ),
	              ' ',
	              props.chosen.original_title || props.chosen.original_name || '-'
	            ),
	            _react2.default.createElement(
	              'div',
	              null,
	              _react2.default.createElement(
	                'strong',
	                null,
	                'category:'
	              ),
	              ' ',
	              props.chosen.media_type || '-'
	            ),
	            _react2.default.createElement(
	              'div',
	              null,
	              _react2.default.createElement(
	                'strong',
	                null,
	                'overview:'
	              ),
	              ' ',
	              props.chosen.overview || '-'
	            )
	          )
	        )
	      ),
	      _react2.default.createElement(
	        _reactBootstrap.Modal.Footer,
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Button,
	          { onClick: props.cancel },
	          'Cancel'
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Button,
	          { bsStyle: 'primary', onClick: props.confirm },
	          'Confirm'
	        )
	      )
	    )
	  );
	};

	Confirmation.propTypes = {
	  chosen: _react2.default.PropTypes.any,
	  didConfirm: _react2.default.PropTypes.bool,
	  data: _react2.default.PropTypes.object,
	  confirm: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func
	};

	exports.default = Confirmation;

/***/ }

});