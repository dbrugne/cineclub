import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { createHistory } from 'history';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import App from './app/App';
import NotFound from './app/NotFound';
import WhatsNew from './whatsnew/WhatsNew';
import Medias from './medias/Medias';
import Media from './media/Media';
import Admin from './admin/Admin';
import 'whatwg-fetch'; // polyfills

const store = configureStore();

const browserHistory = useRouterHistory(createHistory)({
  basename: '/app',
});

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={WhatsNew} />
        <Route path="medias" component={Medias} />
        <Route path="/medias/:mediaId" component={Media} />
        <Route path="admin" component={Admin} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));
