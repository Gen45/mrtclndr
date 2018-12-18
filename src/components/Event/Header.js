import React, {Component} from 'react';
import {Tooltip} from 'react-tippy';

// import channelsInfo from '../../config/channels.json';

class Header extends Component {

  removeChannel = (id, event) => {
    const index = event.channels.indexOf(id);
    // console.log(event.channels);
    if (index > -1) {
      event.channels.splice(index, 1);
    } else {
      event.channels.push(id);
    }
    // console.log(event.channels);
    this.setState({change: true});
  }

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

        <span className={`channels${this.props.editingChannels? ' editable': ''}`} >
          {
            this.props.editingChannels &&
            <div style={{display: 'block', width: '100%', margin: '10px 0', textAlign:'center', color: '#FFFFFF'}}> Unassigned Channels </div>
          }
          {
            this.props.editingChannels &&
            Object.keys(this.props.channelsInfo).filter((c) => channels.indexOf(this.props.channelsInfo[c].id) < 0).map((c, i) => 
              <span key={i} className="channel editable-field" onClick={() => this.removeChannel(this.props.channelsInfo[c].id, this.props.event)}><i className={`${this.props.channelsInfo[this.props.channelsInfo[c].id]["icon"]}`} /> {this.props.channelsInfo[this.props.channelsInfo[c].id]["name"]} </span>)
          }
          {
            this.props.editingChannels &&
            <div style={{display: 'block', width: '100%', margin: '10px 0', textAlign:'center', color: '#FFFFFF'}}> Assigned Channels </div>
          }          
          {
            this.props.editingChannels &&
            channels.map((c, i) => (this.props.channelsInfo[c].slug !== "other-channels" ) &&
              <span key={i} className="channel editable-field" onClick={() => this.removeChannel(c, this.props.event)}><i className={`${this.props.channelsInfo[c]["icon"]}`} /> {this.props.channelsInfo[c]["name"]} </span>
          )}
          {
            !this.props.editingChannels &&
            channels.map(c => (this.props.channelsInfo[c].slug !== "other-channels") && c !== null &&
            withTooltip(this.props.channelsInfo[c]["name"], <i className={ this.props.channelsInfo[c]["icon"] }/>, this.props.channelsInfo[c].slug)
          )}
          {this.props.otherChannels !== "" && withTooltip(this.props.otherChannels, <i className="icon nc-icon-mini ui-2_menu-dots" /> )}
          {
            this.props.editable && !this.props.editingChannels &&
            <i className="nc-icon-mini ui-1_pencil edit-channels" onClick={() => { this.props.editChannels(true) }}></i> 
          }
          {
          !this.props.editingChannels &&
          <div style={{flexGrow: 1, textAlign: 'right', padding: '0 10px'}}>  </div>
          }
          {
            this.props.editingChannels &&
            <div style={{display: 'block', width: '100%', margin: '10px 0', textAlign:'center', color: '#FFFFFF'}}>  </div>
          }
        </span>

        
      </header>
    )
  }
}

export default Header;
