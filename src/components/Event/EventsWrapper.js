import React, {Component} from 'react';
import ReactList from 'react-list';

import Event from './Event';

class EventsWrapper extends Component {

  componentDidUpdate() {
    // console.log(this.ReactListRef.state.size);
  }

  render() {
    return (<div className={`events-wrapper`}>

      { this.props.events.length > 0 ?
        <ReactList ref={(ReactList) => this.ReactListRef = ReactList}
          key={this.props.view}
          itemRenderer={(index, key) => <Event key={key} event={this.props.events[index]} view={this.props.view} handleOpenModal={this.props.handleOpenModal} time={this.props.time} modalEventId={this.props.modalEventId} />}
          length={this.props.events.length}
          type={this.props.view === 'grid'
          ? 'uniform'
          : 'variable'}
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
