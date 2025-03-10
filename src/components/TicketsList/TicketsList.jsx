import React from 'react';
import './TicketsList.scss';
import Ticket from '../Ticket/Ticket';
import MyButton from '../UI/MyButton/MyButton';
import { useSelector, useDispatch } from 'react-redux';
import { selectSortedTickets } from '../../store/ticketsSlice';
import { showMoreTickets } from '../../store/ticketsSlice';
import { fetchTickets } from '../../store/apiSlice';
import noTicketsImg from '../../assets/noTickets.png';

const TicketsList = () => {
  const dispatch = useDispatch();
  const sortedTickets = useSelector(selectSortedTickets);
  const { visibleTickets } = useSelector((state) => state.filter);
  const { loading, searchId } = useSelector((state) => state.tickets);

  const handleShowMore = () => {
    dispatch(showMoreTickets());
    if (sortedTickets.length <= visibleTickets + 5 && searchId) {
      dispatch(fetchTickets(searchId));
    }
  };

  return (
    <div>
      {sortedTickets.length > 0 ? (
        sortedTickets.slice(0, visibleTickets).map((ticket) => {
          const key = `${ticket.carrier}${ticket.segments[0].origin}${ticket.segments[1].date}`;
          return (
            <Ticket
              key={key}
              price={ticket.price}
              carrier={ticket.carrier}
              outboundTicket={ticket.segments[0]}
              returnTicket={ticket.segments[1]}
            />
          );
        })
      ) : (
        <div className="no-tickets">
          <img
            className="no-tickets__img"
            src={noTicketsImg}
            alt="No tickets"
          />
          <div className="no-tickets__text">
            Нет билетов, соответствующих выбранным фильтрам
          </div>
        </div>
      )}
      {sortedTickets.length > 0 && (
        <MyButton
          className="show-more-button"
          style={{ marginTop: '20px', width: '495px' }}
          text={loading ? 'Загрузка...' : 'Показать еще 5 билетов'}
          onClick={handleShowMore}
          disabled={loading && sortedTickets.length === 0}
        />
      )}
    </div>
  );
};

export default TicketsList;
