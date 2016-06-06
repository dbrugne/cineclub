import React from 'react';
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import { fetchMedia } from './MediaActions';
import Card from '../components/Card';

class Media extends React.Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(fetchMedia(this.props.params.mediaId));
  }
  goBack(e) {
    e.preventDefault();
    this.props.dispatch(goBack());
  }
  render() {
    if (this.props.isFetching === true) {
      return <div>Loading...</div>;
    } else if (!this.props.data) {
      return null;
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

    return (
      <div>
        <div className="mb15">
          <a href="#" onClick={this.goBack}>&lt; Back</a>
        </div>
        <div className={`p15 ${headerCss}`}>
          {headerContent}
        </div>
        <Card data={this.props.data} mode="large" />
      </div>
    );
  }
}

Media.propTypes = {
  dispatch: React.PropTypes.func,
  error: React.PropTypes.string,
  params: React.PropTypes.object,
  data: React.PropTypes.object,
  isFetching: React.PropTypes.bool,
};

export default connect(({ media }) => media)(Media);
