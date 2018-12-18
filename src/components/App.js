import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import orderBy from 'lodash/orderBy';
import axios from 'axios';

import Loading from './Helpers/Loading';

// STYLES
import '../styles/style.css';
import 'react-tippy/dist/tippy.css';

// DATA
import eventsData from '../config/eventsWP';
import oneEvent from '../config/oneEvent';
import defaultState from '../config/defaultState.json';
import base from '../config/base';

// CONSTANTS
import {_LOGO, _ISMOBILE, _BACKGROUNDIMAGES
  , _WP_URL, _AUTH
} from '../config/constants';

// HELPERS
import {getExtreme, getTimeRange, today, month, year, _PREVIOUSYEAR, _CURRENTYEAR} from '../helpers/dates';
import {isValid, keyGenerator} from '../helpers/misc';

// LOCAL COMPONENTS
import Header from './Main/Header';
import ToolBar from './ToolBar/ToolBar';
import {MonthBar, MonthLines} from './Main/MonthLines';
import EventsWrapper from './Main/EventsWrapper';
import Sidebar from './Sidebar/Sidebar';
import Modal, {OpenModal} from './Helpers/Modal';


class App extends Component {

  events = [];
  
  componentWillMount() {

    this.setState({ ready: false });

    const from = this.props.location.pathname;
    let location = this.props.location.state;
    // console.log(location);

    if(isValid(this.props.location.state)) {
      if(this.props.location.state.isAuthenticated === false) {
        this.props.history.push('/login', { from });
        this.readyLoad = false;
      } else {
        this.preset = this.props.location.state.preset;
        this.readyLoad = true;
      }
    } else {
      this.props.history.push('/login', { from });
      this.readyLoad = false;
    }

    const preset = this.preset || 'ALL';
    this.preset = preset;

    let regions = {};
    regions[preset] = true;
    // const state = preset !== 'ALL' ? {...defaultState, regions } : defaultState;
    const state = defaultState;

    const localStorageRef = localStorage.getItem('marriott-calendar-' + preset + "-" + month(today()) + "-" + year(today()));
    if (localStorageRef) {
      this.stateString = localStorageRef;
      this.setState({...JSON.parse(localStorageRef)}, () => this.updateEventList(this.events), false);
    } else {
      this.setState({...state}, () => this.updateEventList(this.events), false);
    }

    this.firebaseShortLinksref = base.syncState('shortLinks', {
      context: this,
      state: "shortLinks",
      then() {
        // console.log(location, this.state.shortLinks, this.state.shortLinks);
        let decodedState;
          if(location.key !== ''){
            
            try {
              decodedState = JSON.parse(decodeURIComponent(escape(atob(this.state.shortLinks[location.preset][location.key]))))
            } catch (ex) {
              decodedState = {};
            }
            // const decodedState = JSON.parse(decodeURIComponent(escape(atob(this.state.shortLinks[location.preset][location.key])))) || {};
            // console.log(decodedState);
            // this.updateState({...this.state.events, decodedState}, true);
            this.updateState({...this.state, ...decodedState}, true);
          } else {
            // this.updateState({ready: true}, true);
          }
      }
    });
  }

  componentWillUnmount() {
    // TODO: cancel eventsData
    this.setState({
      ready: false
    });
    base.removeBinding(this.firebaseShortLinksref);
  }

