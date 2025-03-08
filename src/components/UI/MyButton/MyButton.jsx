import {} from 'react';
import classes from './MyButton.module.scss';

const MyButton = ({ text, style, onClick, disabled }) => {
  return (
    <button
      className={classes.myButton}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default MyButton;
