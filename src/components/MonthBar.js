import React, {Component} from 'react';

class MonthBar extends Component {

  handleClick = (event, ym) => {
    event.preventDefault();
    console.log(`${ym.year}-${ym.month}`);
  };

  render() {
    const months = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
    const years = [this.props.time.firstYear, this.props.time.firstYear + 1];

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
        yearsMonths(years, months).map((ym, key) => <a key={key} className={`${ym.month}-${ym.year}`} onClick={(e) => this.handleClick(e, ym)}>{ym.month[0]}<span className="hidden-mobile">{ym.month.slice(1)}</span>
        </a>)
      }
    </div>)
  }
}

export default MonthBar;
