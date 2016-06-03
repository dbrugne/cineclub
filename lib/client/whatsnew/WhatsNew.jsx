import React from 'react';
import Left from './Left';
import Right from './Right';

class Whatsnew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      period: 1,
      data: null,
    };
    this.onPeriodChange = this.onPeriodChange.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  onPeriodChange(event) {
    this.setState({
      loading: true,
      period: parseInt(event.target.value, 10),
      data: null,
    }, () => {
      this.fetchData();
    });
  }
  fetchData() {
    fetch(`/api/whatsnew?period=${this.state.period}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          loading: false,
          data: data.data,
        });
      });
  }
  render() {
    return (
      <div className="row">
        <Left data={this.state.data} />
        <Right period={this.state.period} onPeriodChange={this.onPeriodChange} />
      </div>
    );
  }
}

export default Whatsnew;
