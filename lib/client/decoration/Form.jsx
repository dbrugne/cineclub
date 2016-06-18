import React from 'react';
import { Button, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const DecorationForm = props => {
  if (!props.force && props.decoration === 'decorated') {
    return (
      <Button
        bsStyle="success"
        onClick={props.forceDecoration}
      >Decorated: click to change</Button>
    );
  }

  const onFormSubmit = e => {
    e.preventDefault();
    props.submitSearch(props.search, props.page);
  };

  return (
    <Form inline className="mb10" onSubmit={onFormSubmit}>
      <FormGroup>
        <ControlLabel>Search</ControlLabel>
        {' '}
        <FormControl
          type="text"
          placeholder="Search"
          value={props.search}
          onChange={e => props.changeSearch(e.target.value)}
        />
      </FormGroup>
      {' '}
      <Button onClick={() => props.submitSearch(props.search, props.page)}>Submit</Button>
      <Button bsStyle="link" onClick={props.forceDecoration}>Cancel</Button>
    </Form>
  );
};

DecorationForm.propTypes = {
  search: React.PropTypes.string,
  page: React.PropTypes.number,
  forceDecoration: React.PropTypes.func,
  changeSearch: React.PropTypes.func,
  submitSearch: React.PropTypes.func,
};

export default DecorationForm;
