import moment from 'moment';
import range from 'lodash/range';
import times from 'lodash/times';

export const day = date => moment(date, "MM/DD/YY").format('DD');
export const month = date => moment(date, "MM/DD/YY").format('MM');
export const year = date => moment(date, "MM/DD/YY").format('YY');
export const thisYear = () => moment().format('YY');


export const cleanDate = (date, dateType) => {
  // const date = moment(dateIn).format('MM/DD/YY');
  return date === "Invalid date"
    ? dateType === 'start'
      ? {
        date: `01/01/${Number(moment().format('YY')) - 2}`,
        clean: false
      }
      : {
        date: `12/31/${Number(moment().format('YY')) + 2}`,
        clean: false
      }
    : {
      date,
      clean: true
    };
}

export const dayOfYear = date => moment(date, "MM/DD/YY").dayOfYear();
export const daysOfYear = date => moment("12/31/" + moment(date, "MM/DD/YY").format('YY'), "MM/DD/YY").dayOfYear();

// export const date =

export const isMultidate = (dates) => ((dates.sell.start !== dates.stay.start) || (dates.sell.end !== dates.stay.end)) && (dates.stay.start !== "" && dates.stay.end !== "");

export const getEarlierDate = dates =>
{

// "01/15/17"  ==>  - 365 + 15 ==> -350
// "01/15/17"  ==>  - daysOfYear(d) + dayOfYear(d) ==> -350

// "01/15/15"  ==>

dates.map(d => {



  const offset = year(d) - thisYear();  // 16 - 18 => -2

  times(Math.abs(offset), (i) => thisYear() + Math.sign(offset) * i ) // [18, 17]

  .map( d => daysOfYear(thisYear() + offset) ) []
  .reduce( (y, sum) => , daysOfYear(d) )



}).reduce(
  (date, earlier) => date < earlier
  ? date
  : earlier,
900);

}
