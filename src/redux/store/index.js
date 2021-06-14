import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import composeWithDevTools from './ComposeWithDevTools';
import rootReducer from '../reducers/index';

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk),
  ),
);

export default store;
