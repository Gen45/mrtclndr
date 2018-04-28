import React from 'react';

import {isMultidate} from '../../helpers/dates';

const EventDate = (props) => {
  const stay = props.type === 'stay'
    ? 'event-dates__STAY'
    : '';

  const Slash = () => <span>/</span>

  const formattedDate = date => {
    const d = date.split('/').map(d => d.length === 1 ? `0${d}` : d);
    return <span>{d[0]}<Slash />{d[1]}<Slash />{d[2]}</span>
  }

  return (<div className={`event-dates ${stay}`}>
    <span className="start">
      <strong>{`${props.type} start`}</strong>
      {formattedDate(props.start)}
    </span>
    <span className="end">
      <strong>{`${props.type} end`}</strong>
      {formattedDate(props.end)}
    </span>
  </div>);
}

const Dates = (props) => {

  return (
    isMultidate(props.dates)
    ? <div className="event-date">
      <EventDate start={props.dates.sell.start} end={props.dates.sell.end} type="sell"/>
      <EventDate start={props.dates.stay.start} end={props.dates.stay.end} type="stay"/>
    </div>
    : <div className="event-date">
      <EventDate start={props.dates.sell.start} end={props.dates.sell.end} type="sell & stay"/>
    </div>)
}

export default Dates;
