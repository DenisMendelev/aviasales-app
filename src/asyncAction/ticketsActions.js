import {
  setSearchId,
  setTickets,
  setLoading,
  setError,
} from '../store/ticketsSlice';

export const fetchSearchId = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetch(
      'https://aviasales-test-api.kata.academy/search'
    );
    const data = await response.json();
    dispatch(setSearchId(data.searchId));
  } catch (error) {
    dispatch(setError('Ошибка при получении searchId'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchTickets = (searchId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetch(
      `https://aviasales-test-api.kata.academy/tickets?searchId=${searchId}`
    );
    if (!response.ok) {
      throw new Error('Ошибка при загрузке билетов');
    }
    const data = await response.json();
    dispatch(setTickets(data.tickets));
    return data.stop; // Возвращаем stop, чтобы знать, когда прекратить
  } catch (error) {
    dispatch(setError('Ошибка при получении билетов'));
    return false; // Возвращаем false в случае ошибки
  } finally {
    dispatch(setLoading(false));
  }
};
