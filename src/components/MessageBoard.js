import React from 'react';
import { useAppContext } from '../hooks';

export default () => {
  const { state } = useAppContext();
  const messages = state.messages;

  return (
    <div>
      {messages.map(message => {
        const { id, text, username, timestamp } = message;
        return (
          <div key={id}>
            <h4>{new Date(timestamp).toLocaleString()}</h4>
            <p>{text}</p>
            <h4>- { username }</h4>
            <hr />
          </div>
        );
      })}
    </div>
  );
};