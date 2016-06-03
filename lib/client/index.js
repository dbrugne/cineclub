import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';

// polyfills
import 'whatwg-fetch';

import App from './app/app';
import NotFound from './app/not-found';
import Whatsnew from './whatsnew/whatsnew';
import Medias from './medias/medias';
import Media from './media/media';
import Admin from './admin/admin';

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
