import React from 'react';
import { connect } from 'react-redux';
import { changePeriod, fetchWhatsNew } from './WhatsNewActions';
import { Row, Col } from 'react-bootstrap';
import Left from './Content';
import SelectPeriod from './SelectPeriod';
import SelectEmail from './SelectEmail';

class Whatsnew extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchWhatsNew(this.props.period));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.period !== this.props.period) {
      this.props.dispatch(fetchWhatsNew(nextProps.period));
    }
  }
  render() {
    return (
      <Row>
        <Col md={10}>
          <Left {...this.props} />
        </Col>
        <Col md={2}>
          <SelectPeriod
            period={this.props.period}
            onPeriodChange={e => this.props.dispatch(changePeriod(parseInt(e.target.value, 10)))}
          />
          <hr />
          <SelectEmail period={this.props.period} />
        </Col>
      </Row>
    );
  }
}

Whatsnew.propTypes = {
  dispatch: React.PropTypes.func,
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

export default connect(({ whatsnew }) => whatsnew)(Whatsnew);
