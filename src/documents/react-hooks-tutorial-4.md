# section 6

## the reducer pattern overview

* store - collects the state of the entire react app.
* reducers - describe sections of the store and it should be updated. composes overall store.
* action - objects full of data for the store.

----

* reducer listens for certain actions.
* who is dispatching action objects? - components. it needs dispatch functions.
* reducer pattern means unidirectional flow of the data.

## use reducer for tasks 1

* you could refactor Tasks component to use useReducer.

```javascript
const [state, dispatch] = useReducer(tasksReducer, initialTasksState);
console.log('state : ', state);
```

* if we don't put initial state, the state object is undefined.

-------

* just dispatch empty action object and check the action hits reducer.

## use reducer for tasks 2

* make types for actions.
* refactor other functionality either.


```javascript
const initialTasksState = {
  tasks : [],
  completedTasks : []
}

const TYPES = {
  ADD_TASK : 'ADD_TASK',
  COMPLETE_TASK : 'COMPLETE_TASK',
  DELETE_TASK : 'DELETE_TASK',
};

const tasksReducer = (state, action) => {
  switch (action.type) {
    case TYPES.ADD_TASK:
      return {
        ...state,
        tasks : [...state.tasks, action.task]
      };
    case TYPES.COMPLETE_TASK:
      const { completedTask } = action;

      return {
        ...state,
        completedTasks : [...state.completedTasks, action.completedTask],
        tasks : state.tasks.filter(task => task.id !== completedTask.id)
      };
    case TYPES.DELETE_TASK:
      return {
        ...state,
        completedTasks : state.completedTasks.filter(task => task.id !== action.id)
      }
    default:
      return state;
  };
};

```

