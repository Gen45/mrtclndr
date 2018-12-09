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
        <a className="addEntry" onClick={this.props.addEntry}>
          <i className="nc-icon-mini ui-1_bold-add" /> 
          <span>
            Add Entry
          </span>
        </a>        
        <a className="logout" onClick={this.props.logout}>
          <i className="nc-icon-outline media-1_button-power" /> 
          <span>
            Log Out
          </span>
        </a>
      </header>
    )
  }
}

export default Header;
