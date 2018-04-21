import React, {Component} from 'react';

import Header from './Header';
import Brands from './Brands';
import Dates from './Dates';
import Timelines from './Timelines';

import {isMultidate, getExtreme, today} from '../../helpers/dates';
import {isValid} from '../../helpers/misc';

import {_COLORS} from '../../config/constants';

import regionInfo from '../../config/regions.json';
import offerInfo from '../../config/offers.json';

class Event extends Component {


  handleOpenModal = (targetId) => {
    !this.props.elevated && this.props.handleOpenModal(targetId);
  };

  render() {

    const event = this.props.event;
    const regionColor = regionInfo[this.props.event['region']].color;
    const offerColor = offerInfo[this.props.event['offer']].color;
    const time = this.props.time;
    const multidate = isMultidate(event.dates);
    const isPastEvent = event.latestDay < getExtreme([today()],'right');
    const eventClassName = `event${multidate ? ' MULTIDATE' : ''}${this.props.modal ? ' grid-view' : ''}${isPastEvent ? ' PAST-EVENT' : ''}`;
    // console.log(regionColor);

    const isHighLighted = () => this.props.modalEventId === event.id;
    const HighLightedStyle = {boxShadow: '0 0 1px 5px rgba(160,160,160, 0.75)'};

    return (<div id={event.id} className={eventClassName} onClick={() => {
        this.handleOpenModal(event['id']);}}
        style={isHighLighted() ? HighLightedStyle : {}}
        >
      <div className='event-inner'>
        <Header channels={event.channels} otherChannels={event.otherChannels} color={regionColor} />

        <div className={`event-info`}>
          <Dates dates={event.dates}/>

          <div className='info-wrapper'>
            <p className='activity'>
              <span className='label-dot' title={event.offer} style={{backgroundColor: offerColor}}/>{event.campaignName}
            </p>
            <p className='timeframe'>{event.market}</p>
            <p className='tags'>
              {
                [{name:"Segment",val:event.segment},{name:"Group",val:event.campaignGroup},{name:"Program Type",val:event.programType},{name:"Ongoing",val:event.ongoing}].map((e, i)=> isValid(e.val) ?
                  <span key={i} className='tag'>
                    <span style={{color: _COLORS.LIGHTERGRAY }}>{e.name}: </span> {e.val}
                  </span>
                : null
                )
              }
            </p>
            {
              this.props.elevated &&
              <p className='description'>
                {event.description}
              </p>
            }
          </div>
          <i className='more'/>
        </div>

        <div className='tabs'>
          <div className={`tab-content t1 ${this.props.elevated
              ? ' active'
              : ''}`}>
            <p className='contact ' title={event.owner.name}><i className='nc-icon-mini users_circle-09'/> {event.owner.name}</p>
            <Brands brands={event.brands}/>
          </div>
        </div>

      </div>

      <Timelines dates={event.dates} color={regionColor} Y={time.Y} datesType={event.datesType} time={this.props.time} />

    </div>)
  }
}

export default Event;
