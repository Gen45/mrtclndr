import React, {Component} from 'react';

class MonthLines extends Component {
  render() {

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

    return (


      <div className="months-lines">
        {
          months.map((m) => {
            return <span key={`m${m}`} className="line"></span>;
          })
        }
    </div>
  )
  }
}

export default MonthLines;
