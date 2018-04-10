import React, {Component} from 'react';

import {year, isMultidate} from '../../helpers/dates';

import Header from './Header';
import Brands from './Brands';
import Dates from './Dates';
import Timelines from './Timelines';

//
// $year_classes = $start_sell_date_obj->{'year'};
// if ( $year_classes == $end_sell_date_obj->{'year'}) {
// $year_classes = 'YEAR-'. $year_classes;
// } else {
// $year_classes = "YEAR-". $start_sell_date_obj->{'year'} . " YEAR-" . $end_sell_date_obj->{'year'};
// }





class Event extends Component {

  getYearClasses = (dates) => [year(dates.sell.start), year(dates.sell.end), year(dates.stay.start), year(dates.stay.end)]
                                .filter( (value, index, self) => self.indexOf(value) === index )
                                .reduce( (classes, year) => `${classes} YEAR-${year}`, '');

  getEventClassName = (view, region, dates) => `event ${view}-view ${region}${isMultidate(dates) ? " MULTIDATE" : " SINGLEDATE"} ${this.getYearClasses(dates)}`;

  render() {

    const view = this.props.view;
    const event = this.props.event;

    return (<div id={event.id} className={this.getEventClassName(view, event.region, event.dates)}>

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
