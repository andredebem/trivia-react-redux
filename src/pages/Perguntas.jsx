import React, { Component } from 'react';
import md5 from 'crypto-js/md5';
// import PropTypes from 'prop-types'

export default class Perguntas extends Component {
  constructor() {
    super();

    this.state = {
      avatarLink: '',
      name: '',
      score: 0,
    };

    this.getImageGravatar = this.getImageGravatar.bind(this);
    this.getScoreAndName = this.getScoreAndName.bind(this);
  }

  componentDidMount() {
    const state = JSON.parse(localStorage.getItem('state'));
    const { player: { gravatarEmail, name, score } } = state;
    const hashEmail = md5(gravatarEmail).toString();
    this.getImageGravatar(hashEmail);
    this.getScoreAndName(score, name);
  }

  getImageGravatar(hashEmail) {
    const link = `https://www.gravatar.com/avatar/${hashEmail}`;
    this.setState({
      avatarLink: link,
    });
  }

  getScoreAndName(score, name) {
    this.setState({
      name,
      score,
    });
  }

  render() {
    const { avatarLink, name, score } = this.state;

    return (
      <div>
        <header>
          <img
            src={ avatarLink }
            alt="user avatar"
            data-testid="header-profile-picture"
          />
          <span data-testid="header-player-name">{ name }</span>
          <span data-testid="header-score">{ score }</span>
        </header>
      </div>
    );
  }
}
