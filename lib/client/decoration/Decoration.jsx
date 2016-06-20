import React from 'react';
import { connect } from 'react-redux';
import {
  force,
  changeSearch,
  changePage,
  fetchTmdb,
  choose,
  confirm,
  cancel,
} from './DecorationActions';
import Loading from '../components/Loading';
import Form from './Form';
import Results from './Results';
import Confirmation from './Confirmation';

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
    if (nextProps.chosen && nextProps.didConfirm) {
      this.props.patch(nextProps.chosen);
    }
  }
  render() {
    let loading = null;
    if (this.props.isFetching === true) {
      loading = <Loading />;
    }

    return (
      <div>
        <Confirmation {...this.props} />
        <Form {...this.props} />
        {loading}
        <Results {...this.props} />
      </div>
    );
  }
}

Decoration.propTypes = {
  search: React.PropTypes.string,
  initialSearch: React.PropTypes.string,
  page: React.PropTypes.number,
  isFetching: React.PropTypes.bool,
  chosen: React.PropTypes.any,
  didConfirm: React.PropTypes.bool,
  changeSearch: React.PropTypes.func,
  submitSearch: React.PropTypes.func,
  changePage: React.PropTypes.func,
  patch: React.PropTypes.func,
};

export default connect(
  ({ decoration }) => decoration,
  dispatch => ({
    changeSearch: search => dispatch(changeSearch(search)),
    submitSearch: (search, page) => dispatch(fetchTmdb(search, page)),
    changePage: page => dispatch(changePage(page)),
    forceDecoration: () => dispatch(force()),
    choose: data => dispatch(choose(data)),
    confirm: () => dispatch(confirm()),
    cancel: () => dispatch(cancel()),
  })
)(Decoration);
