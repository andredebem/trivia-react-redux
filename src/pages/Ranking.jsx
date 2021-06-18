import React, { Component } from 'react';
import md5 from 'crypto-js/md5';
import { Link } from 'react-router-dom';

export default class Ranking extends Component {
  constructor() {
    super();

    this.state = {
      render: false,
    };

    this.setStateTrue = this.setStateTrue.bind(this);
  }

  componentDidMount() {
    const state = JSON.parse(localStorage.getItem('state'));
    const { player: { gravatarEmail, name, score } } = state;
    const hashEmail = md5(gravatarEmail).toString();
    const picture = `https://www.gravatar.com/avatar/${hashEmail}`;
    const ranking = JSON.parse(localStorage.getItem('ranking'));
    const newRegister = {
      name,
      score,
      picture,
    };
    ranking.push(newRegister);
    localStorage.setItem('ranking', JSON.stringify(ranking));
    this.setStateTrue();
  }

  setStateTrue() {
    this.setState({
      render: true,
    });
  }

  renderRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking'));
    function compare(a, b) {
      if (a.score > b.score) {
        const NEGATIVE = -1;
        return NEGATIVE;
      }
      if (a.score < b.score) {
        return 1;
      }
      return 0;
    }
    const sortRanking = ranking.sort(compare);
    return sortRanking.map(({ picture, name, score }, index) => (
      <div key={ index }>
        <img key="avatar-user" src={ picture } alt="avatar-user" />
        <span key={ name } data-testid={ `player-name-${index}` }>{ name }</span>
        <span key={ score } data-tesid={ `player-score-${index}` }>{ score }</span>
      </div>
    ));
  }

  render() {
    const { render } = this.state;
    return (
      <section>
        <h1 data-testid="ranking-title">Ranking</h1>
        { render && this.renderRanking() }
        <Link to="/">
          <button type="button" data-testid="btn-go-home">Início</button>
        </Link>
      </section>
    );
  }
}
