import React, {Component} from 'react';
import {Tooltip} from 'react-tippy';

// import channelsInfo from '../../config/channels.json';

class Header extends Component {
  render() {

    const putColor = color => color ? {backgroundColor: color}: {};
    const channels = this.props.channels;

    const withTooltip = (title, content, key) => (
      <Tooltip key={key}
        title={title}
        trigger="mouseenter"
        delay={200}
        arrow={true}
        distance={10}
        theme="light"
        size="big"
      >
        {content}
      </Tooltip>
    )

    return (
      <header className="event-channels" style={putColor(this.props.color)}>
        <span className="channels">
          {channels.map(c => (c !== "OTHER_CHANNELS" && c.slug !== "other-channels" ) &&
          withTooltip(c["name"], <i className={ c["icon"] }/>, c.slug)
        )}
          {this.props.otherChannels !== "" && withTooltip(this.props.otherChannels, <i className="icon nc-icon-mini ui-2_menu-dots" /> )}

          <div style={{flexGrow: 1, textAlign: 'right', padding: '0 10px'}}>  </div>
        </span>
        
      </header>)
  }
}

export default Header;
