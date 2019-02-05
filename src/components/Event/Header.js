import React, {Component} from 'react';
import {Tooltip} from 'react-tippy';
import find from 'lodash/find';
import TextareaAutosize from 'react-autosize-textarea';

import { removeSearched } from '../../helpers/misc';

class Header extends Component {

  toggleChannel = (id, event) => {
    const index = event.channels.indexOf(id);
    if (index > -1) {
      event.channels.splice(index, 1);
    } else {
      event.channels.push(id);
    }
    this.setState({change: true});
  }
  
  handleOtherChannels = (value, field) =>  { 
    this.props.keepEdits([...new Set([...this.props.channels, find(this.props.channelsInfo, x => x.slug === "other-channels").id])],'channels');
    this.props.keepEdits(value, field);
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
            <div style={{ display: 'block', width: '100%', margin: '10px 0', textAlign: 'center', color: '#FFFFFF' }}> Click on a Channel name to Select it </div>
          }
          {
            this.props.editingChannels &&
            Object.keys(this.props.channelsInfo).filter(c => this.props.channelsInfo[c].slug !== 'no-channel' && this.props.channelsInfo[c].slug !== 'other-channels').map((c, i) => 
              <span key={i} className={`channel editable-field${channels.indexOf(this.props.channelsInfo[c].id) > -1 ? ' selected' : ''}`} onClick={() => this.toggleChannel(this.props.channelsInfo[c].id, this.props.event)}>
                <i className={`${this.props.channelsInfo[this.props.channelsInfo[c].id]["icon"]}`} /> {this.props.channelsInfo[this.props.channelsInfo[c].id]["name"]} 
              </span>)
          }
          {
            this.props.editingChannels &&
            <div style={{ display: 'block', width: '100%', margin: '10px 0', textAlign: 'center', color: '#FFFFFF' }}> Other Channels: </div>
          }
          {
            this.props.editingChannels &&
            <TextareaAutosize style={{ width: '90%' }} className="other-channels editable-field" placeholder="Click here to type 'Other Channels'" defaultValue={removeSearched(this.props.otherChannels)} onChange={(e) => this.handleOtherChannels(e.target.value, 'otherChannels')} />
          }
          {
            !this.props.editingChannels &&
            channels.map(c => (this.props.channelsInfo[c].slug !== "other-channels") && (this.props.channelsInfo[c].slug !== "no-channel") && c !== null &&
              withTooltip(this.props.channelsInfo[c]["name"], <span className="channel"><i className={`channel-icon ${this.props.channelsInfo[c]["icon"]}`} />{false && this.props.editable && this.props.channelsInfo[c]["name"]} </span>, this.props.channelsInfo[c].slug))
          }
          {
            !this.props.editingChannels &&
            this.props.otherChannels !== undefined && this.props.otherChannels !== "" && withTooltip(this.props.otherChannels, <i className="icon nc-icon-mini ui-2_menu-dots" /> )
          }
          {
            !this.props.editingChannels &&
            <div style={{flexGrow: 1, textAlign: 'right', padding: '0 10px'}}>  </div>
          }
          {
            this.props.editable && !this.props.editingChannels &&
            <span className="edit-channels" onClick={() => { this.props.editChannels(true) }}><i className="nc-icon-mini ui-1_pencil"></i> Edit Channels</span>
          }
          {
            this.props.editingChannels &&
            <div style={{display: 'block', width: '100%', margin: '10px 0', textAlign: 'center', color: '#FFFFFF'}}>  </div>
          }
          {
            this.props.starred && !this.props.isModal &&
            <span><i className="nc-icon-mini ui-2_favourite-31" style={{ color: '#ddaa33'}} /></span>
          }
        </span>

        
      </header>
    )
  }
}

export default Header;
