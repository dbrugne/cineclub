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
          error={this.props.error}
          isFetching={this.props.isFetching}
          movies={this.props.movies}
          series={this.props.series}
          unknown={this.props.unknown}
          removed={this.props.removed}
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

function mapStateToProps(state) {
  return {
    error: state.whatsnew.error,
    period: state.whatsnew.period,
    isFetching: state.whatsnew.isFetching,
    movies: state.whatsnew.movies,
    series: state.whatsnew.series,
    unknown: state.whatsnew.unknown,
    removed: state.whatsnew.removed,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPeriodChange: period => dispatch(changePeriod(period)),
    fetchWhatsNew: period => dispatch(fetchWhatsNew(period)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Whatsnew);
