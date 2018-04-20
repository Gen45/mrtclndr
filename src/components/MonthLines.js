import React, {Component} from 'react';
import {today, day, daysInMonth, add, yearsMonths} from '../helpers/dates';

const TodayLine = props => <span className="line-today" style={{
    left: props.position
  }}></span>

class MonthLines extends Component {

  isTodayLine = (m, y) => today() === add(`01/${day(today())}/${y}`, m, 'month');

  todayPosition = () => `${day(today()) * 100 / daysInMonth(today())}%`;

  render() {


    return (
      <div className="months-lines">
      {
        yearsMonths(this.props.years, this.props.months).map((ym, key) =>
        <span key={`${ym.year}-${ym.month}`} className="line" >
          {
            this.isTodayLine(this.props.months.indexOf(ym.month), ym.year) &&
            <TodayLine position={this.todayPosition()} />
          }
        </span>)
      }
    </div>)
  }
}

export default MonthLines;
