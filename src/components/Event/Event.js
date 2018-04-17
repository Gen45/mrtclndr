import React, {Component} from 'react';

import {year, isMultidate} from '../../helpers/dates';

import Header from './Header';
import Brands from './Brands';
import Dates from './Dates';
import Timelines from './Timelines';

import regionInfo from '../../config/regions.json';
import offerInfo from '../../config/offers.json';

class Event extends Component {

  componentDidUpdate() {
    // console.log('event updated');
  }

  // getYearClasses = (dates) => [
  //   year(dates.sell.start),
  //   year(dates.sell.end),
  //   year(dates.stay.start),
  //   year(dates.stay.end)
  // ].filter((value, index, self) => self.indexOf(value) === index).reduce((classes, year) => `${classes} YEAR-${year}`, '');

  getEventClassName = (view, region, dates, elevated, modal) =>
  `event ${isMultidate(dates) ? "MULTIDATE" : "SINGLEDATE"} ${elevated ? "elevated" : ""} ${modal ? "modal-event grid-view" : ""}`;

  handleOpenModal = (e, id) => {
    e.preventDefault();
    !this.props.elevated && this.props.handleOpenModal(id);
  };

  render() {

    const view = this.props.view;
    const event = this.props.event;
    const regionColor = regionInfo[this.props.event["region"]].color;
    const offerColor = offerInfo[this.props.event["offer"]].color;

    // console.log(regionColor);

    return (<div id={event.id} className={this.getEventClassName(view, event.region, event.dates, this.props.elevated, this.props.modal)} onClick={(e) => {
        this.handleOpenModal(e, event['id']);
      }}>

      <div className="close-button" onClick={() => {
          this.props.handleCloseModal();
        }}/>

      <div className="event-inner">
        <Header channels={event.channels} otherChannels={event.otherChannels} color={regionColor} />

        <div className={`event-info`}>
          <Dates dates={event.dates}/>

          <div className="info-wrapper">
            <p className="activity">
              <span className="offer-dot" title={event.offer} style={{backgroundColor: offerColor}}/>{event.campaignName}
            </p>
            <p className="timeframe">{event.segment}</p>
            <p className="tags">
              <span className="tag"><i className="nc-icon-mini business_globe"/>{" "}
                {event.campaignGroup}</span>{" "}
              <span className="tag"><i className="nc-icon-mini business_stock"/>{" "}
                {event.market}</span>{" "}
              <span className="tag">
                {event.segment}
              </span>{" "}
              {
                event.programType && <span className="tag partner-type "><i className="nc-icon-mini business_briefcase-25"/>{" "}
                    {event.programType}</span>
              }
            </p>
          </div>
          <i className="more"/>
        </div>

        <div className="tabs">
          <div className={`tab-content t1 ${this.props.elevated
              ? " active"
              : ""}`}>
            <p className="description">
              {event.description}
            </p>
            <p className="contact " title={event.owner.name}><i className="nc-icon-mini users_circle-09"/> {event.owner.name}</p>
            <Brands brands={event.brands}/>
          </div>
        </div>

      </div>

      <Timelines dates={event.dates} color={regionColor} />

    </div>)
  }
}

export default Event;
