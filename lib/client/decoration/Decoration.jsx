import React from 'react';
import { connect } from 'react-redux';
import { force, changeSearch, changePage, fetchTmdb } from './DecorationActions';
import Loading from '../components/Loading';
import Form from './Form';
import Results from './Results';

class Decoration extends React.Component {
  componentDidMount() {
    if (!this.props.search && this.props.initialSearch) {
      this.props.changeSearch(this.props.initialSearch);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page) {
      this.props.submitSearch(nextProps.search, nextProps.page);
    }
  }
  render() {
    let loading = null;
    if (this.props.isFetching === true) {
      loading = <Loading />;
    }

    return (
      <div>
        <Form {...this.props} />
        {loading}
        <Results {...this.props} />
      </div>
    );
  }
}

Decoration.propTypes = {
  changeSearch: React.PropTypes.func,
  submitSearch: React.PropTypes.func,
  changePage: React.PropTypes.func,
  forceDecoration: React.PropTypes.func,
  error: React.PropTypes.string,
  decoration: React.PropTypes.string,
  search: React.PropTypes.string,
  initialSearch: React.PropTypes.string,
  items: React.PropTypes.array,
  pages: React.PropTypes.number,
  page: React.PropTypes.number,
  isFetching: React.PropTypes.bool,
  force: React.PropTypes.bool,
};

export default connect(
  ({ decoration }) => decoration,
  dispatch => ({
    changeSearch: search => dispatch(changeSearch(search)),
    submitSearch: (search, page) => dispatch(fetchTmdb(search, page)),
    changePage: page => dispatch(changePage(page)),
    forceDecoration: () => dispatch(force()),
    chooseMovie: id => console.log(id),
  })
)(Decoration);
