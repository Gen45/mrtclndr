import React, {Component} from 'react';
import {today, month, daysInMonth, add} from '../helpers/dates';
import {time} from '../config/defaultState';

const isTodayLine = (m) => today() == add('01/01/'+time.firstYear, m, 'month');
const todayPosition = () => `${month(today()) * 100 / daysInMonth(today()) }%`

const TodayLine = (props) =>
<span class="line-today" style={{left: props.position}}></span>

class MonthLines extends Component {
  render() {

    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    

    return (
      <div className="months-lines">
        {
          months.map((m) => {
            return <span key={`m${m}`} className="line">
              { isTodayLine(m) &&
                <TodayLine position={todayPosition()}/>
              }
            </span>;
          })
        }
    </div>
  )
  }
}

export default MonthLines;
