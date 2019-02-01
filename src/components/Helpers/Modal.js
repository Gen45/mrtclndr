import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import Draggable from 'react-draggable';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import axios from 'axios';
import TextareaAutosize from 'react-autosize-textarea';

import { removeSearched } from '../../helpers/misc';
import { _PREV, _NEXT, _ISMOBILE, _WP_URL } from '../../config/constants';
import { today } from '../../helpers/dates';

import {Trigger} from '../ToolBar/Triggers';
import Event from '../Event/Event';
import OutsideAlerter from './OutsideAlerter';

export const OpenModal = (targetId, events)=> {
  const modalEvent = findIndex(events, ['id', targetId]);
  return {show: true, modalEvent};
};

class Modal extends Component {

  componentWillMount() {
    this.setState({ saving: false, editingBrands: false, editingChannels: false, changes: 0, delete: false, valid: true, clone: false, edit: this.props.modal.edit });
  }

  componentDidMount() {
    if (this.props.modal.new && this.props.modal.edit && this.props.modal.modalEvent !== null ) {
      this.handleEdit();
    }
  }

  valid = (valid) => {
    this.setState({valid});
  }

  editBrands = (editingBrands) => {
    this.setState({editingBrands});
  }

  editChannels = (editingChannels) => {
    this.setState({editingChannels});
  }

  handleCloseModal = () => {
    if( !this.state.edit ){
      this.props.updateState({ modal: { show: false, modalEvent: null, edit: false, new: false}});
    }
  }

  auth = () => {
    const token = sessionStorage.getItem(`auth-mrt`);
    if (token) {
      return { 'Authorization': "Bearer " + token }; //JSON.parse(decodeURIComponent(escape(atob(auth))));
    } else {
      this.props.history.push('/login', {});
    }
  }

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

  handleEdit = () => {   
    this.setState({edit:true});
    const eventBackUp = this.props.events[this.props.modal.modalEvent];
    this.eventBackUp = JSON.stringify(eventBackUp);
  }

  handleClone = () => {
    this.setState({edit: true});
    this.saveChanges('', true);
  }

  saveChanges = (id, duplicate) => {

    duplicate === undefined ? false : duplicate;

    id = !this.props.modal.new ? id : ''; 

    if (removeSearched(this.props.events[this.props.modal.modalEvent]['campaign_name']).length > 4) {

      this.setState({ valid: true });

      const self = this;
      const newData = this.props.events[this.props.modal.modalEvent];
      // console.log(id);
      const newActivity = { activity: { date: new Date(), action: duplicate ? 'Cloned' : (id !== '' ? 'Edited' : 'Created'), user: this.props.userId, message: this.state.message } };
      // const activity_log = newData.activity_log !== undefined || id !== '' ? [ ...newData.activity_log, newActivity ] : [newActivity];
      const activity_log = newData.activity_log !== undefined && id !== '' ? [ ...newData.activity_log, newActivity ] : [newActivity];
      // console.log(activity_log);



      this.setState({saving: true, savingMessage: duplicate ? 'Duplicating...' : (id === '' ? 'Creating Entry...' :'Saving Changes...')});

      const noChannelId = find(this.props.channelsInfo, x => x.slug === "no-channel").id;
      const noBrandId = find(this.props.brandsInfo, x => x.slug === "no-brand").id;
      const otherChannelsId = find(this.props.channelsInfo, x => x.slug === "other-channels").id;

      const indexOfNoChannel = newData['channels'].indexOf(noChannelId);
      const indexOfotherChannels = newData['channels'].indexOf(otherChannelsId);
      const indexOfNoBrand = newData['brands'].indexOf(noBrandId);

      if (indexOfNoChannel > -1 && newData['channels'].length > 1) {
        newData['channels'].splice(indexOfNoChannel, 1);
      }

      if (indexOfotherChannels > -1 && newData['otherChannels'] === "") {
        newData['channels'].splice(indexOfotherChannels, 1);
      }

      if (indexOfNoBrand > -1 && newData['brands'].length > 1) {
        newData['brands'].splice(indexOfNoBrand, 1);
      }

      // console.log(duplicate);
      
      const newCampaignName = removeSearched(newData['campaign_name']) + (duplicate !== undefined ? ' (copy)' : ''); 

      axios({
        method: id !== '' ? 'put' : 'post',
        url: _WP_URL + "/wp-json/wp/v2/entry/" + id,
        headers: this.auth(),
        data: {
          title: newCampaignName,
          fields: {
            campaign_name: newCampaignName,
            description: removeSearched(newData['description']).replace(/<br \/>/g, ''),
            dates: {...newData['dates'], ongoing: newData['ongoing']},
            offer: newData['offer'][0]['id'],
            owner_subregion: newData['region'][0]['id'],
            featured_markets: newData['featured_market'].map(x => x.id),
            market_more: newData['market_more'],
            campaign_group: newData['campaign_group'][0]['id'],
            market_scope: newData['market_scope'][0]['id'],
            program_type: newData['program_type'][0]['id'],
            segment: newData['segment'][0]['id'],
            owner: newData['owner'][0]['id'],
            brands: newData['brands'],
            channels: newData['channels'],
            other_channels: removeSearched(newData['otherChannels']),
            landing_page_url: newData['landing_page_url'],
            creative_url: newData['creative_url'],
            activity_log: activity_log,
            original: duplicate ? newData['id'] : null,
            status: true
          },
          status: 'publish'
        }
      }).then(function (response) {

        self.setState({ saving: false, edit: false, editingBrands: false, editingChannels: false });
        self.props.updateState({
          //  order: { sortBy: ["date_modified", "offer[0][\"name\"]", "region[0][\"name\"]"], orderBy: ["desc", "desc", "desc"], groupByType: "modified", orderDirection: "DESCENDING" },
         modal: { new: false, edit: duplicate, show: duplicate }}, true);

        // console.log('success', response);
        self.props.updateEventData( duplicate ? response.data.id : undefined ); // open modal

      })
      .catch(function (error) {
        // console.log('failed', error);
      });    

    } else {
      this.setState({valid: false});
    }

  }
  
