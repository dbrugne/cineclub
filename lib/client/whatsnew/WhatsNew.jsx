import React from 'react';
import { connect } from 'react-redux';
import { changePeriod, fetchWhatsNew } from './WhatsNewActions';
import { Row, Col } from 'react-bootstrap';
import Left from './Content';
import SelectPeriod from './SelectPeriod';
import SelectEmail from './SelectEmail';

class Whatsnew extends React.Component {
  componentDidMount() {
    this.props.fetch(this.props.period);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.period !== this.props.period) {
      this.props.fetch(nextProps.period);
    }
  }
  render() {
    return (
      <Row>
        <Col md={10}>
          <Left {...this.props} />
        </Col>
        <Col md={2}>
          <SelectPeriod {...this.props} />
          <hr />
          <SelectEmail {...this.props} />
        </Col>
      </Row>
    );
  }
}

Whatsnew.propTypes = {
  error: React.PropTypes.string,
  isFetching: React.PropTypes.bool,
  period: React.PropTypes.number,
  onPeriodChange: React.PropTypes.func,
  movies: React.PropTypes.array,
  series: React.PropTypes.array,
  unknown: React.PropTypes.array,
  removed: React.PropTypes.array,
  fetch: React.PropTypes.func,
};

export default connect(
  ({ whatsnew }) => whatsnew,
  dispatch => ({
    changePeriod: period => dispatch(changePeriod(period)),
    fetch: period => dispatch(fetchWhatsNew(period)),
  })
)(Whatsnew);