  componentDidMount() {

    if (this.readyLoad) {

      const newEvents = eventsData();

      newEvents.then((data) => { 
        let regions = {};
        let offers = {};
        let channels = {};
        let brands = {};
        let featured_markets = {};
        let brandGroups = {};
        let campaign_groups = {};
        let market_scopes = {};
        let program_types = {};
        let segments = {};
        let owners = {};

        for (const r in data.regions) {
          if (this.preset === 'ALL') {
            regions[data.regions[r].id] = data.regions[r];
            regions[data.regions[r].id].active = this.state.regions !== undefined ? this.state.regions[data.regions[r].id].active : true;
          } else {
            if (data.regions[r].id === this.preset.toLowerCase()) {
              regions[data.regions[r].id] = data.regions[r];
              regions[data.regions[r].id].active = this.state.regions !== undefined ? this.state.regions[data.regions[r].id].active : true;
            }
          }
        }
        
        for (const r in data.channels) {
          channels[data.channels[r].id] = data.channels[r];
          channels[data.channels[r].id].active = this.state.channels !== undefined ? this.state.channels[data.channels[r].id].active : true;
        }
        
        for (const r in data.offers) {
          offers[data.offers[r].id] = data.offers[r];
          offers[data.offers[r].id].active = this.state.offers !== undefined ? this.state.offers[data.offers[r].id].active : true;
        }
        
        for (const r in data.brands) {
          brands[data.brands[r].id] = data.brands[r];
          brands[data.brands[r].id].active = this.state.brands !== undefined ? this.state.brands[data.brands[r].id].active : true;
        }

        for (const r in data.brandGroups) {
          brandGroups[data.brandGroups[r].id] = data.brandGroups[r];
        }  
                
        for (const r in data.featured_markets) {
          featured_markets[data.featured_markets[r].id] = data.featured_markets[r];
        }  

        for (const r in data.campaign_groups) {
          campaign_groups[data.campaign_groups[r].id] = data.campaign_groups[r];
        }  

        for (const r in data.market_scopes) {
          market_scopes[data.market_scopes[r].id] = data.market_scopes[r];
        }  

        for (const r in data.program_types) {
          program_types[data.program_types[r].id] = data.program_types[r];
        }  

        for (const r in data.segments) {
          segments[data.segments[r].id] = data.segments[r];
        }  

        for (const r in data.owners) {
          owners[data.owners[r].id] = data.owners[r];
        }  

        this.events = data.entries;

        this.setState({
          events: data.entries,
          regions,
          offers,
          brands,
          channels,
          brandGroups,
          featured_markets,
          campaign_groups,
          market_scopes,
          program_types,
          segments,
          owners,
          ready: true
        });
        this.updateEventList(this.events, true);
      });
    }
  }

  componentDidUpdate() {
    const {
      events,
      shortLinks,
      ready,
      addEntry,
      ...configurations
    } = this.state;

    this.stateString = JSON.stringify(configurations);
    localStorage.setItem(
      'marriott-calendar-' + this.preset + "-" + month(today()) + "-" + year(today()),
      this.stateString
    );

    if(this.state.shortLinks) {
      const to = this.getShareableLink();
      if (to.key !== this.props.location.state.key){
        this.props.history.push(to.path, {isAuthenticated: true, preset: to.preset, key: to.key});
      }
    }
  }

  getShareableLink = () => {
    const encodedState = btoa(this.stateString);
    let shortLinks = this.state.shortLinks;
    shortLinks[this.preset] = isValid(shortLinks[this.preset])
      ? shortLinks[this.preset]
      : {};
    let index = Object.keys(shortLinks[this.preset]).map(itm => shortLinks[this.preset][itm]).indexOf(encodedState);

    let key = '';
    if (index < 0) {
      do {
        key = keyGenerator(5);
      } while (isValid(shortLinks[this.preset][key]));

      shortLinks[this.preset][key] = encodedState;
      this.setState({shortLinks})
    } else {
      key = Object.keys(shortLinks[this.preset])[index];
    }
    return {path: `/${this.preset.toLowerCase()}/${key}`, preset: this.preset, key: key} ;
  };

  logout = () => this.props.history.push('/login', {});

  activeFilter = filterType => Object.keys(filterType).filter((f, i) => filterType[f].active === true);

  prepareEventList = (events, filter, field) => events.filter(e => {
    return e[field].reduce((x, c) => {
      const eventList = x || (this.activeFilter(filter).indexOf(field === 'brands' || field === 'channels' ? c.toString() : c.id.toString()) >= 0)
      return eventList
    }, false)
  });

