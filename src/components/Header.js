import React, {Component} from 'react';

class Header extends Component {

  state = {
    fullscreen: false
  }

  handleRequestFullscreen = () => {

    const i = document.getElementById('root');
    // go full-screen
    if (i.requestFullscreen) {
      i.requestFullscreen();
    } else if (i.webkitRequestFullscreen) {
      i.webkitRequestFullscreen();
    } else if (i.mozRequestFullScreen) {
      i.mozRequestFullScreen();
    } else if (i.msRequestFullscreen) {
      i.msRequestFullscreen();
    }

    this.setState({fullscreen: true});
  };

  handleCancelFullscreen = () => {
    // exit full-screen
    if (document.exitFullscreen) {
    	document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
    	document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
    	document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
    	document.msExitFullscreen();
    }
    this.setState({fullscreen: false});
  };

  render() {

    const fullscreenButtonOffset = this.props.collapsed ? 50 : 10;

    return (<header className="header" role="banner">
      <div className="logo">
        <img src="images/logo.svg" alt="Marriott Logo"/>
      </div>
      <h1 className="title">Calendar</h1>
      <a onClick={(e) => { this.handleRequestFullscreen()}}
        style={{height: 50, width: 50, lineHeight: '50px', verticalAlign: 'middle', position: 'absolute', right: fullscreenButtonOffset, top: 0, textAlign: 'center', cursor: 'pointer' }}>
        <i className="nc-icon-outline arrows-1_fullscreen-77"/>
      </a>
    </header>)
  }
}

export default Header;
