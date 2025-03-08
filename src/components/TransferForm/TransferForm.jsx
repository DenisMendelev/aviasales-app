import {} from 'react';
import './TransferForm.scss';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTransfer } from '../../store/ticketsSlice';

const TransferForm = () => {
  const dispatch = useDispatch();
  const selectedTransfers = useSelector(
    (state) => state.filter.selectedTransfers
  );

  const transferOptions = [
    { label: 'Все', value: -1 },
    { label: 'Без пересадок', value: 0 },
    { label: '1 пересадка', value: 1 },
    { label: '2 пересадки', value: 2 },
    { label: '3 пересадки', value: 3 },
  ];

  return (
    <div className="transfer-form">
      <div className="transfer-form__title">Количество пересадок</div>
      <ul className="transfer-form__list">
        {transferOptions.map((option) => (
          <li key={option.value} className="transfer-form__item">
            <input
              type="checkbox"
              id={`transfer-${option.value}`}
              checked={
                option.value === -1
                  ? selectedTransfers.length === 4
                  : selectedTransfers.includes(option.value)
              }
              onChange={() => dispatch(toggleTransfer(option.value))}
            />
            <label htmlFor={`transfer-${option.value}`}>{option.label}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransferForm;
