import React, {Component} from 'react';
import channelsInfo from '../../config/channels.json';

class Header extends Component {
  render() {

    const channels = Object.entries(this.props.channels).filter(c => c[1] != null).map(c => c[0]);

    return (<header className="event-channels">
      <span className="channels">
        {
          Object.keys(channels).map(c => <i key={channelsInfo[c]["class"]} className={channelsInfo[c]["icon"]} data-filter={channelsInfo[c]["class"]} title={channelsInfo[c]["title"]}>
            <span className="hidden">{channelsInfo[c]["name"]}</span>
          </i>)
        }
        {
          this.props.otherChannels !== "" &&
              <i className="icon nc-icon-mini ui-2_menu-dots" title={this.props.otherChannels}>
                <span className="hidden">{this.props.otherChannels}</span>
              </i>
        }

      </span>
    </header>)
  }
}

export default Header;
