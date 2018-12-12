import React, {Component} from 'react';
import {Tooltip} from 'react-tippy';

import Header from './Header';
import Brands from './Brands';
import Dates from './Dates';
import Timelines from './Timelines';

import {isMultidate, getExtreme, today} from '../../helpers/dates';
import {isValid} from '../../helpers/misc';

import {_COLORS} from '../../config/constants';

// import regionInfo from '../../config/regions.json';
// import offerInfo from '../../config/offers.json';

class Event extends Component {

  handleOpenModal = (targetId) => {
    !this.props.elevated && this.props.handleOpenModal(targetId);
  };

  keepEdits = (e) => {
    this.props.event['campaignName'] = this.editedCampaignName.value;
    this.props.event['description'] = this.editedDescription.value;
  }

  render() {

    const event = this.props.event;
    const regionColor = this.props.event['region'][0].color;
    const offerColor = this.props.event['offer'][0].color;
    const time = this.props.time;
    const multidate = isMultidate(event.dates);
    const isPastEvent = event.latestDay < getExtreme([today()],'right');
    const eventClassName = `event${multidate ? ' MULTIDATE' : ''}${this.props.isModal ? ' grid-view' : ''}${isPastEvent ? ' PAST-EVENT' : ''}`;
    // console.log(regionColor);

    const isHighLighted = () => this.props.modalEventId === event.id;
    const HighLightedStyle = {boxShadow: '0 0 1px 5px rgba(160,160,160, 0.75)'};

    return (
      <div className={eventClassName} onClick={() => {
        this.handleOpenModal(event['id']);}}
        style={isHighLighted() ? HighLightedStyle : {}}
      >
        <div className='event-inner'>
        {
          this.props.view === 'grid' &&
          <Header channels={event.channels} otherChannels={event.otherChannels} color={regionColor} />
        }
        <div className={`event-info`}>
        {
          this.props.view === 'grid' &&
          <Dates dates={event.dates} editable={this.props.editable} />
        }
          <div className='info-wrapper'>
            <div className='activity'>
              <Tooltip title={event.offer[0].name} trigger="mouseenter" delay={0} arrow={true} distance={10} theme="light" size="big" html={( <span><span className='label-dot' style={{backgroundColor: offerColor}}/> {event.offer[0].name}</span> )} >
                <span className='label-dot' style={{backgroundColor: offerColor}}/>
              </Tooltip>
              {
                this.props.editable 
                ? <span><textarea rows={1} className="editable-field" ref={(input) => this.editedCampaignName = input} defaultValue={event.campaignName} onChange={(e) => this.keepEdits(e)} /></span>
                : <span>{event.campaignName}</span>
              }
            </div>
          {
            this.props.view === 'grid' &&
            <p className='market'>{event.market}</p>
          }       
          {
            this.props.view === 'grid' &&
            <p className='tags'>
              {
                    [{ name: "Segment", val: event.segment }, { name: "Group", val: event.campaignGroup }, { name: "Program Type", val: event.programType }, { name: "Market Scope", val: event.marketScope }].map((e, i)=> isValid(e.val) ?
                  <span key={i} className='tag'>
                    <span style={{color: _COLORS.LIGHTERGRAY }}>{e.name}: </span> {e.val}
                  </span>
                : null
                )
              }
            </p>
          }
          {
            this.props.elevated && this.props.view === 'grid' &&
            <div>
            {
              this.props.editable 
              ? <p className='description'> <textarea rows={4} ref={(input) => this.editedDescription = input} className="editable-field" defaultValue={event.description} onChange={(e) => this.keepEdits(e)} /> </p>
              : <p className='description'> {event.description} </p>
            }
            </div>
          }
          </div>
        {
          this.props.view === 'grid' &&
          <i className='more'/>
        }
        </div>

      {
        this.props.elevated && this.props.view === 'grid' &&
        <div className='tabs'>
          <div className={`tab-content t1 ${this.props.elevated
              ? ' active'
              : ''}`}>
            <p className='contact ' title={event.owner.name}><i className='nc-icon-mini users_circle-09' style={{color: regionColor}}/> {event.owner.name}</p>
              <Brands brands={event.brands} brandsInfo={this.props.brandsInfo} />
          </div>
        </div>
      }

      </div>

    {
      this.props.view === 'timeline' &&
      <Timelines dates={event.dates} color={regionColor} Y={time.Y} datesType={event.datesType} time={this.props.time} />
    }

    </div>)
  }
}

export default Event;