  updateEventList = (events, update) => {

    const timeRange = getTimeRange(this.state.time);
    const dayOfTheYear = getExtreme([today()]);

    // FILTER BY TIME
    events = events.filter(e => !(e.latestDay < timeRange.earliestDay || e.earliestDay > timeRange.latestDay));
    
    // FILTER BY FILTERS (=O)
    events = Object.keys(this.state.filtersList).reduce((acc, f) => {
      const result = this.prepareEventList(acc, this.state[f], this.state.filtersList[f].name);
      return result;
    }, events);

    
    // FILTER BY VIGENCY
    events = !this.state.vigency.past ? events.filter(e => !(e.latestDay < dayOfTheYear)) : events;
    events = !this.state.vigency.between ? events.filter(e => !(e.latestDay >= dayOfTheYear && e.earliestDay <= dayOfTheYear)) : events;
    events = !this.state.vigency.future ? events.filter(e => !(e.earliestDay > dayOfTheYear)) : events;
    // console.log(events);
    
    // FILTER BY STARRED
    events = this.state.starred.show ? events.filter(e => this.state.starred.items.indexOf(e.id) > -1) : events;
    // console.log(events);

    // ORDER
    events = orderBy(events, this.state.order.sortBy, this.state.order.orderBy);

    // SHOULD UPDATE?
    if (update === false ? false : true) {
      this.updateState({events}, false);
    }

    // RETURN NUMBER OF EVENTS
    return events.length;
  };

  updateEventOrder = (newOrder) => {
    let events = orderBy(this.state.events, newOrder.sortBy, newOrder.orderBy);
    this.setState({
      events,
      order: {
        ...this.state.order,
        ...newOrder
      }
    });
  };

  updateState = (newState, updateEvents) => {
    this.setState({
      ...this.state,
      ...newState
    }, () => {
      if (updateEvents) {
        this.updateEventList(this.events);
      }
    });
  };

  updateFilter = (filter, filterName, active) => {
    let filters = this.state[filterName];
    // console.log(filter, filterName, active, filters);
    filters[filter].active = active;
    this.updateEventList(this.events);
  };

  batchChange = (filterName, active) => {
    let filters = this.state[filterName];
    let newState = {};
    newState[filterName] = filters;
    // console.log(newState);
    for (let filter in filters) {
      newState[filterName][filter]["active"] = active;
    }
    // console.log({newState});
    this.updateState(newState, true);
  };

  handleOpenModal = (targetId) => {
    this.setState({modal:{ ...OpenModal(targetId, this.state.events)}});
  }

  addEntry = () => {

    let currentEvents = this.state.events;

    const newEvent= { 
      id: 0,
      campaignName: 'Campaign Name',
      description: 'Description',
      region: [{id:0, name: '', color: '#000'}],
      offer: [{id:0, name: '', color: '#000'}],
      featured_market: [{id:0, name: ''}], 
      market_scope: [{id:0, name: ''}], 
      campaign_group: [{id:0, name: ''}], 
      program_type: [{id:0, name: ''}], 
      segment: [{id:0, name: ''}], 
      owner: [{id:0, name: ''}], 
      brands: [],
      channels: [],
      otherChannels: "",
      dates: {
        sell: { start: today(), end: today()},
        stay: { start: today(), end: today()}
      }
    };

    currentEvents.push(newEvent);

    this.setState({events: currentEvents, modal: {modalEvent: currentEvents.length - 1, show: true, edit: true, new: true}});

    // var self = this;
    // this.setState({saving: true});

    // axios({
    //   method: 'post',
    //   url: _WP_URL + "/wp-json/wp/v2/entry/",
    //   auth: _AUTH,
    //   data: {
    //     title: 'New Entry',
    //     status: 'publish'
    //   }
    // }).then(function (response) {
    //   self.setState({ saving: false, edit: false });
    //   console.log('success', response);
    //   // modalEventId: 
    //   console.log(response.data.id);

    //   const newEntry = oneEvent(response.data);

    //   newEntry.then((data) => {
    //     console.log(data);
    //     const events = [...self.state.events, data];
    //     const modal = {modalEvent : events.length - 1, show: true};
    //     self.setState({ events });
    //     self.setState({ modal });
    //   });
    // })
    // .catch(function (error) {
    //   console.log('failed', error);
    // });   

  }

