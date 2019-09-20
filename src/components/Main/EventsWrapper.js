import React, {Component} from 'react';
import ReactList from 'react-list';

import Event from '../Event/Event';

import {isValid} from '../../helpers/misc';
import {_LOGO} from '../../config/constants';

class EventsWrapper extends Component {

  render() {
    const itemSize = isValid(this.props.events) ? this.props.events.length : 0;
    // console.log('itemsize: ',itemSize);
    // console.log(this.props.events);
    return (<div className={`events-wrapper`}>

      { itemSize > 0 
      ?
        <ReactList ref={(ReactList) => this.ReactListRef = ReactList} key={this.props.view} 
          itemRenderer={(index, key) => 
            <Event 
              key={key} 
              event={this.props.events[index]} 
              events={this.props.events} 
              isModal={false}
              view={this.props.view} 
              handleOpenModal={this.props.handleOpenModal} 
              time={this.props.time} 
              modalEventId={this.props.modalEventId} 
              brandsInfo={this.props.brandsInfo} 
              isStarred={this.props.isStarred}
              channelsInfo={this.props.channelsInfo}  
              cala={this.props.cala}
            />
          } 
          length={itemSize} 
          type={this.props.view === 'grid' ? 'uniform' : 'variable'} 
          useTranslate3d={true} 
          pageSize={40} 
        /> 
      :
        <div style = {{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -80%)',
          textAlign: 'center'
        }}>
          <img width={200} src={_LOGO.URL} alt={_LOGO.ALT} style={{display: 'block', margin: '20px auto', opacity: 0.5}} />
          <p style={{opacity: 0.5}}>There are no entries for the current selection</p>
          <p style={{ opacity: 1, cursor: 'pointer' }} onClick={(e) => this.props.handleResetFilters() }>Reset Filters</p>

        </div>
      }
    </div>)
  }
}

export default EventsWrapper;
