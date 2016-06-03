import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';

// polyfills
import 'whatwg-fetch';

import App from './app/Appx';
import NotFound from './app/NotFoundx';
import WhatsNew from './whatsnew/WhatsNewx';
import Medias from './medias/Mediasx';
import Media from './media/Mediax';
import Admin from './admin/Adminx';

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
