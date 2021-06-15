import React, { Component } from 'react';
import md5 from 'crypto-js/md5';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Perguntas extends Component {
  constructor() {
    super();

    this.state = {
      avatarLink: '',
      name: '',
      score: 0,
      questions: [],
    };

    this.getImageGravatar = this.getImageGravatar.bind(this);
    this.getScoreAndName = this.getScoreAndName.bind(this);
    this.fetchQuestions = this.fetchQuestions.bind(this);
    this.renderQuestions = this.renderQuestions.bind(this);
  }

  componentDidMount() {
    const state = JSON.parse(localStorage.getItem('state'));
    const { player: { gravatarEmail, name, score } } = state;
    const hashEmail = md5(gravatarEmail).toString();
    this.getImageGravatar(hashEmail);
    this.getScoreAndName(score, name);
    this.fetchQuestions();
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

  fetchQuestions() {
    const { token } = this.props;
    fetch(`https://opentdb.com/api.php?amount=5&token=${token}`)
      .then((response) => response.json())
      .then((object) => this.setState({
        questions: object.results,
      }));
  }

  renderQuestions() {
    const { questions } = this.state;
    return questions
      .map(({
        category,
        question, correct_answer: correctAnswer,
        incorrect_answers: incorrectAnswer },
      index) => {
        const magicNumber = 0.5;
        const answers = (incorrectAnswer.concat(correctAnswer))
          .sort(() => Math.random() - magicNumber);
        // Referência da função de randomizar o array: https://flaviocopes.com/how-to-shuffle-array-javascript/
        const renderAnswers = answers.map((answer, index2) => {
          if (answer === correctAnswer) {
            return (
              <button
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
    const { avatarLink, name, score, questions } = this.state;
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
        <main>
          { questions.length > 0 && this.renderQuestions() }
        </main>
      </div>
    );
  }
}

const mapStateTopProps = (state) => ({
  token: state.token.token,
});

Perguntas.propTypes = {
  token: PropTypes.string.isRequired,
};

export default connect(mapStateTopProps, null)(Perguntas);
