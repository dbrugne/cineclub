import React from 'react';
import SelectPeriod from './SelectPeriod';
import SelectEmail from './SelectEmail';

const Right = props => (
  <div className="col-md-2">
    <SelectPeriod
      period={props.period}
      onPeriodChange={e => {
        props.onPeriodChange(parseInt(e.target.value, 10));
      }}
    />
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
  onPeriodChange: React.PropTypes.func,
};

export default Right;
