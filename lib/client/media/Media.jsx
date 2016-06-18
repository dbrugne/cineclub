import React from 'react';
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import { fetchMedia } from './MediaActions';
import Card from '../components/Card';
import Decoration from '../decoration/Decoration';
import Loading from '../components/Loading';

class Media extends React.Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  componentDidMount() {
    this.props.fetch(this.props.params.mediaId);
  }
  goBack(e) {
    e.preventDefault();
    this.props.goBack();
  }
  render() {
    if (this.props.isFetching === true) {
      return <Loading />;
    }

    let headerCss;
    let headerContent;
    if (this.props.error) {
      headerCss = 'bg-danger';
      headerContent = `Error while retrieving: ${this.props.error}`;
    } else if (!this.props.data) {
      headerCss = 'bg-warning';
      headerContent = 'Nothing found.';
    } else {
      headerCss = 'dn';
    }

    const data = this.props.data || {};

    return (
      <div>
        <div className="mb15">
          <a href="#" onClick={this.goBack}>&lt; Back</a>
        </div>
        <div className={`p15 ${headerCss}`}>
          {headerContent}
        </div>
        <Card data={data} mode="large" />
        <Decoration
          decoration={data.decoration}
          initialSearch={data.title}
        />
      </div>
    );
  }
}

Media.propTypes = {
  error: React.PropTypes.string,
  params: React.PropTypes.object,
  data: React.PropTypes.object,
  isFetching: React.PropTypes.bool,
  fetch: React.PropTypes.func,
  goBack: React.PropTypes.func,
};

export default connect(
  ({ media }) => media,
  dispatch => ({
    goBack: () => dispatch(goBack()),
    fetch: id => dispatch(fetchMedia(id)),
  })
)(Media);
