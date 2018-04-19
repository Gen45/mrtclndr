import React, {Component} from 'react';

import {yearsMonths} from '../helpers/dates';

import {_MOBILEWIDTH} from '../config/constants';

class MonthBar extends Component {

  handleClick = (event, ym) => {
    event.preventDefault();
    console.log(`${ym.year}-${ym.month}`);
  };


  render() {

    const putIndicator = (ym) => {
      const values = {JAN: {v: ym.year}, APR: {v: 'Q2'}, JUL: {v: 'Q3'}, OCT: {v: 'Q4'}};
      return values[ym.month] && <div style={{
            "position" : "absolute",
            "top" : "5px",
            "left" : "-8px",
            "fontSize" : "7px",
            // "background" : "rgba(90,90,90,0.2)",
            "color" : "#e4144a",
            "fontWeight": "bold",
            "borderRadius" : "60px",
            "height" : "16px",
            "width" : "16px",
            "lineHeight" : "16px",
            "zIndex": "5000"
          }}>{values[ym.month].v}</div>
    }

    return (<div className="months-bar">
      {
        yearsMonths(this.props.years, this.props.months).map((ym, key) => <div key={key} className={`${ym.month}-${ym.year}`} onClick={(e) => this.handleClick(e, ym)}>
          {
            putIndicator(ym)
          }
          {
            window.innerWidth < _MOBILEWIDTH || this.props.time.numberOfYears > 2
              ? ym.month[0]
              : ym.month
          }
        </div>)
      }
    </div>)
  }
}

export default MonthBar;
