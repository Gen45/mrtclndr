import React, {Component} from 'react';
import range from 'lodash/range';
import {today, day, daysInMonth, add} from '../helpers/dates';
import {time} from '../config/defaultState';

const isTodayLine = (m) => today() === add(`01/${day(today())}/${time.firstYear}`, m, 'month');
const todayPosition = () => `${day(today()) * 100 / daysInMonth(today())}%`;

const TodayLine = (props) => <span className="line-today" style={{
    left: props.position
  }}></span>

class MonthLines extends Component {
  render() {

    const months = range(24);

    return (<div className="months-lines">
      {
        months.map((m) => <span key={`m${m}`} className="line">
          {isTodayLine(m) && <TodayLine position={todayPosition()}/>}
        </span>)
      }
    </div>)
  }
}

export default MonthLines;
