import React, { Component } from 'react';
import 'flatpickr/dist/themes/dark.css'

import Flatpickr from 'react-flatpickr'

import {isMultidate} from '../../helpers/dates';

class EventDate extends Component {

  componentWillMount() {
    this.setState({
      date: new Date()
    });
  }

  keepEdits = (date, type) => {
    this.props.event['dates'][this.props.type][type] = date.toLocaleString('en-US').split(',')[0];
  }

  render() {
    // const { date } = this.state;

    const stay = this.props.type === 'stay'
      ? 'event-dates__STAY'
      : '';

    const Slash = () => <span>/</span>

    const formattedDate = date => {
      const d = date.split('/').map(d => d.length === 1 ? `0${d}` : d);
      return <span>{d[0]}<Slash />{d[1]}<Slash />{d[2]}</span>
    }

    return (<div className={`event-dates ${stay}`}>
      {
        this.props.editable 
        ? <span className="start"> <strong>{`${this.props.type} start`}</strong>
            <Flatpickr value={this.props.start} options={{ dateFormat: "m/d/Y", static: true }} onChange={date => this.keepEdits(date, 'start')} />
         </span>
        : <span className="start"> <strong>{`${this.props.type} start`}</strong> {formattedDate(this.props.start)} </span>
      }

      {
        this.props.editable 
        ? <span className="end"> <strong>{`${this.props.type} end`}</strong> 
            <Flatpickr value={this.props.end} options={{ dateFormat: "m/d/Y", static: true }} onChange={date => this.keepEdits(date, 'end')} />
          </span>
        : <span className="end"> <strong>{`${this.props.type} end`}</strong> {formattedDate(this.props.end)} </span>
      }
    </div>);
  }
}


class Dates extends Component {
  render() { 
    return (
      isMultidate(this.props.dates) || this.props.editable
        ? <div className="event-date">
          <EventDate start={this.props.dates.sell.start} end={this.props.dates.sell.end} type="sell" editable={this.props.editable} event={this.props.event}/>
          <EventDate start={this.props.dates.stay.start} end={this.props.dates.stay.end} type="stay" editable={this.props.editable} event={this.props.event}/>
        </div>
        : <div className="event-date">
          <EventDate start={this.props.dates.sell.start} end={this.props.dates.sell.end} type="sell & stay" event={this.props.event}/>
        </div>
    )
  }
}


export default Dates;
