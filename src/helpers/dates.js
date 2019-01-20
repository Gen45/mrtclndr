import moment from 'moment';
import times from 'lodash/times';
import range from 'lodash/range';

import {_PREV, _NEXT} from '../config/constants';

export const _DATEFORMAT = "MM/DD/YYYY";

export const _QUARTERS = [1, 2, 3, 4];
export const _MONTHS = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
export const _LONGMONTHS = [ "JANUARY", "FEBRARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER" ];

export const format = (date) => moment(date).format(_DATEFORMAT);

export const today = () => moment().format(_DATEFORMAT);
export const day = date => moment(date, _DATEFORMAT).format('DD');
export const month = date => moment(date, _DATEFORMAT).format('MM');
export const year = date => moment(date, _DATEFORMAT).format('YY');
export const thisYear = () => moment().format('YY');
export const daysInMonth = date => moment(date, _DATEFORMAT).daysInMonth();
export const dayOfYear = date => moment(date, _DATEFORMAT).dayOfYear();
export const daysOfYear = date => moment("12/31/" + moment(date, _DATEFORMAT).format('YY'), _DATEFORMAT).dayOfYear();

export const compareDates = (date1, date2) => { 
  if( date1 === '' || date2 === '') {
    return true;
  } else {
    return moment(date1, _DATEFORMAT) >= moment(date2, _DATEFORMAT);
  }
};

export const _TODAY = today();
export const _CURRENTYEAR = Number(year(_TODAY));
export const _PREVIOUSYEAR = _CURRENTYEAR + _PREV;
export const _NEXTYEAR = _CURRENTYEAR + _NEXT;
export const _THREEYEARS = [_PREVIOUSYEAR, _CURRENTYEAR, _NEXTYEAR];
export const _TIMELIMITS = {Q: 4, M: 12, Y: {start: _PREVIOUSYEAR, end: _NEXTYEAR}};

export const add = (date, amount, type) => moment(date, _DATEFORMAT).add(amount, type).format(_DATEFORMAT);

export const timestamp = () => moment().milliseconds();

export const timespan = time => time.mode === 'Q' || time.mode === 'M'
  ? 1
  : time.numberOfYears;

export const years = (time) => range(timespan(time)).map(y => y + time.Y);

export const months = time => time.mode === 'Q'
  ? _LONGMONTHS.slice(time.Q * 3 - 3, time.Q * 3)
  : time.mode === 'M'
    ? _LONGMONTHS.slice(time.M - 1, time.M)
    : _LONGMONTHS;

export const yearsMonths = (years, months) => {
  let yearsMonths = [];

  for (let y of years) {
    for (let m of months) {
      yearsMonths.push({year: y, month: m});
    }
  }
  return yearsMonths;
};

export const isMultidate = (dates) => ((format(dates.sell.start) !== format(dates.stay.start)) || (format(dates.sell.end) !== format(dates.stay.end))) && (format(dates.stay.start) !== "" && format(dates.stay.end) !== "");

export const getExtreme = (dates, direction) => {
  direction = direction || 'right';
  const directions = {
    left: -1,
    right: 1
  };
  return dates.filter(d => d !== '').map(date => {
    const offset = year(date) - thisYear();
    return times(Math.abs(offset), i => Number(thisYear()) + Math.sign(offset) * (i + 1)).map(y => Math.sign(offset) * daysOfYear(thisYear() + y)).reduce((y, sum) => {
      return y + sum;
    }, dayOfYear(date));
  }).reduce((date, extremer) => (
    direction === 'left'
    ? (
      date < extremer
      ? date
      : extremer)
    : (
      date > extremer
      ? date
      : extremer)), directions.direction * 100000)
};

export const cleanDate = (dateIn, dateType) => {
  const date = moment(dateIn, _DATEFORMAT).format(_DATEFORMAT);
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

export const getTimeRange = (time) => {
  const yearStart = time.Y;
  const yearEnd = time.mode === 'Y' ? time.Y + time.numberOfYears - 1 : time.Y;

  const monthStart = time.mode === 'Y' ? 1 : time.mode === 'Q' ? time.Q * 3 - 2 : time.M;
  const monthEnd = time.mode === 'Y' ? 12 : time.mode === 'Q' ? time.Q * 3 : time.M;

  const startDate = `${monthStart}/01/${yearStart}`;
  const endDate = `${monthEnd}/${daysInMonth(`${monthEnd}/01/${yearEnd}`)}/${yearEnd}`;

  const timeRange = {start: startDate, earliestDay: getExtreme([startDate], 'left'),  end: endDate, latestDay: getExtreme([endDate], 'right')};
  return timeRange;
}
