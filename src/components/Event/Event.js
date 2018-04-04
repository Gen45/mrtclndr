import React, {Component} from 'react';

import Header from './Header';
import Brands from './Brands';
import Dates from './Dates';

class Event extends Component {

  render() {

    const event = {
      channels: {
        "EVENTS": this.props.event["Events"],
        "MEDIA": this.props.event["Media"],
        "CONTENT": this.props.event["Content"],
        "DIRECT_MAIL": this.props.event["Direct Mail"],
        "EMAIL": this.props.event["Email"],
        "ON_PROPERTY": this.props.event["On Property"],
        "BRAND_COM": this.props.event["Brand-dot-Com"],
        "LOYALTY-OFFER": this.props.event["Loyalty"],
        "PR": this.props.event["PR"],
        "SOCIAL": this.props.event["Social"]
      },
      otherChannels: this.props.event["Other Channels"],
      id: this.props.event["Id"],
      owner: {
        name: this.props.event["Owner"]
      },
      region: this.props.event["Owner SubRegion"],
      campaignName: this.props.event["Campaign Name"],
      campaignGroup: this.props.event["Campaign Group"],
      segment: this.props.event["Segment"],
      market: this.props.event["Entire US"],
      programType: this.props.event["Program Type"],
      description: this.props.event["Description"],
      dates: {
        sell: {
          start: this.props.event["Sell Start Date"],
          end: this.props.event["Sell End Date"]
        },
        stay: {
          start: this.props.event["Stay Start Date"],
          end: this.props.event["Stay End Date"]
        },
        multidate() {
          return (this.sell.start !== this.stay.start || this.sell.end !== this.stay.end)
        }
      },
      brands: this.props.event["Brand"].split(',')
    }

    return (<div id={event.id} className={`event ${this.props.view}-view ${event.region}${event.dates.multidate()
        ? " MULTIDATE"
        : ''}`}>

      <div className="close-button"/>

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
          <i className="more"/>
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

      <div className="timeline-wrapper">
        <div className="event-timeline one-month" data-start={232} data-end={232} style={{
            left: '31.7808%',
            width: '0%'
          }}>
          <i className="start" data-day={21} data-month={8} data-year={17}/>
          <i className="end" data-day={21} data-month={8} data-year={17}/>
        </div>
      </div>

      <div className="timeline-wrapper timeline-2">
        <div className="event-timeline" data-start={230} data-end={232} style={{
            left: '31.5068%',
            width: '0.273973%'
          }}>
          <i className="start" data-day={19} data-month={8} data-year={17}/>
          <i className="end" data-day={21} data-month={8} data-year={17}/>
        </div>
      </div>

    </div>)
  }
}

export default Event;
