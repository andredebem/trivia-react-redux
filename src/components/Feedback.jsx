import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Feedback extends Component {
  constructor() {
    super();

    this.renderMessage = this.renderMessage.bind(this);
  }

  componentDidMount() {
    const stateObject = JSON.parse(localStorage.getItem('state'));
    stateObject.player.score = 0;
    localStorage.setItem('state', JSON.stringify(stateObject));
  }

  // getScoreOfLocalStorage() {
  //   const state = JSON.parse(localStorage.getItem('state'));
  //   const { player: { score } } = state;
  //   return score;
  // }

  renderMessage() {
    const { correctQty } = this.props;
    const THREE = 3;
    if (correctQty < THREE) {
      return 'Podia ser melhor...';
    }
    return 'Mandou bem!';
  }

  render() {
    const { correctQty, score } = this.props;
    return (
      <div>
        <span data-testid="feedback-total-question ">{ correctQty }</span>
        <span data-testid="feedback-total-score">{ score }</span>
        <span data-testid="feedback-text">{ this.renderMessage() }</span>
      </div>
    );
  }
}

Feedback.propTypes = {
  correctQty: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};
