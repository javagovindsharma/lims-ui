// actions/types.ts

import { INCREMENT_COUNTER, DECREMENT_COUNTER } from './actionTypes'; // Adjust the path accordingly

interface IncrementCounterAction {
  type: typeof INCREMENT_COUNTER;
}

interface DecrementCounterAction {
  type: typeof DECREMENT_COUNTER;
}

export type CounterAction = IncrementCounterAction | DecrementCounterAction;
