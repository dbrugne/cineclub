import React from 'react';
import { connect } from 'react-redux';
import { fetchMedia } from './MediaActions';
import Card from '../components/Card';

class Media extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchMedia(this.props.params.mediaId));
  }
  render() {
    if (this.props.isFetching === true) {
      return <div>Loading...</div>;
    } else if (!this.props.data) {
      return null;
    }

    return <Card data={this.props.data} mode="large" />;
  }
}

Media.propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  data: React.PropTypes.object,
  isFetching: React.PropTypes.bool,
};

export default connect(({ media }) => media)(Media);
