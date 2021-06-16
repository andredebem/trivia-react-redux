import React, { Component } from 'react';
import md5 from 'crypto-js/md5';
import { connect } from 'react-redux';
import './style.css';
import PropTypes from 'prop-types';

class Perguntas extends Component {
  constructor() {
    super();

    this.state = {
      avatarLink: '',
      name: '',
      score: 0,
      questions: [],
      intervalId: '',
      count: 30,
      answerClicked: false,
    };

    this.getImageGravatar = this.getImageGravatar.bind(this);
    this.getScoreAndName = this.getScoreAndName.bind(this);
    this.fetchQuestions = this.fetchQuestions.bind(this);
    this.renderQuestions = this.renderQuestions.bind(this);
    this.setIntervalState = this.setIntervalState.bind(this);
    this.timer = this.timer.bind(this);
    this.changeClassNameCorrect = this.changeClassNameCorrect.bind(this);
    this.changeClassNameIncorrect = this.changeClassNameIncorrect.bind(this);
    this.changeAnswerState = this.changeAnswerState.bind(this);
    this.changeDisabled = this.changeDisabled.bind(this);
    this.changeScoreLocalStorage = this.changeScoreLocalStorage.bind(this);
  }

  componentDidMount() {
    const state = JSON.parse(localStorage.getItem('state'));
    const { player: { gravatarEmail, name, score } } = state;
    const hashEmail = md5(gravatarEmail).toString();
    this.getImageGravatar(hashEmail);
    this.getScoreAndName(score, name);
    this.fetchQuestions();
    this.setIntervalState();
  }

  componentWillUnmount() {
    const { intervalId } = this.state;
    clearInterval(intervalId);
  }

  setIntervalState() {
    const ONE_SECOND = 1000;
    const intervalId = setInterval(this.timer, ONE_SECOND);
    this.setState({ intervalId });
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

  timer() {
    const { count, intervalId } = this.state;
    const newCount = count - 1;
    if (newCount >= 0) {
      this.setState({ count: newCount });
    } else {
      clearInterval(intervalId);
    }
  }

  fetchQuestions() {
    const { token } = this.props;
    fetch(`https://opentdb.com/api.php?amount=5&token=${token}`)
      .then((response) => response.json())
      .then((object) => this.setState({
        questions: object.results,
      }));
  }

  changeClassNameCorrect() {
    const { answerClicked } = this.state;
    if (answerClicked === true) {
      return 'correct_answer';
    }
    return '';
  }

  changeClassNameIncorrect() {
    const { answerClicked } = this.state;
    if (answerClicked === true) {
      return 'incorrect_answer';
    }
    return '';
  }

  changeAnswerState() {
    this.setState({
      answerClicked: true,
    });
  }

  changeDisabled() {
    const { count } = this.state;
    if (count === 0) {
      return true;
    }
    return false;
  }

  changeScoreLocalStorage(difficulty) {
    let difficultyNumber = 0;
    if (difficulty === 'hard') {
      difficultyNumber = 3;
    } if (difficulty === 'medium') {
      difficultyNumber = 2;
    } if (difficulty === 'easy') {
      difficultyNumber = 1;
    }
    const { count } = this.state;
    const points = 10;
    const result = points + (count * difficultyNumber);
    const state = JSON.parse(localStorage.getItem('state'));
    let { player: { score } } = state;
    const newScore = result + score;
    score = newScore;
    localStorage.setItem('state', JSON.stringify(state));
  }

  renderQuestions() {
    const { questions } = this.state;
    return questions
      .filter((question, index) => index === 0)
      .map(({
        category, difficulty, question, correct_answer: correctAnswer,
        incorrect_answers: incorrectAnswer }, index) => {
        const magicNumber = 0.5;
        const answers = (incorrectAnswer.concat(correctAnswer))
          .sort(() => Math.random() - magicNumber);
        // Referência da função de randomizar o array: https://flaviocopes.com/how-to-shuffle-array-javascript/
        const renderAnswers = answers.map((answer, index2) => {
          if (answer === correctAnswer) {
            return (
              <button
                disabled={ this.changeDisabled() }
                className={ this.changeClassNameCorrect() }
                onClick={ () => {
                  this.changeAnswerState();
                  this.changeScoreLocalStorage(difficulty);
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
              disabled={ this.changeDisabled() }
              className={ this.changeClassNameIncorrect() }
              onClick={ () => this.changeAnswerState() }
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
    const { avatarLink, name, score, questions, count } = this.state;
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
          <section>
            { count }
          </section>
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

/* <html>
    <head>
        <title>Page Title</title>
    </head>
    <body>
       <h1 id="head">Good Night</h1>
       <script>
           const head = document.getElementById("head");
           const msgs = ["Hello", "Hi", "Good morning", "Good night"];
      var i = 0;
setInterval(() => (i==msgs.length)?(i=0):(head.innerHTML = msgs[++i]), 2000);
       </script>
    </body>
</html> */

export default connect(mapStateTopProps, null)(Perguntas);
