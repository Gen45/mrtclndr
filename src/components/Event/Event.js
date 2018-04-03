import React, {Component} from 'react';
// import LazyLoad from 'react-lazy-load';

import Header from './Header';
import Brands from './Brands';

const EventDate = (props) => {
  const stay = props.type === 'stay'
    ? 'event-dates__STAY'
    : '';

  return (<div className={`event-dates ${stay}`}>
    <span className="start">
      <strong>{`${props.type} start`}</strong>
      {props.start}
    </span>
    <span className="end">
      <strong>{`${props.type} end`}</strong>
      {props.end}
    </span>
  </div>);
}

class Event extends Component {

  render() {

    const channels = {
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
    }

    const id = this.props.event["Id"];
    const region = this.props.event["Owner SubRegion"];
    const campaignName = this.props.event["Campaign Name"];
    const dates = {
      sell: {
        start: this.props.event["Sell Start Date"],
        end: this.props.event["Sell End Date"]
      },
      stay: {
        start: this.props.event["Stay Start Date"],
        end: this.props.event["Stay End Date"]
      }
    }
    const multidate = (dates.sell.start !== dates.stay.start || dates.sell.end !== dates.stay.end);
    const brands = this.props.event["Brand"].split(',');

    return (
      <div id={id} className={`event ${region} ${multidate
        ? "MULTIDATE"
        : ''}`}>

      <div className="close-button"/>


      <div className="event-inner">

        <Header channels={channels} otherChannels={this.props.event["Other Channels"]}/>
        <div className="event-info">

          {
            multidate
              ? <div className="event-date">
                  <EventDate start={dates.sell.start} end={dates.sell.end} type="sell"/>
                  <EventDate start={dates.stay.start} end={dates.stay.end} type="stay"/>
                </div>
              : <div className="event-date">
                  <EventDate start={dates.sell.start} end={dates.sell.end} type="sell & stay"/>
                </div>
          }

          <div className="info-wrapper">
            <p className="activity">
              {campaignName}
            </p>
            <p className="timeframe">Leisure</p>
            <p className="tags">
              <span className="tag regions-involved "><i className="nc-icon-mini business_globe"/>
                Destination Cluster</span>
              <span className="tag major-markets-involved "><i className="nc-icon-mini business_stock"/>
                n/a</span>
              <span className="tag major-markets-involved ">
                {/* <i class="nc-icon-mini business_stock"></i> */}
                Cluster</span>
              <span className="tag partner-type "><i className="nc-icon-mini business_briefcase-25"/>
                Field Marketing</span>
            </p>
          </div>
          <i className="more"/>
        </div>

        <div className="tabs">
          <div className="tab-content t1 active">
            <p>
              {this.props.event["Description"]}
            </p>
          </div>
          <p className="contact " data-title="Maria Dellacamera"><i className="nc-icon-mini users_circle-09"/> {this.props.event["Owner"]}</p>
        </div>

        <Brands brands={brands}/>
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
