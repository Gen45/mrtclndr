import React, {Component} from 'react';
import range from 'lodash/range';
import {today, day, daysInMonth, add} from '../helpers/dates';


const TodayLine = props => <span className="line-today" style={{
    left: props.position
  }}></span>

class MonthLines extends Component {

  isTodayLine = m => today() === add(`01/${day(today())}/${this.props.time.firstYear}`, m, 'month');
  todayPosition = () => `${day(today()) * 100 / daysInMonth(today())}%`;

  render() {

    const months = range(24);

    return (<div className="months-lines">
      {
        months.map((m) => <span key={`m${m}`} className="line">
          {this.isTodayLine(m) && <TodayLine position={this.todayPosition()}/>}
        </span>)
      }
    </div>)
  }
}

export default MonthLines;
