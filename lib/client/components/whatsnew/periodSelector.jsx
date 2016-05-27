import React from 'react';

class PeriodSelector extends React.Component {
  render() {
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
            defaultValue={this.props.defaultValue}
            onChange={this.props.update}
          >
            {options}
          </select>
        </div>
      </form>
    );
  }
}

PeriodSelector.propTypes = {
  defaultValue: React.PropTypes.number,
  update: React.PropTypes.func,
};

export default PeriodSelector;
