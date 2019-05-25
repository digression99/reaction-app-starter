import React from 'react';
import { useAppContext } from '../hooks';
import { setUsername } from '../state/actions';

const SetUsername = () => {
  const { state : { username }, dispatch } = useAppContext();

  const updateUsername = e => {
    dispatch(setUsername(e.target.value));
  };

  return (
    <div>
      <h3>Username</h3>
      <input onChange={updateUsername} value={username} />
    </div>
  )

};

export default SetUsername;
