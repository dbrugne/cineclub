import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { changeSearch, fetchMedias } from '../medias/MediasActions';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }
  onSearchChange(e) {
    if (this.props.currentLocation !== '/medias') {
      this.props.dispatch(push('medias'));
    }

    const search = e.target.value;
    this.props.dispatch(changeSearch(search));
  }
  onSearchSubmit() {
    if (this.props.currentLocation !== '/medias') {
      this.props.dispatch(push('medias'));
    }
    this.props.dispatch(fetchMedias(this.props.search, this.props.category, 1));
  }
  render() {
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
              <li className={(this.props.currentLocation === '/medias') ? 'active' : null}>
                <Link to="/medias">Medias</Link>
              </li>
            </ul>
            <div className="navbar-form navbar-left" role="search">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={this.onSearchChange}
                  value={this.props.search}
                />
              </div>
              <button className="btn btn-default" onClick={this.onSearchSubmit}>Submit</button>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li className={(this.props.currentLocation === '/admin') ? 'active' : null}>
                <Link to="/admin">Admin</Link>
              </li>
              <li className={(this.props.currentLocation === '/logout') ? 'active' : null}>
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
  dispatch: React.PropTypes.func,
  currentLocation: React.PropTypes.string,
  search: React.PropTypes.string,
  category: React.PropTypes.string,
};

export default connect(
  state => ({
    search: state.medias.search || '',
    category: state.medias.category || '',
  })
)(Navigation);
