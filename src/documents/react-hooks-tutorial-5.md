# react hooks tutorial 5

## setup reaction app

* `npx create-react-app reaction-app-starter`

* add css from original reaction app.

## reactions reducer state

* setup reducer system.
* `state/reducer.js`
* `state/types.js`
* `state/actions.js`

## publish message component

* create `components/`

* create PublishMessage.

* if we want to use dispatch method? - send by props to PublishMessage from App. 

* This is why you need to use useContext together.

## MessageBoard component

## useContext and a custom context hook

* utilize context api.

* this context will include dispatch function, making it possible to share dispatch function without sending it through props.

```javascript
// context.js
import { createContext } from 'react';
export default createContext();

// App.js
import Context from '../context';
return (
<Context.Provider value={{ state, dispatch }}>
      <div>
        <h2>Reaction</h2>
        <PublishMessage dispatch={dispatch} />
        <hr />
        <MessageBoard />
      </div>
    </Context.Provider>
 )

// MessageBoard.js
import React, { useContext } from 'react';
import Context from '../context';

export default () => {
  const { state, dispatch } = useContext(Context);

  const messages = state.messages;

  return (
    <div>
      {messages.map(message => {
        const { id, text, timestamp } = message;
        return (
          <div key={id}>
            <h4>{new Date(timestamp).toLocaleString()}</h4>
            <p>{text}</p>
            <hr />
          </div>
        );
      })}
    </div>
  );
};
```

-------

* make custom hook.

```javascript
import { useContext } from 'react';
import Context from '../context';

export const useAppContext = () => {
  return useContext(Context);
};
```

* we can use hooks to integrate functionality that is shared by multiple components.

## the pubsub and reducer architecture

* publish/subscribe - a way to share messages across multiple nodes in the network.

* the publisher publishes something to main channel, and the subscriber just listens to what it wants.

* as soon as the message appears in channel, the subscriber listens.

* reducers are listening to action objects.

* components are publishing the action objects.

-----

* if there are multiple applications, publisher publishes actions through global channel, and each subscriber listens to the channel for the certain actions.

* then, the subscriber dispatches actions for the local underlined reducers to subscribe.

### pub sub with the reducer flow

1. create an action object.
2. publish the action object to a channel.
3. app subscribers pick up the published action.
4. each subscriber dispatches the action to the local store.
5. the local reducer system picks up the data and updates.

## explore PubNub

* [pubnub platform](https://www.pubnub.com/)
* this manages channels for the application.

-----

* create an account.
* create Reaction project and get publish key, subscribe key.

* install pubnub module - `npm i pubnub`

```javascript
// pubsub.js
import PubNub from 'pubnub';
import pubnubConfig from './pubnub.config';

const pubnub = new PubNub(pubnubConfig);
export const MESSAGE_CHANNEL = 'MESSAGE_CHANNEL';

pubnub.subscribe({ channels : [ MESSAGE_CHANNEL ] });

pubnub.addListener({
  message : messageObject => {
    console.log('messageObject', messageObject);
  },
});

pubnub.publish({
  message : 'foo',
  channel : MESSAGE_CHANNEL 
})
```

* initial messages to certain channel creates that channel if does not exists.

* can't really guarantee the order of it.

* `addListener()` should first be called before you publish something, since both are asynchronous actions. - add set timeout.

```javascript
setTimeout(() => {
  pubnub.publish({
    message: "foo",
    channel: MESSAGE_CHANNEL
  });
}, 1500);
```

* import pubsub in `App.js`
* multiple app instances can get messages from pubnub.

## pubsub function and reducer connection

* make a connection between pubsub and reducers.
* put pubsub in the context, so everybody can share it.

```javascript
// App.js
const pubsub = new PubSub();

setTimeout(() => {
  pubsub.publish({ type : 'fooo', value : 'bar' });
}, 1500);

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
        <PublishMessage />
        <hr />
        <MessageBoard />
      </div>
    </Context.Provider>
  );
}

export default App;
```

## set username

* allow user to set username.
* create `SetUsername.js`

* username should be inside store.

```javascript
// reducer.js
import { NEW_MESSAGE, SET_USERNAME } from './types';

export const initialState = { messages : [], username : 'anonymous' };

const reducer = (state, action) => {
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
```

* now, you can put username in the message.
* can display username in message board.

## create reaction component

* support emoji.

* first, just show every emoji.

```jsx
const CreateReaction = () => {
  
  return (
    <div className='CreateReaction'>
      {
        REACTION_OBJECTS.map(REACTION_OBJECT => {
          const { type, emoji } = REACTION_OBJECT;

          return (
            <span key={type}>{emoji}</span>
          )
        })
      }
    </div>
  )
};
```

## reactions reducer flow

* make action creator for emoji.
* and apply it in the reducer.

```javascript
// reducer.js
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
```

* this means that for each message, they have multiple reactions.

## publish reactions

* publish reactions to channel.

```jsx
const CreateReaction = ({ id }) => {
  const { state : { username }, pubsub: { publish } } = useAppContext();

  const publishReaction = ({ type, emoji }) => {
    publish(createReaction({ type, emoji, username, id }));
  };
  
  return (
    <div className='CreateReaction'>
      {
        REACTION_OBJECTS.map(REACTION_OBJECT => {
          const { type, emoji } = REACTION_OBJECT;

          return (
            <span key={type} onClick={() => publishReaction({ type, emoji })}>{emoji}</span>
          )
        })
      }
    </div>
  )
};

export default CreateReaction;
```

## message reactions component

* finally, we create message reactions component to show reactions for that message.

```jsx
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
```















































































