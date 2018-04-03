import React, {Component} from 'react';

import logo from '../config/logo.svg';

class Header extends Component {
  render() {
    return (
      <header className="header" role="banner">
        <div className="logo">
          <img src={logo} alt="Marriott Logo"/>
        </div>
        <h1 className="title">Calendar</h1>
      </header>
    )
  }
}

export default Header;
