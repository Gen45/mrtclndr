import {year, today} from '../helpers/dates';

export const _MONTHS = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
export const _LONGMONTHS = [ "JANUARY", "FEBRARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER" ];

export const _PREV = -1;
export const _NEXT = 1;

export const _TODAY = today();
export const _CURRENTYEAR = Number(year(_TODAY));
export const _PREVIOUSYEAR = _CURRENTYEAR + _PREV;
export const _NEXTYEAR = _CURRENTYEAR + _NEXT;
export const _THREEYEARS = [_PREVIOUSYEAR, _CURRENTYEAR, _NEXTYEAR];

export const _MOBILEWIDTH = 720;
export const _ISMOBILE = () => window.innerWidth < _MOBILEWIDTH;

export const _BACKGROUNDIMAGE = 'images/bokeh.jpg';

// COLORS
export const _COLORS = {
  BLACK: "#161616",
  DARKGRAY: "#333333",
  DARKERGRAY: "#2b2b2b",
  DARKISHGRAY: "#595959",
  MEDIUMGRAY: "#666666",
  LIGHTGRAY: "#999999",
  LIGHTERGRAY: "#c2c2c2",
  LIGHTESTGRAY: "#f5f5f5",
  GREEN: "#0fe50f",
  WHITE: "#ffffff",
  ACCENT: "#e4144a",
  SUCCESS: "#70cb74"
};
