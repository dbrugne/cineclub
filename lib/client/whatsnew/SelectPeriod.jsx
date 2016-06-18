import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const PeriodSelector = props => {
  const from = 1;
  const to = 10;

  const options = [];
  for (let i = from; i <= to; i++) {
    options.push((
      <option key={i} value={i}>{i} day(s)</option>
    ));
  }

  return (
    <Form inline className="pt20">
      <FormGroup>
        <ControlLabel className="mr10">Period</ControlLabel>
        <FormControl
          componentClass="select"
          defaultValue={props.period}
          onChange={e => props.changePeriod(parseInt(e.target.value, 10))}
        >
          {options}
        </FormControl>
      </FormGroup>
    </Form>);
};

PeriodSelector.propTypes = {
  period: React.PropTypes.number,
  changePeriod: React.PropTypes.func,
};

export default PeriodSelector;
