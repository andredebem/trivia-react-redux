import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchToken } from '../redux/actions/tokenAction';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      email: '',
      invalid: true,
      redirect: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.validateNameAndEmail = this.validateNameAndEmail.bind(this);
    this.saveToken = this.saveToken.bind(this);
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
    this.setState(
      {
        [target.name]: target.value,
      },
      () => this.validateNameAndEmail(),
    );
  }

  async saveToken() {
    const { fetchTokenToState } = this.props;
    await fetchTokenToState();
    const { token } = this.props;
    const { email, name } = this.state;
    const state = {
      player: {
        name,
        gravatarEmail: email,
        score: 0,
        assertions: 0,
      },
    };
    localStorage.setItem('token', token);
    localStorage.setItem('state', JSON.stringify(state));
    this.setState({
      redirect: true,
    });
    if (localStorage.getItem('ranking') === null) {
      localStorage.setItem('ranking', JSON.stringify([]));
    }
  }

  render() {
    const { invalid, redirect } = this.state;
    if (redirect) {
      return <Redirect to="/questions" />;
    }
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
          onClick={ () => this.saveToken() }
        >
          Jogar
        </button>
        <Link to="/settings">
          <button type="button" data-testid="btn-settings">
            Configurações
          </button>
        </Link>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.token.token,
});

const mapDispatchToProps = (dispatch) => ({
  fetchTokenToState: () => dispatch(fetchToken()),
});

Login.propTypes = {
  fetchTokenToState: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
