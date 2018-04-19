import React, {Component} from 'react';
import {today, day, daysInMonth, add, yearsMonths} from '../helpers/dates';

const TodayLine = props => <span className="line-today" style={{
    left: props.position
  }}></span>

class MonthLines extends Component {

  isTodayLine = m => today() === add(`01/${day(today())}/${this.props.time.Y}`, m, 'month');
  todayPosition = () => `${day(today()) * 100 / daysInMonth(today())}%`;

  render() {

    // const months = this.props.months * this.props.years;
    // console.log(months);

    return (
      <div className="months-lines">
      {
        yearsMonths(this.props.years, this.props.months).map((ym, key) =>
        <span key={`${ym.year}-${ym.month}`} className="line" >
          {this.isTodayLine(ym.month) && <TodayLine position={this.todayPosition()}/>}
        </span>)
      }
    </div>)
  }
}

export default MonthLines;
