import React, {Component} from 'react';
import moment from 'moment';


export class Timeline extends Component {

  daysOfYear = (date) => {
    return moment("12/31/" + moment(date, "MM/DD/YY").format('YY'), "MM/DD/YY").dayOfYear()
  };

  getLineStart = (date) => {
    // TODO make the 2 in this formula a variable for number of years
    return  moment(date, "MM/DD/YY").dayOfYear() * ((100 / 2) / this.daysOfYear(date));
  };

  getLineWidth = (startDate, endDate) => {
    return this.getLineStart(endDate) - this.getLineStart(startDate);
  };

  render() {

    const dates = this.props.dates;

    return (<div className={`timeline-wrapper ${this.props.multidate
        ? "  timeline-2"
        : ''}`}>
      <div
        className="event-timeline"
        // data-start={moment(dates.start, "MM/DD/YY").dayOfYear()}
        // data-end={moment(dates.end, "MM/DD/YY").dayOfYear()}
        style={{
          left: this.getLineStart(dates.start) + '%',
          width: this.getLineWidth(dates.start, dates.end) + '%'
        }}>
        <i className="start"
          // data-date={dates.start}
          data-day={moment(dates.start, "MM/DD/YY").format('DD')}
          data-month={moment(dates.start, "MM/DD/YY").format('MM')}
          data-year={moment(dates.start, "MM/DD/YY").format('YY')}
        />
        <i className="end"
          // data-date={dates.end}
          data-day={moment(dates.end, "MM/DD/YY").format('DD')}
          data-month={moment(dates.end, "MM/DD/YY").format('MM')}
          data-year={moment(dates.end, "MM/DD/YY").format('YY')}
        />
      </div>
    </div>)
  }
}

class Timelines extends Component {
  render() {
    const dates = this.props.dates;

    return (<div className="timelines">
      <Timeline dates={dates.sell} />
      {dates.multidate() &&
        <Timeline dates={dates.stay} multidate={true} />
      }
    </div>)
  }
}

export default Timelines;
