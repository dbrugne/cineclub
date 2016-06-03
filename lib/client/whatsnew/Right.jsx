import React from 'react';
import SelectPeriod from './SelectPeriod';
import SelectEmail from './SelectEmail';

const Right = props => (
  <div className="col-md-2">
    <SelectPeriod defaultValue={props.period} update={props.onPeriodChange} />
    <div className="mt10 text-left">
      Jump to :
      {' '}
      <a href="#movies">Movies</a>
      {' '}
      <a href="#series">Series</a>
      {' '}
      <a href="#unknown">Unknown</a>
      {' '}
      <a href="#removed">Removed</a>
      {' '}
    </div>
    <hr />
    <SelectEmail period={props.period} />
  </div>
);

Right.propTypes = {
  period: React.PropTypes.number,
  onPeriodChange: React.PropTypes.function,
};

export default Right;
