import React, {Component} from 'react';

class MonthBar extends Component {

  render() {
    const months = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
    const years = [17, 18];

    const yearsMonths = (years, months) => {
      let yearsMonths = [];
      for (let y of years) {
        for (let m of months) {
          yearsMonths.push({year: y, month: m});
        }
      }
      return yearsMonths;
    }

    return (<div className="months-bar">
      {
        yearsMonths(years, months).map((ym, key) => <a key={key} className={`${ym.month}-${ym.year}`}>{ym.month[0]}<span className="hidden-mobile">{ym.month.slice(1)}</span>
        </a>)
      }
    </div>)
  }
}

export default MonthBar;
