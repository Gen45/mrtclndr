import React, {Component} from 'react';

import {_LOGO} from '../../config/constants';

class Header extends Component {

  render() {

    return (
      <header className="header" role="banner">
        <div className="logo">
          <img src={_LOGO.URL} alt={_LOGO.ALT}/>
        </div>
        <h1 className="title">Calendar</h1>
        <a className="logout" onClick={this.props.logout}>
          {/* <i className="nc-icon-outline arrows-2_circle-out" />  */}
          Log Out
        </a>
      </header>
    )
  }
}

export default Header;
