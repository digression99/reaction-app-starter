import { NEW_MESSAGE } from './types';
import uuidv4 from 'uuid/v4';

export const newMessage = (text) => ({ type : NEW_MESSAGE, payload : { id: uuidv4(), text, timestamp : Date.now() } });



