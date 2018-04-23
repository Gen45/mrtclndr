import React, {Component} from 'react';
import ReactList from 'react-list';

import Event from '../Event/Event';

import {isValid} from '../../helpers/misc';

class EventsWrapper extends Component {

  render() {
    const itemSize = isValid(this.props.events) ? this.props.events.length : 0;
    // console.log('itemsize: ',itemSize);
    return (<div className={`events-wrapper`}>

      { itemSize > 0 ?
        <ReactList ref={(ReactList) => this.ReactListRef = ReactList}
          key={this.props.view}
          itemRenderer={(index, key) => <Event key={this.props.events[index].id} event={this.props.events[index]} view={this.props.view} handleOpenModal={this.props.handleOpenModal} time={this.props.time} modalEventId={this.props.modalEventId} />}
          length={itemSize}
          type={this.props.view === 'grid'
          ? 'uniform'
          : 'variable'}
          useTranslate3d={true}
          pageSize={40}
        /> :
        <p style = {{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -80%)',
          textAlign: 'center',
          opacity: 0.25
        }}>
        <img width={200} src="images/logo.svg" alt="Marriott Logo" style={{display: 'block', margin: '20px auto',}}/>
         There are no entries for the current selection</p>
      }
    </div>)
  }
}

export default EventsWrapper;
