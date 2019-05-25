import React, { useReducer, useEffect } from 'react';
import reducer, { initialState } from '../state/reducer';
import PublishMessage from './PublishMessage';
import PubSub from '../pubsub';
import MessageBoard from './MessageBoard';
import SetUsername from './SetUsername';
import Context from '../context';

const pubsub = new PubSub();

const App = () => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    pubsub.addListener({
      message: messageObject => {
        const { channel, message } = messageObject;

        console.log("received message : ", message);
        console.log("channel : ", channel);

        dispatch(message);
      }
    });
  }, []);

  return (
    <Context.Provider value={{ state, dispatch, pubsub }}>
      <div>
        <h2>Reaction</h2>
        <SetUsername />
        <hr />
        <PublishMessage />
        <hr />
        <MessageBoard />
      </div>
    </Context.Provider>
  );
}

export default App;
