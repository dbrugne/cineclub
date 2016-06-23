import React from 'react';
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import { fetchMedia, decorate } from './MediaActions';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Card from '../card/Card';
import Decoration from '../decoration/Decoration';

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

    const data = this.props.data || {};

    return (
      <div>
        <div className="mb15">
          <a href="#" onClick={this.goBack}>&lt; Back</a>
        </div>
        <Header error={this.props.error} nothing={!this.props.data} />
        <Card data={data} mode="large" />
        <Decoration
          decoration={data.decoration}
          initialSearch={data.title}
          decorate={(id, type) => this.props.decorate(this.props.params.mediaId, id, type)}
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
  decorate: React.PropTypes.func,
  goBack: React.PropTypes.func,
};

export default connect(
  ({ media }) => media,
  dispatch => ({
    goBack: () => dispatch(goBack()),
    fetch: id => dispatch(fetchMedia(id)),
    decorate: (id, tmdbId, tmdbType) => dispatch(decorate(id, tmdbId, tmdbType)),
  })
)(Media);
