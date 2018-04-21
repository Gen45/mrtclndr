import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import Draggable from 'react-draggable';

import { _PREV, _NEXT, _ISMOBILE } from '../../config/constants';

import Event from '../Event/Event';
import OutsideAlerter from './OutsideAlerter';


class Modal extends Component {

  render() {
    const handle = 'handle-' + this.props.events[this.props.modalEvent].id;

    return (
      <div className="modal grid-view">
            <OutsideAlerter event={this.props.handleCloseModal}>
              <Draggable ref={(modalDraggable) => {this.modalDraggableRef = modalDraggable}} disabled={_ISMOBILE()} handle={`.${handle}`} >
              <div className='modal-wrapper'>
                  <nav className="modal-nav">
                    <span className="modal-nav-trigger prev" onClick={(e) => this.props.handleToggleFav()}>
                      <i className="nc-icon-mini health_heartbeat-16"/>
                    </span>
                    <span className={`modal-handle ${handle}`}></span>
                    <span className="modal-nav-trigger prev" onClick={(e) => this.props.handleModalNav(_PREV)}>
                      <i className="nc-icon-mini arrows-1_minimal-left"/>
                    </span>
                    <span className="modal-nav-trigger next" onClick={(e) => this.props.handleModalNav(_NEXT)}>
                      <i className="nc-icon-mini arrows-1_minimal-right"/>
                    </span>
                    <span className="modal-nav-trigger next" onClick={(e) => this.props.handleCloseModal()}>
                      <i className="nc-icon-mini ui-1_simple-remove"/>
                    </span>
                  </nav>
                {
                  _ISMOBILE() ?
                  <Scrollbars thumbMinSize={100} universal={true} style={{
                      height: 'calc(100vh - 50px)',
                      width: '100vw'
                    }}>
                    <div className="modal-content">
                      <Event ref={(event) => this.modalEventBox = event} event={this.props.events[this.props.modalEvent]} view='grid' elevated={true} modal={this.props.modal} handleCloseModal={this.props.handleCloseModal} time={this.props.time}/>
                    </div>
                  </Scrollbars>
                  :
                  <div className="modal-content">
                    <Event ref={(event) => this.modalEventBox = event} event={this.props.events[this.props.modalEvent]} view='grid' elevated={true} modal={this.props.modal} handleCloseModal={this.props.handleCloseModal} time={this.props.time}/>
                  </div>
                }
              </div>
            </Draggable>
          </OutsideAlerter>
      </div>
    )
  }
};

export default Modal;
