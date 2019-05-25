import React from 'react'

const MessageReactions = ({ messageReactions}) => {
  if (!messageReactions) return null;

  return messageReactions.map((reaction, idx) => {
    const { id, emoji, username } = reaction;

    return (
      <span key={id}>
        <em>{username} :</em>
        {emoji}{idx === messageReactions.length - 1 ? '' : ','}
      </span>
    )
  })
};

export default MessageReactions;