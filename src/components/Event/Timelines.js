import React, {Component} from 'react';

import {
  cleanDate,
  dayOfYear,
  daysOfYear,
  day,
  month,
  year
} from '../../helpers/dates';

export class Timeline extends Component {

  // TODO make the 2 in this formula a variable for number of years
  // "01/15/17"
  getLineStart = (date, firstYear) => ((year(date) - firstYear) * daysOfYear('01/01/'+firstYear) + dayOfYear(date)) * ((100 / 2) / daysOfYear(date));

  // getLineStart = date => dayOfYear(date) * ((100 / 2) / daysOfYear(date));

  getLineWidth = (dates, firstYear) => this.getLineStart(dates.end, firstYear) - this.getLineStart(dates.start, firstYear);

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
    const firstYear = this.props.firstYear;
    const color = this.props.color;

    return (<div className={`timeline-wrapper ${this.timeline2(this.props.multidate)}`}>
      <div className={`event-timeline ${this.oneMonth(dates)} ${this.dotted(dates)}`.trim()}
        // data-start={moment(dates.start, "MM/DD/YY").dayOfYear()}

        // data-end={moment(dates.end, "MM/DD/YY").dayOfYear()}
        style={{
          left: this.getLineStart(dates.start, firstYear) + '%',
          width: this.getLineWidth(dates, firstYear) + '%',
          backgroundColor: color
        }}>
        <i className="start"
          // data-date={dates.start}
          data-day={day(dates.start)} data-month={month(dates.start)} data-year={year(dates.start)} style={{ borderColor: color }}/>
        <i className="end"
          // data-date={dates.end}
          data-day={day(dates.end)} data-month={month(dates.end)} data-year={year(dates.end)} style={{ borderColor: color }}/>
      </div>
    </div>)
  }
}

class Timelines extends Component {
  render() {
    const dates = this.props.dates;
    const color = this.props.color;
    const datesType = this.props.datesType;
    const firstYear = this.props.time.firstYear;

    return (
      <div className="timelines">
        <Timeline dates={dates.sell} color={color} firstYear={firstYear} />
        {datesType === 'MULTIDATE' &&
          <Timeline dates={dates.stay} multidate={true} color={color} firstYear={firstYear} />}
      </div>)
  }
}

export default Timelines;
