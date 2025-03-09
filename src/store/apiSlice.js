import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://aviasales-test-api.kata.academy',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

const loadTicketsFromStorage = () => {
  const savedTickets = localStorage.getItem('tickets');
  return savedTickets ? JSON.parse(savedTickets) : [];
};

const saveTicketsToStorage = (tickets) => {
  localStorage.setItem('tickets', JSON.stringify(tickets));
};

const initialState = {
  tickets: loadTicketsFromStorage(),
  loading: false,
  searchId: null,
  isFetchComplete: false,
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    addTickets: (state, action) => {
      const newTickets = action.payload;
      const existingTickets = state.tickets;

      const uniqueTickets = newTickets.filter((newTicket) => {
        return !existingTickets.some((existingTicket) => {
          return (
            newTicket.price === existingTicket.price &&
            newTicket.carrier === existingTicket.carrier &&
            newTicket.segments[0].date === existingTicket.segments[0].date &&
            newTicket.segments[1].date === existingTicket.segments[1].date
          );
        });
      });

      state.tickets = [...state.tickets, ...uniqueTickets];
      saveTicketsToStorage(state.tickets);
    },
    setSearchId: (state, action) => {
      state.searchId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFetchComplete: (state, action) => {
      state.isFetchComplete = action.payload;
    },
    clearTickets: (state) => {
      state.tickets = [];
      state.isFetchComplete = false;
      localStorage.removeItem('tickets');
    },
  },
});

export const {
  addTickets,
  setSearchId,
  setLoading,
  setFetchComplete,
  clearTickets,
} = apiSlice.actions;

export const fetchSearchId = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get('/search');
    dispatch(setSearchId(response.data.searchId));
    dispatch(clearTickets());
  } catch (error) {
    console.warn('Ошибка получения searchId, пытаемся продолжить:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchTickets = (searchId) => async (dispatch, getState) => {
  const state = getState();
  if (state.tickets.isFetchComplete) {
    return;
  }

  let stop = false;
  const maxIterations = 10;
  const maxRetries = 3;

  let iteration = 0;
  let retries = 0;

  while (!stop && iteration < maxIterations) {
    try {
      dispatch(setLoading(true));
      const response = await api.get(`/tickets?searchId=${searchId}`);
      dispatch(addTickets(response.data.tickets));
      stop = response.data.stop;
      if (stop) {
        dispatch(setFetchComplete(true));
      }
      retries = 0;
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        console.error(
          'Не удалось загрузить билеты после нескольких попыток:',
          error
        );
        dispatch(setLoading(false));
        break;
      }
      console.warn('Ошибка загрузки билетов, пытаемся продолжить:', error);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue;
    } finally {
      dispatch(setLoading(false));
    }

    const state = getState();
    const visibleTickets = state.filter.visibleTickets;
    const currentTickets = state.tickets.tickets.length;
    if (currentTickets >= visibleTickets) {
      break;
    }

    iteration++;
  }
};

export default apiSlice.reducer;
