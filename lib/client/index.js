import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';

// polyfills
import 'whatwg-fetch';

import App from './components/app';
import NotFound from './pages/not-found';
import Whatsnew from './pages/whatsnew';
import Medias from './pages/medias';
import Media from './pages/media';
import Admin from './pages/admin';

const browserHistory = useRouterHistory(createHistory)({
  basename: '/app',
});

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Whatsnew} />
      <Route path="medias" component={Medias} />
      <Route path="/medias/:mediaId" component={Media} />
      <Route path="admin" component={Admin} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('app'));
