import React, { Component } from 'react';
import md5 from 'crypto-js/md5';
import { connect } from 'react-redux';
import './style.css';
import PropTypes from 'prop-types';
import Feedback from '../components/Feedback';
import Questions from '../components/Questions';

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
      buttonNext: false,
      indexQuestions: 0,
      correctQty: 0,
    };

    this.getImageGravatar = this.getImageGravatar.bind(this);
    this.getScoreAndName = this.getScoreAndName.bind(this);
    this.fetchQuestions = this.fetchQuestions.bind(this);
    this.setIntervalState = this.setIntervalState.bind(this);
    this.timer = this.timer.bind(this);
    this.changeClassNameCorrect = this.changeClassNameCorrect.bind(this);
    this.changeClassNameIncorrect = this.changeClassNameIncorrect.bind(this);
    this.changeAnswerState = this.changeAnswerState.bind(this);
    this.changeDisabled = this.changeDisabled.bind(this);
    this.changeScoreLocalStorage = this.changeScoreLocalStorage.bind(this);
    this.renderNextButton = this.renderNextButton.bind(this);
    this.nextButtonClicked = this.nextButtonClicked.bind(this);
    this.renderQuestionsOrFeedback = this.renderQuestionsOrFeedback.bind(this);
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
    const { intervalId } = this.state;
    this.setState({
      answerClicked: true,
      buttonNext: true,
    });
    clearInterval(intervalId);
  }

  changeDisabled() {
    const { count, answerClicked } = this.state;
    if (count === 0 || answerClicked) {
      return true;
    }
    return false;
  }

  defineDifficult(difficulty) {
    let difficultyNumber = 0;
    if (difficulty === 'hard') {
      const THREE = 3;
      difficultyNumber = THREE;
    } if (difficulty === 'medium') {
      difficultyNumber = 2;
    } if (difficulty === 'easy') {
      difficultyNumber = 1;
    }
    return difficultyNumber;
  }

  changeScoreLocalStorage(difficulty) {
    const difficultyNumber = this.defineDifficult(difficulty);
    const { count, name, correctQty } = this.state;
    const points = 10;
    const result = points + (count * difficultyNumber);
    const stateObject = JSON.parse(localStorage.getItem('state'));
    const { player: { score } } = stateObject;
    stateObject.player.score = result + score;
    localStorage.setItem('state', JSON.stringify(stateObject));
    this.getScoreAndName((result + score), name);
    this.setState({
      correctQty: correctQty + 1,
    });
  }

  nextButtonClicked() {
    const { indexQuestions } = this.state;
    const ONE_SECOND = 1000;
    const intervalId = setInterval(this.timer, ONE_SECOND);
    this.setState({
      buttonNext: false,
      answerClicked: false,
      intervalId,
      count: 30,
      indexQuestions: indexQuestions + 1,
    });
  }

  renderNextButton() {
    return (
      <button
        type="button"
        data-testid="btn-next"
        onClick={ () => this.nextButtonClicked() }
      >
        Próxima
      </button>
    );
  }

  renderQuestionsOrFeedback() {
    const { questions, indexQuestions, correctQty, score } = this.state;
    if (questions.length > 0) {
      const FIVE = 5;
      if (indexQuestions < FIVE) {
        return (
          <Questions
            questions={ questions }
            indexQuestions={ indexQuestions }
            changeDisabled={ this.changeDisabled }
            changeClassNameCorrect={ this.changeClassNameCorrect }
            changeClassNameIncorrect={ this.changeClassNameIncorrect }
            changeAnswerState={ this.changeAnswerState }
            changeScoreLocalStorage={ this.changeScoreLocalStorage }
          />
        );
      }
      const stateObject = JSON.parse(localStorage.getItem('state'));
      stateObject.player.assertions = correctQty;
      localStorage.setItem('state', JSON.stringify(stateObject));
      return (
        <Feedback correctQty={ correctQty } score={ score } />
      );
    }
  }

  render() {
    const { avatarLink, name, score, count, buttonNext } = this.state;
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
          { this.renderQuestionsOrFeedback() }
          { buttonNext && this.renderNextButton() }
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

export default connect(mapStateTopProps, null)(Perguntas);
