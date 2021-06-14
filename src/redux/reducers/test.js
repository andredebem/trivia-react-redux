const INITIAL_STATE = {
  test: '',
};

const test = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case 'SUBMIT':
    return {
      ...state,
      email: action.payload.email,
    };
  default:
    return state;
  }
};

export default test;
