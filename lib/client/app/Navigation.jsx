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
      this.props.goToMedias();
    }

    this.props.changeSearch(e.target.value);
  }
  onSearchSubmit() {
    if (this.props.currentLocation !== '/medias') {
      this.props.goToMedias();
    }
    this.props.fetchMedias(this.props.search, this.props.category);
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
            <NavItem
              eventKey={1}
              active={(this.props.currentLocation === '/medias')}
              onClick={this.props.goToMedias}
            >
              Medias
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
              Logout
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Navigation.propTypes = {
  currentLocation: React.PropTypes.string,
  search: React.PropTypes.string,
  category: React.PropTypes.string,
  goToMedias: React.PropTypes.func,
  changeSearch: React.PropTypes.func,
  fetchMedias: React.PropTypes.func,
};

export default connect(
  state => ({
    search: state.medias.search || '',
    category: state.medias.category || '',
  }),
  dispatch => ({
    goToMedias: () => dispatch(push('medias')),
    changeSearch: search => dispatch(changeSearch(search)),
    fetchMedias: (search, category) => dispatch(fetchMedias(search, category, 1)),
  })
)(Navigation);
