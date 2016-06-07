import React from 'react';

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
    <form className="form-inline pt20">
      <div className="form-group">
        <label className="mr10" htmlFor="period">Period</label>
        <select
          className="form-control"
          id="period"
          defaultValue={props.period}
          onChange={props.onPeriodChange}
        >
          {options}
        </select>
      </div>
    </form>);
};

PeriodSelector.propTypes = {
  period: React.PropTypes.number,
  onPeriodChange: React.PropTypes.func,
};

export default PeriodSelector;
