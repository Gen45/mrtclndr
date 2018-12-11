import React, {Component} from 'react';
import {today, day, daysInMonth, add, yearsMonths, months, years} from '../../helpers/dates';

import {_COLORS, _SIDEBAR} from '../../config/constants';

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
          {this.isTodayLine(_months.indexOf(ym.month) + (this.props.time.mode === 'M' ? this.props.time.M - 1 : (this.props.time.mode === 'Q' ? ((this.props.time.Q - 1)*3 ): 0)), ym.year) && <TodayLine position={this.todayPosition()}/>}
        </span>)
      }
    </div>)
  }
}

export class MonthBar extends Component {

  state = {
    short: false
  }

  handleClick = (event, ym) => {
    event.preventDefault();
    console.log(ym);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({yearsMonths: yearsMonths(years(nextProps.time), months(nextProps.time))}, this.updateDimensions);
  }

  componentWillMount() {
    this.setState({yearsMonths: yearsMonths(years(this.props.time), months(this.props.time))}, this.updateDimensions);
    window.addEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({cellWidth: (window.innerWidth - 20 * 2 - (this.props.collapsed ? 0 : _SIDEBAR)) / this.state.yearsMonths.length});
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    const putIndicator = (ym) => {
      const values = {
        JAN: { v: ym.year }, APR: { v: 'Q2' }, JUL: { v: 'Q3' }, OCT: { v: 'Q4' } };
      return values[ym.month.slice(0,3)] &&
      <span style={{
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
        }}>{values[ym.month.slice(0,3)].v}
      </span>
    }
    return (
    <div className="months-bar">
      {
        this.state.yearsMonths.map((ym, key) =>
        <div key={key} className={`${ym.month}-${ym.year}`} onClick={(e) => this.handleClick(e, ym)}>
          {this.state.cellWidth > 35 && putIndicator(ym)}
          {
            this.state.cellWidth > 90 ? ym.month : this.state.cellWidth > 45 ? ym.month.slice(0,3) : ym.month[0]
          }
        </div>)
      }
    </div>)
  }
}
