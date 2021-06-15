import REQUEST_TOKEN from '../actions/index';

const INITIAL_STATE = {
  objToken: {},
};

const token = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case REQUEST_TOKEN:
    return {
      ...state,
      objToken: action.payload.objToken,
    };
  default:
    return state;
  }
};

export default token;
