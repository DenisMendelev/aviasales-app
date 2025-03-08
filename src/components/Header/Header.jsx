import React from 'react';
import './Header.scss';
import Logo from '../../assets/Logo.svg';

const Header = () => {
  return (
    <header className="header">
      <img src={Logo} alt="Aviasales Logo" />
    </header>
  );
};

export default Header;
