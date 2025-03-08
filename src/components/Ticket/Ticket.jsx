import React from 'react';
import './Ticket.scss';
import { intervalToDuration, format, addMinutes } from 'date-fns';

const Ticket = ({ price, carrier, outboundTicket, returnTicket }) => {
  const formatTransfers = (stops) => {
    if (!stops || stops.length === 0) return 'Без пересадок';
    if (stops.length === 1) return '1 пересадка';
    return `${stops.length} пересадки`;
  };

  const formatDuration = (totalMins) => {
    const duration = intervalToDuration({ start: 0, end: totalMins * 60000 });
    let result = '';

    if (duration.days && duration.days > 0) {
      result += `${duration.days}д `;
    }
    if (duration.hours && duration.hours > 0) {
      result += `${duration.hours}ч `;
    }
    if (duration.minutes && duration.minutes > 0) {
      result += `${duration.minutes}м`;
    }
    return result;
  };

  const formatTimeFlight = (departureDate, flightDuration) => {
    const departure = new Date(departureDate);
    const departureTime = format(departure, 'HH:mm');
    const arrivalDate = addMinutes(departure, flightDuration);
    const arrivalTime = format(arrivalDate, 'HH:mm');
    return `${departureTime} - ${arrivalTime}`;
  };

  const logoUrl = `http://pics.avs.io/110/36/${carrier}.png`;

  return (
    <div className="ticket">
      <div className="ticket__header">
        <p className="ticket__price">{price} Р</p>
        <img
          src={logoUrl}
          alt={`${carrier} Airlines`}
          className="ticket__logo"
          loading="lazy"
        />
      </div>
      <ul className="ticket__info">
        <li className="ticket__info-item">
          <p className="ticket__info-title">
            {outboundTicket.origin} – {outboundTicket.destination}
          </p>
          <p className="ticket__info-value">
            {formatTimeFlight(outboundTicket.date, outboundTicket.duration)}
          </p>
        </li>
        <li className="ticket__info-item">
          <p className="ticket__info-title">В пути</p>
          <p className="ticket__info-value">
            {formatDuration(outboundTicket.duration)}
          </p>
        </li>
        <li className="ticket__info-item">
          <p className="ticket__info-title">
            {formatTransfers(outboundTicket.stops)}
          </p>
          <p className="ticket__info-value">
            {outboundTicket.stops.length > 0
              ? outboundTicket.stops.join(', ')
              : '—'}
          </p>
        </li>
        <li className="ticket__info-item">
          <p className="ticket__info-title">
            {returnTicket.origin} – {returnTicket.destination}
          </p>
          <p className="ticket__info-value">
            {formatTimeFlight(returnTicket.date, returnTicket.duration)}
          </p>
        </li>
        <li className="ticket__info-item">
          <p className="ticket__info-title">В пути</p>
          <p className="ticket__info-value">
            {formatDuration(returnTicket.duration)}
          </p>
        </li>
        <li className="ticket__info-item">
          <p className="ticket__info-title">
            {formatTransfers(returnTicket.stops)}
          </p>
          <p className="ticket__info-value">
            {returnTicket.stops.length > 0
              ? returnTicket.stops.join(', ')
              : '—'}
          </p>
        </li>
      </ul>
    </div>
  );
};

export default React.memo(Ticket);
