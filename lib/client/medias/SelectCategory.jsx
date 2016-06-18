import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const SelectCategory = props => (
  <Form inline className="text-right">
    <FormGroup controlId="formControlsSelect">
      <ControlLabel className="mr10">Filter by</ControlLabel>
      <FormControl
        componentClass="select"
        defaultValue={props.category}
        onChange={e => props.changeCategory(e.target.value)}
      >
        <option value="decorated">movie & tv</option>
        <option value="movie">movie</option>
        <option value="tv">tv</option>
        <option value="undecorated">not already analysed</option>
        <option value="failed">analyse failed</option>
      </FormControl>
    </FormGroup>
  </Form>
);

SelectCategory.propTypes = {
  category: React.PropTypes.string,
  changeCategory: React.PropTypes.func,
};

export default SelectCategory;
