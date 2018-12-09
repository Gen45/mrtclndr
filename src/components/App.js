import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import orderBy from 'lodash/orderBy';
import axios from 'axios';

import Loading from './Helpers/Loading';

// STYLES
import '../styles/style.css';
import 'react-tippy/dist/tippy.css';

// DATA
// import eventsData from '../config/eventsData';
import eventsData from '../config/eventsWP';
import defaultState from '../config/defaultState.json';
import base from '../config/base';

// CONSTANTS
import {_LOGO, _ISMOBILE, _BACKGROUNDIMAGES, _WP_URL, _AUTH} from '../config/constants';

// HELPERS
import {getExtreme, getTimeRange, today, _PREVIOUSYEAR, _CURRENTYEAR} from '../helpers/dates';
import {isValid, keyGenerator} from '../helpers/misc';

// LOCAL COMPONENTS
import Header from './Main/Header';
import ToolBar from './ToolBar/ToolBar';
import {MonthBar, MonthLines} from './Main/MonthLines';
import EventsWrapper from './Main/EventsWrapper';
import Sidebar from './Sidebar/Sidebar';
import Modal, {OpenModal} from './Helpers/Modal';
import EnterData from './Main/EnterData';


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
      } else {
        this.preset = this.props.location.state.preset;
      }
    } else {
      this.props.history.push('/login', { from });
    }

    const preset = this.preset || 'ALL';
    this.preset = preset;

    let regions = {};
    regions[preset] = true;
    const state = preset !== 'ALL' ? {...defaultState, regions } : defaultState;

    const localStorageRef = localStorage.getItem('marriott-calendar-' + preset);
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
          if(location.key !== ''){
            const decodedState = JSON.parse(decodeURIComponent(escape(atob(this.state.shortLinks[location.preset][location.key]))));
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

    const newEvents = eventsData();

    newEvents.then((data) => { 
      let regions = {};
      let offers = {};
      let channels = {};
      let brands = {};
      let brandGroups = {};

      for (const r in data.regions) {
        regions[data.regions[r].slug] = data.regions[r];
        regions[data.regions[r].slug].active = true;
      }
      
      for (const r in data.channels) {
        channels[data.channels[r].slug] = data.channels[r];
        channels[data.channels[r].slug].active = true;
      }
      
      for (const r in data.offers) {
        offers[data.offers[r].slug] = data.offers[r];
        offers[data.offers[r].slug].active = true;
      }
      
      for (const r in data.brands) {
        brands[data.brands[r].slug] = data.brands[r];
        brands[data.brands[r].slug].active = true;
      }

      for (const r in data.brandGroups) {
        brandGroups[data.brandGroups[r].slug] = data.brandGroups[r];
        // brandGroups[data.brandGroups[r].slug].active = true;
      }      

      this.events = data.entries;

      this.setState({
        events: data.entries,
        regions,
        offers,
        brands,
        channels,
        brandGroups,
        ready: true
      }); 
      
    });
  }

  componentDidUpdate() {
    const {
      events,
      shortLinks,
      ready,
      ...configurations
    } = this.state;

    this.stateString = JSON.stringify(configurations);
    localStorage.setItem(
      'marriott-calendar-' + this.preset,
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
    let index = Object.values(shortLinks[this.preset]).indexOf(encodedState);
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

  addEntry = () => {

    this.setState({addEntry: !this.state.addEntry});

    const newEntry = {
      campaign_name: 'el title',
      description: 'lorem123'
    }

    console.log('Adding new Entry modal');

    // axios({
    //     method: 'post',
    //     url: _WP_URL + "/wp-json/wp/v2/entry",
    //     auth: _AUTH,
    //     data: {
    //       title: newEntry.campaign_name,
    //       fields: {
    //         "description": "lorem123",
    //         "owner_subregion": 21,
    //         "other_channels": "nono",
    //         "owner": 260,
    //         "campaign_group": 153,
    //         "featured_markets": [
    //           402
    //         ],
    //         "market_scope": 77,
    //         "segment": 74,
    //         "program_type": 158,
    //         "brands": [
    //           33
    //         ],
    //         "dates": {
    //           "multidate": true,
    //           "ongoing": false,
    //           "date": {
    //             "start": null,
    //             "end": null
    //           },
    //           "sell": {
    //             "start": "12/09/2018",
    //             "end": "12/16/2018"
    //           },
    //           "stay": {
    //             "start": "12/16/2018",
    //             "end": "12/16/2018"
    //           }
    //         },
    //         "channels": [
    //           11
    //         ]
    //       },
    //       status: 'publish'
    //     }
    //   }).then(function (response) {
    //     console.log('ta listo', response);
    //   })
    //   .catch(function (error) {
    //     console.log('no ta listo', error);
    //   });
  }

  activeFilter = filterType => Object.keys(filterType).filter((f, i) => filterType[f].active === true);

  prepareEventList = (events, filter, field) => events.filter(e => {
    return e[field].reduce((x, c) => {
      const eventList = x || (this.activeFilter(filter).indexOf(field === 'brands' ? c : c.slug) >= 0)
      return eventList
    }, false)
  });

  updateEventList = (events, update) => {

    // console.log(events);

    const timeRange = getTimeRange(this.state.time);
    const dayOfTheYear = getExtreme([today()]);

    // FILTER BY TIME
    events = events.filter(e => !(e.latestDay < timeRange.earliestDay || e.earliestDay > timeRange.latestDay));
    
    // FILTER BY FILTERS (=O)
    events = Object.keys(this.state.filtersList).reduce((acc, f) => {
      // console.log(f);
      return this.prepareEventList(acc, this.state[f], this.state.filtersList[f].name);
    }, events);
    // console.log(events);
    
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

  render() {

    let time = !_ISMOBILE() ? this.state.time : {...this.state.time, numberOfYears: 1 };
        time = time.Y === (_PREVIOUSYEAR - 1) && (this.state.view === 'timeline' || time.mode !== 'Y') ? {...time, Y: _CURRENTYEAR} : time;

    const appClass = () => {
      return `App ${this.state.sidebar.collapsed ? ' collapsed' : ''}${this.state.modal.show ? ' modal-on' : ''}`
    }

    return (
      <div className={appClass()}>
      { this.state.addEntry && 
        <EnterData 
          brands={this.state.brands}
          regions={this.state.regions}
          offers={this.state.offers}
          brands={this.state.brands}
          channels={this.state.channels}
          brandGroups={this.state.brandGroups}
        />
      }
      <main id="main" className="main" role="main">

        <Header collapsed={this.state.sidebar.collapsed} logout={this.logout} addEntry={this.addEntry} />
        

        <div className="content-frame" style={{backgroundImage: `url(${_BACKGROUNDIMAGES.IMAGES[0]})`}}>
        
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

            <div className={`overlay${this.state.modal.show ? ' active' : ''}`}/>

            <MonthBar time={time} collapsed={this.state.sidebar.collapsed}/>


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
                  modalEventId={isValid(this.state.modal.modalEvent) ? this.state.events[this.state.modal.modalEvent].id : null}
                  modal={this.state.modal}
                  brandsInfo={this.state.brands}
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
            this.state.modal.show && this.state.ready && this.state.events &&
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
      />
    </div>);
  }
}

export default App;