import React from 'react';
import { connect } from 'react-redux';
import { changePeriod, fetchWhatsNew } from './WhatsNewActions';
import Left from './Left';
import Right from './Right';

class Whatsnew extends React.Component {
  componentDidMount() {
    this.props.fetchWhatsNew(this.props.period);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.period !== this.props.period) {
      nextProps.fetchWhatsNew(nextProps.period);
    }
  }
  render() {
    return (
      <div className="row">
        <Left
          {...this.props}
        />
        <Right period={this.props.period} onPeriodChange={this.props.onPeriodChange} />
      </div>
    );
  }
}

Whatsnew.propTypes = {
  error: React.PropTypes.string,
  fetchWhatsNew: React.PropTypes.func,
  isFetching: React.PropTypes.bool,
  period: React.PropTypes.number,
  onPeriodChange: React.PropTypes.func,
  movies: React.PropTypes.array,
  series: React.PropTypes.array,
  unknown: React.PropTypes.array,
  removed: React.PropTypes.array,
};

function mapDispatchToProps(dispatch) {
  return {
    onPeriodChange: period => dispatch(changePeriod(period)),
    fetchWhatsNew: period => dispatch(fetchWhatsNew(period)),
  };
}

export default connect(
  ({ whatsnew }) => whatsnew,
  mapDispatchToProps
)(Whatsnew);
