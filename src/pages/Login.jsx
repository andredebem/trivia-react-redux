import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchToken } from '../redux/actions/tokenAction';

class Login extends Component {
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
    const { invalid } = this.state;
    const { fetchObjToken } = this.props;
    return (
      <form>
        <label htmlFor="name">
          Nome:
          <input
            data-testid="input-player-name"
            type="text"
            name="name"
            onChange={ this.handleChange }
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            data-testid="input-gravatar-email"
            type="email"
            name="email"
            onChange={ this.handleChange }
          />
        </label>
        <button
          type="button"
          data-testid="btn-play"
          disabled={ invalid }
          onClick={ () => fetchObjToken() }
        >
          Jogar
        </button>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchObjToken: () => dispatch(fetchToken()),
});

Login.propTypes = {
  fetchObjToken: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
