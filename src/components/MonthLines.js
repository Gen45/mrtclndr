import React, {Component} from 'react';
import {today, day, daysInMonth, add, yearsMonths, months, years} from '../helpers/dates';

import {_ISMOBILE, _COLORS} from '../config/constants';

const TodayLine = props => <span className="line-today" style={{
    left: props.position
  }}></span>

export class MonthLines extends Component {

  isTodayLine = (m, y) => today() === add(`01/${day(today())}/${y}`, m, 'month');
  todayPosition = () => `${day(today()) * 100 / daysInMonth(today())}%`;

  render() {

    const _months = months(this.props.time);
    const _years = years(this.props.time);

    return (<div className="months-lines">
      {
        yearsMonths(_years, _months).map((ym, key) => <span key={`${ym.year}-${ym.month}`} className="line">
          {this.isTodayLine(_months.indexOf(ym.month), ym.year) && <TodayLine position={this.todayPosition()}/>}
        </span>)
      }
    </div>)
  }
}

export class MonthBar extends Component {

  handleClick = (event, ym) => {
    event.preventDefault();
  };

  render() {

    const putIndicator = (ym) => {
      const values = {
        JAN: {
          v: ym.year
        },
        APR: {
          v: 'Q2'
        },
        JUL: {
          v: 'Q3'
        },
        OCT: {
          v: 'Q4'
        }
      };
      return values[ym.month] && window.innerWidth > 1000 && <span style={{
          "position" : "absolute",
          "top" : "5px",
          "left" : "-8px",
          "fontSize" : "7px",
          "color" : _COLORS.ACCENT,
          "fontWeight" : "bold",
          "borderRadius" : "60px",
          "height" : "16px",
          "width" : "16px",
          "lineHeight" : "16px",
          "zIndex" : "5000"
        }}>{values[ym.month].v}</span>
    }

    const _years = years(this.props.time);
    const _months = months(this.props.time);

    return (<div className="months-bar">
      {
        yearsMonths(_years, _months).map((ym, key) => <div key={key} className={`${ym.month}-${ym.year}`} onClick={(e) => this.handleClick(e, ym)}>
          {putIndicator(ym)}
          {
            (_ISMOBILE() || this.props.time.numberOfYears > 2) && this.props.time.mode === 'Y'
              ? ym.month[0]
              : ym.month
          }
        </div>)
      }
    </div>)
  }
}
