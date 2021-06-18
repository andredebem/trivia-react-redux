import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Feedback extends Component {
  constructor() {
    super();

    this.renderMessage = this.renderMessage.bind(this);
  }

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
        <span data-testid="feedback-total-question">{ correctQty }</span>
        <span data-testid="feedback-total-score">{ score }</span>
        <span data-testid="feedback-text">{ this.renderMessage() }</span>
        <Link to="/">
          <button type="button" data-testid="btn-play-again">Jogar novamente </button>
        </Link>
        <Link to="/ranking">
          <button type="button" data-testid="btn-ranking">Ranking </button>
        </Link>
      </div>
    );
  }
}

Feedback.propTypes = {
  correctQty: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};
