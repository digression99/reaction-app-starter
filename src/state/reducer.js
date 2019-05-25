import { NEW_MESSAGE, SET_USERNAME } from './types';

export const initialState = { messages : [], username : 'anonymous' };

const reducer = (state, action) => {
  console.log('state : ', state);
  switch (action.type) {
    case NEW_MESSAGE:
      return { ...state, messages : [...state.messages, action.payload ] };
    case SET_USERNAME:
      return { ...state, username : action.payload };
    default:
      return state;
  }
};

export default reducer;