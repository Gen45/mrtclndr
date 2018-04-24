import React, {Component} from 'react';
import range from 'lodash/range';

import {_MONTHS, _LONGMONTHS, _PREVIOUSYEAR, _NEXTYEAR} from '../../helpers/dates';
import {_ISMOBILE} from '../../config/constants';

class Title extends Component {

  render() {

    const monthNames = _ISMOBILE() ? _MONTHS : _LONGMONTHS;
    let detail,
        segment;

    switch (this.props.time.mode) {
      case 'Y':
        {
          segment = `20${this.props.time.Y === _PREVIOUSYEAR - 1 ? `${_PREVIOUSYEAR} - 20${_NEXTYEAR}` : this.props.time.Y}`;
          detail = this.props.view === 'grid' ? '' : range(this.props.time.numberOfYears - 1).reduce( (a, y, i, ar) => a+=`20${y + this.props.time.Y + 1}${i < this.props.time.numberOfYears - 2 ? ' - ': ''}`, '');
          break;
        }
      case 'M':
        {
          segment = `${monthNames[this.props.time.M - 1]}`;
          detail = `20${this.props.time.Y}`;
          break;
        }
      case 'Q':
        {
          segment = `Q${this.props.time.Q}`;
          detail = `20${this.props.time.Y}`;
          break;
        }
      default: {
        segment = 'Loading';
        detail = '...';
        break;
      }
    }

    return (
      <h2 className="title">
        <span className="segment">{segment}</span>
        <span className="detail">{detail}</span>
      </h2>
    )
  }
}

export default Title;
