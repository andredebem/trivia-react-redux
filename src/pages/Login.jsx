import React, { Component } from 'react'
// import PropTypes from 'prop-types'

export default class Login extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      email: '',
      invalid: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.validateNameAndEmail = this.validateNameAndEmail.bind(this);
  }

  validateEmail(mail) {
    const format = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (mail.match(format)) {
      return true;
    }
    return false;
  }

  validateNameAndEmail() {
    const { name, email } = this.state;
    const minLength = 1;
    if (this.validateEmail(email) === true && name.length >= minLength) {
      this.setState({
        invalid: false,
      });
    } else {
      this.setState({
        invalid: true,
      });
    }
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value,
    }, () => this.validateNameAndEmail());
  }


  render() {
    return (
      <form>
        <label htmlFor="name">
          Nome:
          <input
            data-testid="input-player-name"
            type="text"
            name="name"
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            data-testid="input-gravatar-email"
            type="email"
            name="email"
          />
        </label>
        <button type="button">Jogar</button>
      </form>
    );
  }
}
