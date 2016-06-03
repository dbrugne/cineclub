import React from 'react';
import Navigation from './Navigation';

const App = props => (
  <div>
    <Navigation active={props.location.pathname} />
    {props.children}
  </div>
);

App.propTypes = {
  location: React.PropTypes.object,
  children: React.PropTypes.node,
};

export default App;
