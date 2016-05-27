import React from 'react';
import Navigation from './navigation';
import Whatsnew from './whatsnew';

// polyfills
import 'whatwg-fetch';

class App extends React.Component {
  render() {
    return (
      <div>
        <Navigation />
        <div className="row">
          <Whatsnew />
        </div>
      </div>
    );
  }
}

export default App;
