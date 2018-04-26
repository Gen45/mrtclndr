import React, {Component} from 'react';

class Header extends Component {

  render() {

    const fullscreenButtonOffset = this.props.collapsed ? 120 : 10;

    return (<header className="header" role="banner">
      <div className="logo">
        <img src="images/logo.svg" alt="Marriott Logo"/>
      </div>
      <h1 className="title">Calendar</h1>
      <a onClick={this.props.logout}
        style={{height: 50, width: 50, lineHeight: '50px', verticalAlign: 'middle', position: 'absolute', right: fullscreenButtonOffset, top: 0, textAlign: 'center', cursor: 'pointer' }}>
        <i className="nc-icon-outline arrows-1_log-out"/>
      </a>
    </header>)
  }
}

export default Header;
