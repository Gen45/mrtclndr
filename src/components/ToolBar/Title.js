import React from 'react';
import range from 'lodash/range';

import {_MONTHS, _LONGMONTHS, _PREVIOUSYEAR, _NEXTYEAR} from '../../helpers/dates';
import {_ISMOBILE} from '../../config/constants';

export const Title = props => {

  const monthNames = _ISMOBILE() ? _MONTHS : _LONGMONTHS;
  let detail,
      segment;

  switch (props.time.mode) {
    case 'Y':
      {
        segment = `20${props.time.Y === _PREVIOUSYEAR - 1 ? `${_PREVIOUSYEAR} - 20${_NEXTYEAR}` : props.time.Y}`;
        detail = props.view === 'grid' ? '' : range(props.time.numberOfYears - 1).reduce( (a, y, i, ar) => a+=`20${y + props.time.Y + 1}${i < props.time.numberOfYears - 2 ? ' - ': ''}`, '');
        break;
      }
    case 'M':
      {
        segment = `${monthNames[props.time.M - 1]}`;
        detail = `20${props.time.Y}`;
        break;
      }
    case 'Q':
      {
        segment = `Q${props.time.Q}`;
        detail = `20${props.time.Y}`;
        break;
      }
    default: {
      segment = 'Loading';
      detail = '...';
      break;
    }
  }
  return <h2 className="title">
    <span className="segment">{segment}</span>
    <span className="detail">{detail}</span>
  </h2>
}
