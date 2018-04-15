import React, {Component} from 'react';
import channelsInfo from '../../config/channels.json';

class Header extends Component {
  render() {

    const putColor = color => color ? {backgroundColor: color}: {};
    const channels = this.props.channels;

    return (
      <header className="event-channels" style={putColor(this.props.color)}>
        <span className="channels">

          {channels.map(c => c !== "OTHER_CHANNELS" && <i key={c}
            className={ channelsInfo[c]["icon"] }
            title={channelsInfo[c]["name"]}
          />)}

          {this.props.otherChannels !== "" && <i className="icon nc-icon-mini ui-2_menu-dots" title={this.props.otherChannels}/>}
        </span>
      </header>)
  }
}

export default Header;
