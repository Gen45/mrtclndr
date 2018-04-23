import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import Draggable from 'react-draggable';
import findIndex from 'lodash/findIndex';

import { _PREV, _NEXT, _ISMOBILE } from '../../config/constants';

import {Trigger} from '../ToolBar/Triggers';
import Event from '../Event/Event';
import OutsideAlerter from './OutsideAlerter';

export const OpenModal = (targetId, events)=> {
  const modalEvent = findIndex(events, ['id', targetId]);
  return {show: true, modalEvent};
};

class Modal extends Component {

  // handleCloseModal = (callback, update) => {
  //   typeof callback === 'function' && callback();
  //   this.props.updateState({modal:{show: false, modalEvent: null}}, update || false);
  // };

  handleCloseModal = () => {
    this.props.updateState({modal:{show: false, modalEvent: null}});
  };

  handleModalNav = (increment) => {
    let newModalEvent = (this.props.modal.modalEvent + increment) % this.props.events.length;
    newModalEvent = newModalEvent < 0
      ? this.props.events.length - 1
      : newModalEvent;
    this.props.updateState({modal:{show: true, modalEvent: newModalEvent}});
  };

  handleToggleStar = (modal) => {
    let starredItems = this.props.starred.items;
    const showStarred = this.props.starred.show;
    const eventId = this.props.events[modal.modalEvent].id;
    const index = starredItems.indexOf(eventId);
    let newModal = modal;

    if(index > -1){
      starredItems.splice(index, 1);
      newModal.modalEvent = showStarred ? (newModal.modalEvent + 1) % starredItems.length : newModal.modalEvent;
      newModal = showStarred && starredItems.length === 0 ? {show: false, modalEvent: null} : newModal;
    } else {
      starredItems.push(eventId);
    }

    this.props.updateState({starred:{items: starredItems, show: showStarred}, modal: newModal}, showStarred);
    // this.props.updateState({starred:{items: starredItems, show: starredItems.length > 0 ? showStarred : false }, closeModal}, showStarred);
  };

  render() {

    const EventForModal = () =>
    <div className="modal-content">
      <Event event={this.props.events[this.props.modal.modalEvent]} view='grid' elevated={true} isModal={true} handleCloseModal={this.props.handleCloseModal} time={this.props.time} />
    </div>

    const handle = 'handle-' + this.props.events[this.props.modal.modalEvent].id;

    return (
      <div className="modal grid-view">
        <OutsideAlerter event={this.handleCloseModal}>
          <Draggable ref={(modalDraggable) => {this.modalDraggableRef = modalDraggable}} disabled={_ISMOBILE()} handle={`.${handle}`} >
            <div className='modal-wrapper'>
                <nav className="modal-nav">
                  <span className={`modal-handle ${handle}`}></span>
                  <Trigger triggerClass="modal-nav-trigger" propState={this.props.starred.items.indexOf(this.props.events[this.props.modal.modalEvent].id) > -1} propStateValue={true} icon='nc-icon-mini nc-icon-mini health_heartbeat-16' payload={() => this.handleToggleStar(this.props.modal)}/>
                  <Trigger triggerClass="modal-nav-trigger" icon='nc-icon-mini arrows-1_minimal-left'
                    payload={() => this.handleModalNav(_PREV)}/>
                  <Trigger triggerClass="modal-nav-trigger" icon='nc-icon-mini arrows-1_minimal-right'
                    payload={() => this.handleModalNav(_NEXT)}/>
                  <Trigger triggerClass="modal-nav-trigger" icon='nc-icon-mini ui-1_simple-remove'
                    payload={() => this.handleCloseModal()}/>
                </nav>
              {
                _ISMOBILE() ?
                <Scrollbars thumbMinSize={100} universal={true} style={{
                    height: 'calc(100vh - 50px)',
                    width: '100vw'
                  }}>
                  <EventForModal />
                </Scrollbars>
                :
                <EventForModal />
              }
            </div>
          </Draggable>
        </OutsideAlerter>
      </div>
    )
  }
};

export default Modal;
