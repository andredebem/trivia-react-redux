import { REQUEST_TOKEN } from '../actions/index';

const INITIAL_STATE = {
  token: '',
};

const token = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case REQUEST_TOKEN:
    return {
      ...state,
      token: action.payload.token,
    };
  default:
    return state;
  }
};

export default token;
