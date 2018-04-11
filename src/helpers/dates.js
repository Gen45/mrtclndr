import moment from 'moment';
// import range from 'lodash/range';
import times from 'lodash/times';
// import _ from 'lodash';

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

export const isMultidate = (dates) => ((dates.sell.start !== dates.stay.start) || (dates.sell.end !== dates.stay.end)) && (dates.stay.start !== "" && dates.stay.end !== "");

export const getEarlierDate = dates => dates.filter(d => d !== '').map(date => {
  const offset = year(date) - thisYear();
  return times(Math.abs(offset), i => Number(thisYear()) + Math.sign(offset) * (i + 1)).map(y => Math.sign(offset) * daysOfYear(thisYear() + y)).reduce((y, sum) => {
    return y + sum;
  }, dayOfYear(date));
}).reduce((date, earlier) => (
  date < earlier
  ? date
  : earlier), 100000);
