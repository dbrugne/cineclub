import React from 'react';
import Card from '../components/Card';

class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData() {
    fetch(`/api/medias/${this.props.params.mediaId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          loading: false,
          data: data.data,
        });
      });
  }
  render() {
    if (this.state.loading === true) {
      return <div>Loading...</div>;
    }

    return <Card data={this.state.data} mode="large" />;
  }
}

Media.propTypes = {
  params: React.PropTypes.object,
};

export default Media;
