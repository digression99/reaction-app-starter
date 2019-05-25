import { NEW_MESSAGE, SET_USERNAME, REACTION_OBJECTS } from './types';

export const initialState = { 
  messages : [], 
  username : 'anonymous',
  reactionsMap : {}
};

const REACTION_TYPES = REACTION_OBJECTS.map(REACTION_OBJECT => REACTION_OBJECT.type);

const reducer = (state, action) => {

  console.log('state : ', state);

  if (REACTION_TYPES.includes(action.type)) {
    let reactionsMap;

    const { messageId } = action.payload;

    const messageReactions = state.reactionsMap[messageId];
    if (messageReactions) {
      reactionsMap = {
        ...state.reactionsMap,
        [messageId] : [...messageReactions, action.payload]
      };
    } else {
      reactionsMap = {
        ...state.reactionsMap,
        [messageId] : [action.payload]
      }
    }

    return { ...state, reactionsMap };
  }

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