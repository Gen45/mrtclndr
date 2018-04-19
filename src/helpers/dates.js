import moment from 'moment';
// import range from 'lodash/range';
import times from 'lodash/times';
// import _ from 'lodash';

const FORMAT = "MM/DD/YY";

export const day = date => moment(date, FORMAT).format('DD');
export const month = date => moment(date, FORMAT).format('MM');
export const year = date => moment(date, FORMAT).format('YY');

export const add = (date, amount, type) => moment(date, FORMAT).add(amount, type).format(FORMAT);

export const quarter = date => moment(date, FORMAT).quarter();
// export const quarters = dates => moment(date, FORMAT).quarter();

export const today = () => moment().format(FORMAT);
export const thisYear = () => moment().format('YY');
export const daysInMonth = date => moment(date, FORMAT).daysInMonth();
export const dayOfYear = date => moment(date, FORMAT).dayOfYear();
export const daysOfYear = date => moment("12/31/" + moment(date, FORMAT).format('YY'), FORMAT).dayOfYear();

export const yearsMonths = (years, months) => {
  let yearsMonths = [];

  for (let y of years) {
    for (let m of months) {
      yearsMonths.push({year: y, month: m});
    }
  }

  return yearsMonths;
};

export const isMultidate = (dates) => ((dates.sell.start !== dates.stay.start) || (dates.sell.end !== dates.stay.end)) && (dates.stay.start !== "" && dates.stay.end !== "");

export const getExtreme = (dates, direction) => {
  const directions = {
    left: -1,
    right: 1
  };
  return dates.filter(d => d !== '').map(date => {
    const offset = year(date) - thisYear();
    return times(Math.abs(offset), i => Number(thisYear()) + Math.sign(offset) * (i + 1)).map(y => Math.sign(offset) * daysOfYear(thisYear() + y)).reduce((y, sum) => {
      return y + sum;
    }, dayOfYear(date));
  }).reduce((date, earlier) => (
    date < earlier
    ? date
    : earlier), directions.direction * 100000)
};

export const cleanDate = (dateIn, dateType) => {
  const date = moment(dateIn, FORMAT).format(FORMAT);
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
};
