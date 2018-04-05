import React, {Component} from 'react';
import channelsInfo from '../../config/channels.json';

class Header extends Component {
  render() {

    const channels = Object.entries(this.props.channels).filter(c => c[1] != null).map(c => c[0]);

    return (
      <header className="event-channels">
        <span className="channels">
          {Object.keys(channels).map(c => <i key={channelsInfo[c]["key"]} className={channelsInfo[c]["icon"]} title={channelsInfo[c]["name"]}/>)}

          {this.props.otherChannels !== "" && <i className="icon nc-icon-mini ui-2_menu-dots" title={this.props.otherChannels}/>}
        </span>
      </header>)
  }
}

export default Header;
