import React from 'react';
import { useAppContext } from '../hooks';
import CreateReaction from './CreateReaction';
import MessageReactions from './MessageReactions';

export default () => {
  const { state : {messages, reactionsMap} } = useAppContext();

  return (
    <div>
      {messages.map(message => {
        const { id, text, username, timestamp } = message;

        return (
          <div key={id}>
            <h4>{new Date(timestamp).toLocaleString()}</h4>
            <p>{text}</p>
            <h4>- { username }</h4>
            <CreateReaction messageId={id} />
            <MessageReactions messageReactions={reactionsMap[id]}/>
            <hr />
          </div>
        );
      })}
    </div>
  );
};