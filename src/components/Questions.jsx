import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Questions extends Component {
  constructor() {
    super();

    this.renderProps = this.renderProps.bind(this);
    this.renderQuestions = this.renderQuestions.bind(this);
  }

  renderProps() {
    const {
      questions,
      indexQuestions,
      changeDisabled,
      changeClassNameCorrect,
      changeClassNameIncorrect,
      changeAnswerState,
      changeScoreLocalStorage,
    } = this.props;
    const propsList = {
      questions,
      indexQuestions,
      changeDisabled,
      changeClassNameCorrect,
      changeClassNameIncorrect,
      changeAnswerState,
      changeScoreLocalStorage,
    };
    return propsList;
  }

  renderQuestions() {
    const propsList = this.renderProps();
    return propsList.questions
      .filter((question, index) => index === propsList.indexQuestions)
      .map(({
        category, difficulty, question, correct_answer: correctAnswer,
        incorrect_answers: incorrectAnswer }, index) => {
        const magicNumber = 0.5;
        const answers = (incorrectAnswer.concat(correctAnswer))
          .sort(() => Math.random() - magicNumber);
        const renderAnswers = answers.map((answer, index2) => {
          if (answer === correctAnswer) {
            return (
              <button
                disabled={ propsList.changeDisabled() }
                className={ propsList.changeClassNameCorrect() }
                onClick={ () => {
                  propsList.changeAnswerState();
                  propsList.changeScoreLocalStorage(difficulty);
                } }
                key={ answer }
                type="button"
                data-testid="correct-answer"
              >
                {answer}
              </button>
            );
          }
          return (
            <button
              disabled={ propsList.changeDisabled() }
              className={ propsList.changeClassNameIncorrect() }
              onClick={ () => propsList.changeAnswerState() }
              key={ answer }
              type="button"
              data-testid={ `wrong-answer-${index2}` }
            >
              {answer}
            </button>
          );
        });
        return (
          <div key={ index }>
            <p key={ category } data-testid="question-category">{ category }</p>
            <p key={ question } data-testid="question-text">{ question }</p>
            { renderAnswers }
          </div>
        );
      });
  }

  render() {
    return (
      <div>
        { this.renderQuestions() }
      </div>
    );
  }
}
// Referência da função de randomizar o array: https://flaviocopes.com/how-to-shuffle-array-javascript/

Questions.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  indexQuestions: PropTypes.number.isRequired,
  changeDisabled: PropTypes.func.isRequired,
  changeClassNameCorrect: PropTypes.func.isRequired,
  changeClassNameIncorrect: PropTypes.func.isRequired,
  changeAnswerState: PropTypes.func.isRequired,
  changeScoreLocalStorage: PropTypes.func.isRequired,
};
