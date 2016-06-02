import React from 'react';
import { browserHistory, Link } from 'react-router';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null,
    };
    this.onSearch = this.onSearch.bind(this);
  }
  onSearch() {
    browserHistory.push('/app/medias'); // @todo
  }
  render() {
    const active = this.props.active;
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
              aria-expanded="false"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link className="navbar-brand" to="/">Ciné-club</Link>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className={(active === '/whatsnew') ? 'active' : null}>
                <Link to="/whatsnew">What's new</Link>
              </li>
              <li className={(active === '/medias') ? 'active' : null}>
                <Link to="/medias">Medias</Link>
              </li>
            </ul>
            <div className="navbar-form navbar-left" role="search">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Search" />
              </div>
              <button
                className="btn btn-default"
                onClick={this.onSearch}
              >Submit</button>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li className={(active === '/admin') ? 'active' : null}>
                <Link to="/admin">Admin</Link>
              </li>
              <li className={(active === '/logout') ? 'active' : null}>
                <Link to="/logout">Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Navigation.propTypes = {
  active: React.PropTypes.string,
};

export default Navigation;
