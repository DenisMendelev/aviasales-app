import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import apiReducer from './apiSlice';
import ticketReducer from './ticketsSlice';

const rootReducer = combineReducers({
  tickets: apiReducer,
  filter: ticketReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