  confirmTrashEvent = (id) => {
    this.setState({ delete: true });
  }

  trashEvent = (id) => {
    const self = this;

    this.setState({ saving: true, savingMessage: 'Deleting Entry...'});

    axios({
      method: 'put',
      url: _WP_URL + "/wp-json/wp/v2/entry/" + id,
      headers: this.auth(), 
      data: {
        fields: {
          status: false
        }
      }
    }).then(function (response) {
      self.setState({ saving: false, edit: false, editingBrands: false, editingChannels: false });
      self.props.updateState({ modal: { new: false, edit: false, show: false } }, true);

      // console.log('success', response);
      self.props.updateEventData();
    })
    .catch(function (error) {

      console.log('failed', error);
    });
  }

  cancelEdit = (id) => {
    if (this.eventBackUp !== undefined) {
      this.props.events[this.props.modal.modalEvent] = JSON.parse(this.eventBackUp);
    }
    this.setState({edit:false, editingChannels: false, editingBrands: false});
    if(this.props.modal.new) {
      this.props.updateState({ modal: { new: false, edit: false, show: false }}, true);
    }
  }

  goBack = (cancel) => {
    if (cancel) {
      this.props.events[this.props.modal.modalEvent] = JSON.parse(this.eventBackUp);
    }
    this.setState({editingChannels: false, editingBrands: false});
  }

