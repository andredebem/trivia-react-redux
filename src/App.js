import React from 'react';
import { Route, Switch } from 'react-router';
import Login from './pages/Login';
import Ranking from './pages/Ranking';
import Perguntas from './pages/Perguntas';
import Settings from './pages/Settings';
import './App.css';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route path="/questions" component={ Perguntas } />
      <Route path="/settings" component={ Settings } />
      <Route path="/ranking" component={ Ranking } />
    </Switch>
  );
}
