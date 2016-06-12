import React from 'react';
import { Form, Checkbox, Button } from 'react-bootstrap';

class EmailSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      premailer: false,
    };
    this.onPremailerChange = this.onPremailerChange.bind(this);
    this.onSeeEmail = this.onSeeEmail.bind(this);
  }
  onPremailerChange(event) {
    this.setState({ premailer: !!event.target.checked });
  }
  onSeeEmail(event) {
    event.preventDefault();
    window.open(`/email?period=${this.props.period}&premailer=${this.state.premailer}`);
  }
  render() {
    return (
      <Form inline className="mt10">
        <Button type="submit" onClick={this.onSeeEmail}>See daily email</Button>
        <Checkbox onChange={this.onPremailerChange}>
          w/ premailer
        </Checkbox>
      </Form>
    );
  }
}

EmailSelector.propTypes = {
  period: React.PropTypes.number.isRequired,
};

export default EmailSelector;