  render() {

    const EventForModal = () =>
    <div className="modal-content">
        <Event 
          event={this.props.events[this.props.modal.modalEvent]} view='grid' elevated={true} handleCloseModal={this.props.handleCloseModal} time={this.props.time} 
          brandsInfo={this.props.brandsInfo} 
          channelsInfo={this.props.channelsInfo} 
          editable={this.state.edit && !this.state.saving}
          updateState= {this.props.updateState} 
          saveChanges={this.saveChanges}
          offers={this.props.offers}
          regions={this.props.regions}
          featured_markets={this.props.featured_markets}
          campaign_groups={this.props.campaign_groups}
          market_scopes={this.props.market_scopes}
          program_types={this.props.program_types}
          segments={this.props.segments}
          owners={this.props.owners}
          editingBrands={this.state.editingBrands}
          editingChannels={this.state.editingChannels}
          editBrands={this.editBrands}
          editChannels={this.editChannels}
          events={this.props.events}
          isModal={true}
          brandGroups={this.props.brandGroups}
          handleOpenModal={this.props.handleOpenModal}
          valid={this.valid}
          isStarred={this.props.isStarred}
        />
    </div>

    const handle = 'handle-' + this.props.events[this.props.modal.modalEvent].id;
    
    return (
      <div className="modal grid-view">
        <OutsideAlerter event={this.handleCloseModal}>
          <Draggable ref={(modalDraggable) => {this.modalDraggableRef = modalDraggable}} disabled={_ISMOBILE()} handle={`.${handle}`} >
            <div className={`modal-wrapper${this.state.edit ? ' editable' : '' }`}>
              <nav className="modal-nav">

                {
                  !this.state.valid && !this.state.editingBrands && !this.state.editingChannels &&
                  <span className="modal-nav-trigger" style={{ color: '#e4144a', fontSize: 14, fontWeight: 'normal', paddingLeft: 20}}>Please type a campaign name</span>
                }
                
                <Trigger triggerClass="modal-nav-trigger" icon='nc-icon-mini ui-1_trash' text="Delete"
                  disabled={this.props.modal.new || !this.state.edit || this.state.editingBrands || this.state.editingChannels || this.state.saving || this.state.delete} 
                  payload={() => this.confirmTrashEvent()} />
                
                <Trigger triggerClass="modal-nav-trigger" icon='nc-icon-mini ui-1_trash' text="Click again to DELETE"
                  disabled={this.props.modal.new || !this.state.edit || this.state.editingBrands || this.state.editingChannels || this.state.saving || !this.state.delete}
                  payload={() => this.trashEvent(this.props.events[this.props.modal.modalEvent].id)} />
                
                <Trigger disabled={this.state.edit} triggerClass="modal-nav-trigger" propState={this.props.starred.items.indexOf(this.props.events[this.props.modal.modalEvent].id) > -1} propStateValue={true} 
                  icon='nc-icon-outline ui-2_favourite-31' iconActive='nc-icon-mini ui-2_favourite-31' payload={() => this.handleToggleStar(this.props.modal)}/>

                <Trigger triggerClass="modal-nav-trigger" icon='nc-icon-mini design_path-unite' text="Duplicate"
                disabled={!this.props.canEdit || this.state.edit || this.props.modal.new || this.state.editingBrands || this.state.editingChannels || this.state.saving || this.state.delete} 
                payload={() => this.handleClone()} />

                <Trigger triggerClass="modal-nav-trigger" icon='nc-icon-mini arrows-1_tail-left' text='Go Back Without Saving'
                  disabled={!this.state.editingBrands && !this.state.editingChannels}
                  payload={() => this.goBack(true)}
                />
               
                <span className={`modal-handle ${handle}`}></span>     

                <Trigger triggerClass="modal-nav-trigger" icon='nc-icon-mini design_path-unite' text="Save as Copy"
                disabled={true || !this.state.edit || this.props.modal.new || this.state.editingBrands || this.state.editingChannels || this.state.saving || this.state.delete} 
                payload={() => this.handleClone()} />

                <Trigger triggerClass="modal-nav-trigger" icon={this.state.saving ? 'nc-icon-outline arrows-1_refresh-69 circle-anim' : 'nc-icon-mini ui-1_check'}
                 text={this.state.saving ? this.state.savingMessage : 'Save'} 
                  disabled={!this.state.edit || this.state.editingBrands || this.state.editingChannels}
                  payload={() => this.saveChanges(this.props.events[this.props.modal.modalEvent].id)} />
                  
                <Trigger triggerClass="modal-nav-trigger" icon='nc-icon-mini ui-1_simple-remove' text='Cancel' disabled={!this.state.edit || this.state.saving || this.state.editingBrands || this.state.editingChannels}
                  payload={() => this.cancelEdit()} />              
                
                <Trigger disabled={this.state.edit} triggerClass="modal-nav-trigger" icon='nc-icon-mini arrows-1_minimal-left' caption="Previous Entry"
                    payload={() => this.handleModalNav(_PREV)}/>

                <Trigger disabled={this.state.edit} triggerClass="modal-nav-trigger" icon='nc-icon-mini arrows-1_minimal-right' caption="Next Entry"
                    payload={() => this.handleModalNav(_NEXT)}/>
                
                <Trigger triggerClass="modal-nav-trigger" icon='nc-icon-mini ui-1_pencil' caption="Activate Quick edit mode" disabled={this.state.edit || !this.props.canEdit}
                payload={() => this.handleEdit()} />

                <Trigger disabled={this.state.edit} triggerClass="modal-nav-trigger" icon='nc-icon-mini ui-1_simple-remove'
                    payload={() => this.handleCloseModal()}/>

                <Trigger triggerClass="modal-nav-trigger" icon='nc-icon-mini nc-icon-mini ui-1_check' text={`Save ${this.state.editingBrands ? 'Brands' : 'Channels'}`}
                  disabled={!this.state.editingBrands && !this.state.editingChannels}
                  payload={() => this.goBack()}
                />
                    
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
              {
                this.state.edit &&
                <div className="leaveMessage">
                  <TextareaAutosize rows={2} maxRows={4} className="editable-field" placeholder="Leave a Message..." style={{ width: '100%' }}
                    onChange={(e) => this.setState({ message: e.target.value.replace(/<br \/>/g, '') })} />
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
