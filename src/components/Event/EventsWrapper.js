import React, {Component} from 'react';
import ReactList from 'react-list';

import Event from './Event';

class EventsWrapper extends Component {

  render() {
    return (<div className={`events-wrapper`}>

      <ReactList
        key={this.props.view}
        itemRenderer={(index, key) => <Event key={key} event={this.props.events[index]} view={this.props.view} handleOpenModal={this.props.handleOpenModal} />}
        length={this.props.events.length}
        type={this.props.view === 'grid'
        ? 'uniform'
        : 'variable'}
      />

    </div>)
  }
}

export default EventsWrapper;
