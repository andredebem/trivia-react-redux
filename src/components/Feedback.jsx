import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    return (
      <div>
        <span data-testid="feedback-text">{ this.renderMessage() }</span>
      </div>
    );
  }
}

Feedback.propTypes = {
  correctQty: PropTypes.number.isRequired,
};
