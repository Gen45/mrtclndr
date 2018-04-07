import moment from 'moment';

export const day = date => moment(date, "MM/DD/YY").format('DD');
export const month = date => moment(date, "MM/DD/YY").format('MM');
export const year = date => moment(date, "MM/DD/YY").format('YY');

export const cleanDate = (dateIn, dateType) => {
  const date = moment(dateIn).format('MM/DD/YY');
  return date === "Invalid date"
    ? dateType === 'start'
      ? {date: `01/01/${Number(moment().format('YY')) - 2}`, clean: false}
      : {date: `12/31/${Number(moment().format('YY')) + 2}`, clean: false}
    : {date, clean: true};
}

export const dayOfYear = date => moment(date, "MM/DD/YY").dayOfYear();
export const daysOfYear = date =>  moment("12/31/" + moment(date, "MM/DD/YY").format('YY'), "MM/DD/YY").dayOfYear();
