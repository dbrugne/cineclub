import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';

// polyfills
import 'whatwg-fetch';

import App from './app/App';
import NotFound from './app/NotFound';
import WhatsNew from './whatsnew/WhatsNew';
import Medias from './medias/Medias';
import Media from './media/Media';
import Admin from './admin/Admin';

const browserHistory = useRouterHistory(createHistory)({
  basename: '/app',
});

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={WhatsNew} />
      <Route path="medias" component={Medias} />
      <Route path="/medias/:mediaId" component={Media} />
      <Route path="admin" component={Admin} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('app'));
