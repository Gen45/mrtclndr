import React, {Component} from 'react';

import {
  cleanDate,
  dayOfYear,
  daysOfYear,
  day,
  month,
  year,
  add
} from '../../helpers/dates';

export class Timeline extends Component {

  getLineStart = (date, Y, timespan) => ((year(date) - Y) * daysOfYear('01/01/' + Y) + dayOfYear(date)) * ((100 / timespan) / daysOfYear(date));

  getLineWidth = (dates, Y, timespan) => this.getLineStart(dates.end, Y, timespan) - this.getLineStart(dates.start, Y, timespan);

  oneMonth = dates => dates.start === dates.end
    ? ' one-month'
    : '';

  dotted = dates => !cleanDate(dates.start, 'start').clean || !cleanDate(dates.end, 'end').clean
    ? ' dotted'
    : '';

  timeline2 = multidate => multidate
    ? ' timeline-2'
    : '';


  render() {

    const dates = {
      start: cleanDate(this.props.dates.start, 'start').date,
      end: cleanDate(this.props.dates.end, 'end').date
    };

    const mode = this.props.time.mode;
    const M = this.props.time.M;
    const Y = this.props.time.Y;
    const Q = this.props.time.Q;
    const timespan = mode === 'Q' ? 1/4 : mode === 'M' ? 1 / 12 : this.props.time.numberOfYears;
    const offset = mode === 'Q' ? (Q - 1) * 3: mode === 'M' ? M - 1 : 0;
    const color = this.props.color;

    return (<div className={`timeline-wrapper${this.timeline2(this.props.multidate)}`}>
      <div className={`event-timeline${this.oneMonth(dates)}${this.dotted(dates)}`.trim()}

        style={{
          // left: this.getLineStart(dates.start, Y, timespan) + '%',
          left: this.getLineStart(add(dates.start, -offset, 'months'), Y, timespan) + '%',
          width: this.getLineWidth(dates, Y, timespan) + '%',
          backgroundColor: color
        }}>
        <i className="start"
          // data-date={dates.start}
          data-day={day(dates.start)} data-month={month(dates.start)} data-year={year(dates.start)} style={{
            borderColor: color
          }}/>
        <i className="end"
          // data-date={dates.end}
          data-day={day(dates.end)} data-month={month(dates.end)} data-year={year(dates.end)} style={{
            borderColor: color
          }}/>
      </div>
    </div>)
  }
}

class Timelines extends Component {
  render() {
    const dates = this.props.dates;
    const color = this.props.color;
    const datesType = this.props.datesType;
    const time = this.props.time;

    return (<div className="timelines">
      <Timeline dates={dates.sell} color={color} time={time}/> {datesType === 'MULTIDATE' && <Timeline dates={dates.stay} multidate={true} color={color} time={time}/>}
    </div>)
  }
}

export default Timelines;
