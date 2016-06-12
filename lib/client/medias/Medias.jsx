import React from 'react';
import { connect } from 'react-redux';
import { changeCategory, changePage, fetchMedias } from './MediasActions';
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Card from '../components/Card';

class Medias extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchMedias(
      this.props.search,
      this.props.category,
      this.props.page
    ));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.search !== this.props.search
      || nextProps.category !== this.props.category
      || nextProps.page !== this.props.page
    ) {
      this.props.dispatch(fetchMedias(
        nextProps.search,
        nextProps.category,
        nextProps.page
      ));
    }
  }
  pagination() {
    if (this.props.pages === 0) {
      return null;
    }

    const firstActive = (this.props.page !== 1)
      ? ''
      : 'disabled';
    const lastActive = (this.props.page !== this.props.pages)
      ? ''
      : 'disabled';

    const change = (e, i) => {
      e.preventDefault();
      this.props.dispatch(changePage(i));
    };

    const pageLinks = [];
    for (let i = 1; i <= this.props.pages; i++) {
      pageLinks.push((
        <li key={i} className={this.props.page === i ? 'active' : ''}>
          <a href="#" onClick={e => change(e, i)}>{i}</a>
        </li>
      ));
    }

    return (
      <nav>
        <ul className="pagination">
          <li className={firstActive}>
            <a href="#" onClick={e => change(e, 1)}>
              <span>&laquo;</span>
            </a>
          </li>
          {pageLinks}
          <li className={lastActive}>
            <a href="#" onClick={e => change(e, this.props.pages)}>
              <span>&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
  render() {
    if (this.props.isFetching === true) {
      return <div>Loading...</div>;
    }

    let headerCss;
    let headerContent;
    if (this.props.error) {
      headerCss = 'bg-danger';
      headerContent = `Error while retrieving: ${this.props.error}`;
    } else if (!this.props.items.length) {
      headerCss = 'bg-warning';
      headerContent = 'Nothing found.';
    } else {
      headerCss = 'dn';
    }

    const title = (this.props.search)
      ? `Search for: "${this.props.search}"`
      : 'Medias list';

    const change = e => {
      e.preventDefault();
      this.props.dispatch(changeCategory(e.target.value));
    };
    const pagination = this.pagination();

    return (
      <div>
        <h1>{title}</h1>
        <div className="text-right">
          <Form inline>
            <FormGroup controlId="formControlsSelect">
              <ControlLabel className="mr10">Filter by</ControlLabel>
              <FormControl
                componentClass="select"
                defaultValue={this.props.category}
                onChange={change}
              >
                <option value="decorated">movie & tv</option>
                <option value="movie">movie</option>
                <option value="tv">tv</option>
                <option value="undecorated">not already analysed</option>
                <option value="failed">analyse failed</option>
              </FormControl>
            </FormGroup>
          </Form>
        </div>
        <div className={`p15 ${headerCss}`}>
          {headerContent}
        </div>
        {pagination}
        <div>
          {this.props.items.map(
            i => <Card data={i} key={i.id} mode="small">{i.title}</Card>
          )}
        </div>
        {pagination}
      </div>
    );
  }
}
Medias.propTypes = {
  dispatch: React.PropTypes.func,
  isFetching: React.PropTypes.bool,
  error: React.PropTypes.string,
  search: React.PropTypes.string,
  category: React.PropTypes.string,
  page: React.PropTypes.number,
  pages: React.PropTypes.number,
  items: React.PropTypes.array,
};

export default connect(({ medias }) => medias, null)(Medias);