  render() {
    let time = !_ISMOBILE() ? this.state.time : {...this.state.time, numberOfYears: 1 };
        time = time.Y === (_PREVIOUSYEAR - 1) && (this.state.view === 'timeline' || time.mode !== 'Y') ? {...time, Y: _CURRENTYEAR} : time;

    const appClass = () => {
      return `App ${this.state.sidebar.collapsed ? ' collapsed' : ''}${this.state.modal.show ? ' modal-on' : ''}`
    }

    return (

      <div>

      {
      this.state.ready && this.state.events !== [] ?

      <div className={appClass()}>

      <main id="main" className="main" role="main" style={{ backgroundImage: `url(${_BACKGROUNDIMAGES.IMAGES[0]})` }}>
        <Header collapsed={this.state.sidebar.collapsed} logout={this.logout} addEntry={this.addEntry} />
        
        <div className="content-frame">
        
          <div className={`content ${this.state.view}-view`}>

            <ToolBar
              time={time}
              updateState={this.updateState}
              view={this.state.view}
              groupByType={this.state.order.groupByType}
              orderDirection={this.state.order.orderDirection} sortBy={this.state.order.sortBy} orderBy={this.state.order.orderBy} vigency={this.state.vigency}
              updateEventOrder={this.updateEventOrder}
              starred={this.state.starred}
              search={this.state.search}
              getShareableLink={this.getShareableLink}
              sidebarCollapse={this.state.sidebar.collapsed}
            />

            <div className={`overlay${this.state.modal.show && isValid(this.state.events[this.state.modal.modalEvent]) ? ' active' : ''}`}/>

            { this.state.ready &&
            <MonthBar time={time} collapsed={this.state.sidebar.collapsed}/>
            }

              <div className="nano">
              <MonthLines time={time}/>
              <Scrollbars thumbMinSize={100} universal={true} style={{
                  height: '100%'
                }} autoHide={true}>
              {
                this.state.ready && this.state.events !== [] ?
                <EventsWrapper
                  events={this.state.events}
                  view={this.state.view}
                  handleOpenModal={this.handleOpenModal}
                  time={time}
                  //modalEventId={isValid(this.state.modal.modalEvent) ? this.state.events[this.state.modal.modalEvent].id : null}
                  modalEventId={isValid(this.state.events[this.state.modal.modalEvent]) ? this.state.events[this.state.modal.modalEvent].id : null}
                  //modal={this.state.modal}
                  modal={isValid(this.state.events[this.state.modal.modalEvent]) ? this.state.modal : {show: false}}
                  brandsInfo={this.state.brands}
                  channelsInfo={this.state.channels}
                /> :
                <Loading>
                  <span>
                    <img width={200} src={_LOGO.URL} alt={_LOGO.ALT} style={{display: 'block', margin: '20px auto',}}/>
                    <span>Loading</span>
                  </span>
                </Loading>

              }
              </Scrollbars>
            </div>
          </div>
        
          {
            this.state.modal.show && this.state.ready && this.state.events && isValid(this.state.events[this.state.modal.modalEvent]) && 
            <Modal
              ref={(Modal) => {this.ModalRef = Modal}}
              modalPosition={this.state.modal.position}
              handleCloseModal={this.handleCloseModal}
              handleModalNav={this.handleModalNav}
              handleToggleStar={this.handleToggleStar}
              modal={this.state.modal}
              events={this.state.events}
              time={time}
              updateState={this.updateState}
              starred={this.state.starred}
              brandsInfo={this.state.brands}
              channelsInfo={this.state.channels}
              offers={this.state.offers}
              regions={this.state.regions}
              featured_markets={this.state.featured_markets}
              campaign_groups={this.state.campaign_groups}
              market_scopes={this.state.market_scopes}
              program_types={this.state.program_types}
              segments={this.state.segments}
              owners={this.state.owners}
            />
          }
        </div>
      </main>

      <Sidebar 
        regions={this.state.regions}
        brands={this.state.brands}
        brandGroups={this.state.brandGroups}
        offers={this.state.offers}
        channels={this.state.channels}
        updateFilter={this.updateFilter}
        collapsed={this.state.sidebar.collapsed || false}
        updateState={this.updateState}
        ready={this.state.ready}
        batchChange={this.batchChange}
        disabled={this.state.modal.show}
      />
    </div>
    :
      <Loading>
        <span>
          <img className="pulse" width={200} src={_LOGO.URL} alt={_LOGO.ALT} style={{display: 'block', margin: '20px auto',}}/>
          <span>Loading... please wait</span>
        </span>
      </Loading>

    }
    </div> 
    
    );
  }
}

export default App;