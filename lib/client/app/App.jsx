import React from 'react';
import Navigation from './Navigation';
import { Grid } from 'react-bootstrap';

const App = props => (
  <div>
    <Navigation currentLocation={props.location.pathname} />
    <Grid>
      {props.children}
    </Grid>
  </div>
);

App.propTypes = {
  location: React.PropTypes.object,
  children: React.PropTypes.node,
};

export default App;
