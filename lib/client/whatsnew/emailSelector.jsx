import React from 'react';

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
      <form className="form-inline mt10">
        <div className="form-group">
          <button
            className="btn btn-default form-control"
            onClick={this.onSeeEmail}
          >See daily email</button>
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              value="1"
              onChange={this.onPremailerChange}
            />
            {' '}
            w/ premailer
          </label>
        </div>
      </form>
    );
  }
}

EmailSelector.propTypes = {
  period: React.PropTypes.number.isRequired,
};

export default EmailSelector;
