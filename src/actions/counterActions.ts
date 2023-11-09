// actions/counterActions.ts

import { INCREMENT_COUNTER, DECREMENT_COUNTER } from './actionTypes'; // Adjust the path accordingly
import { CounterAction } from './types';

export const incrementCounter = (): CounterAction => ({
  type: INCREMENT_COUNTER,
});

export const decrementCounter = (): CounterAction => ({
  type: DECREMENT_COUNTER,
});
