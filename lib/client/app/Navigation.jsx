import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { Navbar, Nav, NavItem, FormGroup, FormControl, Button } from 'react-bootstrap';
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
      <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Ciné-club</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} active={(this.props.currentLocation === '/medias')}>
              <Link to="/medias">Medias</Link>
            </NavItem>
            <Navbar.Form pullLeft>
              <FormGroup>
                <FormControl
                  type="text"
                  placeholder="Search"
                  onChange={this.onSearchChange}
                  value={this.props.search}
                />
              </FormGroup>
              {' '}
              <Button type="submit" onClick={this.onSearchSubmit}>Submit</Button>
            </Navbar.Form>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={3} active={(this.props.currentLocation === '/logout')}>
              <Link to="/logout">Logout</Link>
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
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
