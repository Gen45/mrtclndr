import React from 'react';
import range from 'lodash/range';

import {_MONTHS, _LONGMONTHS, _ISMOBILE} from '../../config/constants';

export const Title = props => {

  const monthNames = _ISMOBILE ? _MONTHS : _LONGMONTHS;
  let detail,
    segment;
  switch (props.time.mode) {
    case 'Y':
      {
        detail = range(props.time.numberOfYears - 1).reduce( (a, y, i, ar) => a+=`20${y + props.time.Y + 1}${i < props.time.numberOfYears - 2 ? ' - ': ''}`, '');
        segment = `20${props.time.Y}`;
        break;
      }
    case 'M':
      {
        detail = `20${props.time.Y}`;
        segment = `${monthNames[props.time.M - 1]}`;
        break;
      }
    case 'Q':
      {
        detail = `20${props.time.Y}`;
        segment = `Q${props.time.Q}`;
        break;
      }
    default: {
      detail = '...';
      segment = 'Loading';
      break;
    }
  }
  return <h2 className="title">
    <span className="segment">{segment}</span>
    <span className="detail">{detail}</span>
  </h2>
}
