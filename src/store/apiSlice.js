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

      state.tickets.push(...uniqueTickets);
      saveTicketsToStorage(state.tickets);
    },
    setSearchId: (state, action) => {
      state.searchId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearTickets: (state) => {
      state.tickets = [];
      localStorage.removeItem('tickets');
    },
  },
});

export const { addTickets, setSearchId, setLoading, clearTickets } =
  apiSlice.actions;

export const fetchSearchId = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get('/search');
    dispatch(setSearchId(response.data.searchId));
    dispatch(clearTickets());
  } catch (error) {
    console.error('Error fetching searchId:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchTickets = (searchId) => async (dispatch) => {
  let stop = false;
  while (!stop) {
    try {
      dispatch(setLoading(true));
      const response = await api.get(`/tickets?searchId=${searchId}`);
      dispatch(addTickets(response.data.tickets));
      stop = response.data.stop;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      dispatch(setLoading(false));
    }
  }
};

export default apiSlice.reducer;
