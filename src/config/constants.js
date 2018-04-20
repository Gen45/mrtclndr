import {year, today} from '../helpers/dates';

export const _MONTHS = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
export const _LONGMONTHS = [ "JANUARY", "FEBRARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER" ];

export const _PREVIOUSYEAR = Number(year(today())) - 1;
export const _NEXTYEAR = Number(year(today())) + 1;
export const _CURRENTYEAR = Number(year(today()));
export const _THREEYEARS = [_PREVIOUSYEAR, _CURRENTYEAR, _NEXTYEAR];

export const _PREV = -1;
export const _NEXT = 1;

export const _MOBILEWIDTH = 720;
export const _ISMOBILE = window.innerWidth < _MOBILEWIDTH;

export const _BACKGROUNDIMAGE = 'images/bokeh.jpg';
