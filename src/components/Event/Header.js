import React, {Component} from 'react';
import {Tooltip} from 'react-tippy';

import channelsInfo from '../../config/channels.json';

class Header extends Component {
  render() {

    const putColor = color => color ? {backgroundColor: color}: {};
    const channels = this.props.channels;

    return (
      <header className="event-channels" style={putColor(this.props.color)}>
        <span className="channels">

        {channels.map(c => c !== "OTHER_CHANNELS" &&
          <Tooltip key={c}
            title={channelsInfo[c]["name"]}
            // trigger="click"
            trigger="mouseenter"
            delay={200}
            arrow={true}
            distance={10}
            theme="light"
            size="big"
          >
            <i  className={ channelsInfo[c]["icon"] }/>
          </Tooltip>
        )}

          {this.props.otherChannels !== "" && <i className="icon nc-icon-mini ui-2_menu-dots" title={this.props.otherChannels}/>}
        </span>
      </header>)
  }
}

export default Header;
