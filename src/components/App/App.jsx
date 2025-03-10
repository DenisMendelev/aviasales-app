import { useEffect } from 'react';
import './App.scss';
import MyButton from '../UI/MyButton/MyButton';
import TransferForm from '../TransferForm/TransferForm';
import Header from '../Header/Header';
import TicketsList from '../TicketsList/TicketsList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchId, fetchTickets } from '../../store/apiSlice';
import { setSorter } from '../../store/ticketsSlice';
import Lottie from 'react-lottie';
import planeLoader from '../../assets/FlyingPlaneLoader.json';
import { selectSortedTickets } from '../../store/ticketsSlice';

function App() {
  const dispatch = useDispatch();
  const { searchId, loading } = useSelector((state) => state.tickets);
  const selectedSorter = useSelector((state) => state.filter.selectedSorter);
  const sortedTickets = useSelector(selectSortedTickets);

  useEffect(() => {
    dispatch(fetchSearchId());
  }, [dispatch]);

  useEffect(() => {
    if (searchId) {
      dispatch(fetchTickets(searchId));
    }
  }, [searchId, dispatch]);

  const handleSort = (type) => {
    dispatch(setSorter(type));
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: planeLoader,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div>
      <Header />
      <div className="box">
        <div className="box__transfer-form">
          <TransferForm />
        </div>
        <div className="box__buttons">
          <MyButton
            className="sort-buttons"
            text="Самый дешевый"
            style={{
              width: '165px',
              background: selectedSorter === 'cheapest' ? '#2196f3' : '#ffffff',
              color: selectedSorter === 'cheapest' ? '#ffffff' : '#4a4a4a',
              borderRadius: '5px 0 0 5px',
            }}
            onClick={() => handleSort('cheapest')}
          />
          <MyButton
            className="sort-buttons"
            text="Самый быстрый"
            style={{
              width: '165px',
              background: selectedSorter === 'fastest' ? '#2196f3' : '#ffffff',
              color: selectedSorter === 'fastest' ? '#ffffff' : '#4a4a4a',
              borderRadius: '0 0px 0px 0',
            }}
            onClick={() => handleSort('fastest')}
          />
          <MyButton
            className="sort-buttons"
            text="Оптимальный"
            style={{
              width: '165px',
              background: selectedSorter === 'optimal' ? '#2196f3' : '#ffffff',
              color: selectedSorter === 'optimal' ? '#ffffff' : '#4a4a4a',
              borderRadius: '0 5px 5px 0',
            }}
            onClick={() => handleSort('optimal')}
          />
          {loading && sortedTickets.length === 0 ? (
            <div className="loader">
              <Lottie options={lottieOptions} height={200} width={200} />
            </div>
          ) : (
            <TicketsList />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
