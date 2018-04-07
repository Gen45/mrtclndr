import React, {Component} from 'react';

import Header from './Header';
import Brands from './Brands';
import Dates from './Dates';
import Timelines from './Timelines';

class Event extends Component {

  getEventClassName = (view, event) => {
    return `event ${view}-view ${event.region}${event.dates.multidate() ? " MULTIDATE" : " SINGLEDATE"} ${event.dates.multidate()}`;
  };

  render() {

    const view = this.props.view;
    const event = this.props.event;

    return (<div id={event.id} className={this.getEventClassName(view, event)}>

      {/* <div className="close-button"/> */}

      <div className="event-inner">
        <Header channels={event.channels} otherChannels={event.otherChannels}/>

        <div className="event-info">
          <Dates dates={event.dates}/>

          <div className="info-wrapper">
            <p className="activity">
              {event.campaignName}
            </p>
            <p className="timeframe">Leisure</p>
            <p className="tags">
              <span className="tag regions-involved "><i className="nc-icon-mini business_globe"/>{" "}
                {event.campaignGroup}</span>{" "}
              <span className="tag major-markets-involved "><i className="nc-icon-mini business_stock"/>{" "}
                n/a</span>{" "}
              <span className="tag major-markets-involved ">
                {event.segment}</span>{" "}
              {
                event.programType && <span className="tag partner-type "><i className="nc-icon-mini business_briefcase-25"/>{" "}
                    {event.programType}</span>
              }
            </p>
          </div>
          {/* <i className="more"/> */}
        </div>

        <div className="tabs">
          <div className="tab-content t1 active">
            <p>
              {event.description}
            </p>
          </div>
          <p className="contact " title={event.owner.name}><i className="nc-icon-mini users_circle-09"/> {event.owner.name}</p>
        </div>

        <Brands brands={event.brands}/>
      </div>

      <Timelines dates={event.dates}/>

    </div>)
  }
}

export default Event;
