import { NEW_MESSAGE, SET_USERNAME } from './types';
import uuidv4 from 'uuid/v4';

export const newMessage = ({ text, username }) => ({ type : NEW_MESSAGE, payload : { id: uuidv4(), text, username, timestamp : Date.now() } });

export const setUsername = username => ({ type : SET_USERNAME, payload : username });



