import React from 'react';
import { connect } from 'react-redux';
import { changeCategory, changePage, fetchMedias } from './MediasActions';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import Card from '../card/Card';
import Loading from '../components/Loading';
import SelectCategory from './SelectCategory';

class Medias extends React.Component {
  componentDidMount() {
    this.props.fetch(this.props.search, this.props.category, this.props.page);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.search !== this.props.search
      || nextProps.category !== this.props.category
      || nextProps.page !== this.props.page
    ) {
      this.props.fetch(nextProps.search, nextProps.category, nextProps.page);
    }
  }
  render() {
    if (this.props.isFetching === true) {
      return <Loading />;
    }

    const title = (this.props.search)
      ? `Search for: "${this.props.search}"`
      : 'Medias list';

    return (
      <div>
        <h1>{title}</h1>
        <Header error={this.props.error} nothing={!this.props.items.length} />
        <SelectCategory {...this.props} />
        <Pagination {...this.props} />
        {this.props.items.map(
          i => <Card data={i} key={i.id} mode="small">{i.title}</Card>
        )}
        <Pagination {...this.props} />
      </div>
    );
  }
}
Medias.propTypes = {
  isFetching: React.PropTypes.bool,
  error: React.PropTypes.string,
  search: React.PropTypes.string,
  category: React.PropTypes.string,
  page: React.PropTypes.number,
  pages: React.PropTypes.number,
  items: React.PropTypes.array,
  changeCategory: React.PropTypes.func,
  changePage: React.PropTypes.func,
  fetch: React.PropTypes.func,
};

export default connect(
  ({ medias }) => medias,
  dispatch => ({
    changeCategory: category => dispatch(changeCategory(category)),
    changePage: page => dispatch(changePage(page)),
    fetch: (s, c, p) => dispatch(fetchMedias(s, c, p)),
  })
)(Medias);
