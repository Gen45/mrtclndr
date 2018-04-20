import React, {Component} from 'react';

import {isMultidate, getExtreme, today} from '../../helpers/dates';

import Header from './Header';
import Brands from './Brands';
import Dates from './Dates';
import Timelines from './Timelines';

import regionInfo from '../../config/regions.json';
import offerInfo from '../../config/offers.json';

class Event extends Component {

  getEventClassName = (view, region, dates, elevated, modal, multidate, latestDay) =>
  `event${multidate ? ' MULTIDATE' : ''}${elevated ? ' elevated' : ''}${modal ? ' modal-event grid-view' : ''}${ latestDay < getExtreme([today()],'right') ? ' PAST-EVENT' : ''}`;

  handleOpenModal = (id) => {
    !this.props.elevated && this.props.handleOpenModal(id);
  };

  render() {

    const view = this.props.view;
    const event = this.props.event;
    const regionColor = regionInfo[this.props.event['region']].color;
    const offerColor = offerInfo[this.props.event['offer']].color;
    const time = this.props.time;
    const multidate = isMultidate(event.dates);

    // console.log(regionColor);

    const isHighLighted = () => this.props.modalEventId === event.id;
    const HighLightedStyle = {boxShadow: '0 0 1px 5px rgba(160,160,160, 0.75)'};

    return (<div id={event.id} className={this.getEventClassName(view, event.region, event.dates, this.props.elevated, this.props.modal, multidate, event.latestDay)} onClick={() => {
        this.handleOpenModal(event['id']);}}
        style={isHighLighted() ? HighLightedStyle : {}}
        >

      <div className='close-button' onClick={() => {
          this.props.handleCloseModal();
        }}/>

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
              <span className='tag'>
                {/* <i className='nc-icon-mini business_globe'/>{' '} */}
                {event.campaignGroup}</span>{' '}
              <span className='tag'>
                {event.segment}
              </span>{' '}
              {
                event.programType && <span className='tag partner-type '>
                  {/* <i className='nc-icon-mini business_briefcase-25'/>{' '} */}
                    {event.programType}</span>
              }
            </p>
          </div>
          <i className='more'/>
        </div>

        <div className='tabs'>
          <div className={`tab-content t1 ${this.props.elevated
              ? ' active'
              : ''}`}>
            <p className='description'>
              {event.description}
            </p>
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
