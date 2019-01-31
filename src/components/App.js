import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import orderBy from 'lodash/orderBy';
import axios from 'axios';

import Loading from './Helpers/Loading';

// STYLES
import '../styles/style.css';
import 'react-tippy/dist/tippy.css';

// DATA
import { getMetaData, getLatestEventsData, getFirstEventsData, getRestEventsData } from '../config/eventsWP';
import defaultState from '../config/defaultState.json';
// import base from '../config/base';

// CONSTANTS
import { _LOGO, _ISMOBILE, _BACKGROUNDIMAGES, _WP_URL, _CACHE, _STATE_STRING_MAX_LENGTH, _DEBUG } from '../config/constants';

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

// const _SEARCHABLE = ['campaign_name', 'description', 'owner', 'offer', 'region', 'market_scope', 'market_more', 'program_type', 'campaign_group', 'segment', 'otherChannels']; //'featured_market', 
const _SEARCHABLE = ['campaign_name', 'description', 'owner', 'offer', 'region', 'market_scope', 'market_more', 'featured_market', 'program_type', 'campaign_group', 'segment', 'otherChannels']; 

class App extends Component {

  events = []; 
  metaData = {};
  user = {id: null};

  componentWillMount() {

    this.setState({ ready: false });

    const from = this.props.location.pathname;
    const authenticated = this.props.location.state ? this.props.location.state.isAuthenticated : false;

    const reject = () => {
      this.props.history.push('/login', { from });
      this.readyLoad = false;
    };

    if (authenticated) {
      this.readyLoad = true;
    } else {
      reject();
    }

    if (localStorage.length >= 6) {
      localStorage.clear();
    }
 
    const RefLocalStorage_State = localStorage.getItem('mrt_'+ _CACHE +'_State');
    const RefLocalStorage_Meta = localStorage.getItem('mrt_'+ _CACHE +'_Meta-' + month(today()) + "-" + year(today()));

    if (RefLocalStorage_State === null || RefLocalStorage_Meta === null) {
      this.setState({ ...defaultState });
    } else {
      this.setState({ ...JSON.parse(RefLocalStorage_State) });
    }
  }

  componentDidMount() {

    this.events = [];
    this.metaData = {};

    const self = this;

    // _DEBUG && console.log('calling me');

    if (this.auth() !== undefined) {
      axios({
        method: 'get',
        url: _WP_URL + "/wp-json/wp/v2/users/me",
        headers: this.auth(),
      }).then(function (response) {

        _DEBUG && console.log(response.data.description);
        
        self.user = { id: response.data.id, role: response.data.roles[0], state: response.data.description !== '' && response.data.description.length < _STATE_STRING_MAX_LENGTH ? response.data.description : '{}' };
        // self.user = { id: response.data.id, role: response.data.roles[0], state: '{}' };

        if (self.readyLoad) {

          let RefLocalStorage_Meta = localStorage.getItem('mrt_'+ _CACHE +'_Meta-' + month(today()) + "-" + year(today()));
          let RefLocalStorage_Events = localStorage.getItem('mrt_'+ _CACHE +'_Events-' + month(today()) + "-" + year(today()));
          const RefLocalStorage_State = localStorage.getItem('mrt_'+ _CACHE +'_State');

          // CHECK IF METADATA IS IN STORAGE, IF NOT, DOWNLOAD IT
          if (RefLocalStorage_State === null || RefLocalStorage_Meta === null)  {

            self.user.state = '{}';

            const _metaData = getMetaData();
            let filters = self.state.filtersList;

            _metaData.then(data => {
              
              ['regions', 'offers', 'channels', 'brands', 'featured_markets', 'brand_groups', 'campaign_groups', 'market_scopes', 'program_types', 'segments', 'owners'].forEach(t => {

                self.metaData[t] = {};

                if (filters[t] !== undefined) {
                  filters[t]['items'] = {};
                }

                // _DEBUG && console.log(data)

                for (const i in data[t]) {
                  self.metaData[t][data[t][i].id] = data[t][i];
                  if (filters[t] !== undefined) {
                    filters[t]['items'][data[t][i].id] = { name: data[t][i].name, active: true};
                  }
                }

              });

              self.metaData['brands_data'] = data['brands_data'];

              localStorage.removeItem(
                'mrt_' + (_CACHE - 1) + '_Meta-' + month(today()) + "-" + year(today())
              );

              localStorage.setItem(
                'mrt_'+ _CACHE +'_Meta-' + month(today()) + "-" + year(today()),
                JSON.stringify(self.metaData)
              );
              
              if (RefLocalStorage_Events === null) {

                const eventsData = getFirstEventsData(self.metaData);
                eventsData.then(events => {
                  localStorage.removeItem(
                    'mrt_' + (_CACHE - 1) + '_Events-' + month(today()) + "-" + year(today())
                  );
                  localStorage.setItem(
                    'mrt_'+ _CACHE +'_Events-' + month(today()) + "-" + year(today()),
                    JSON.stringify(events)
                  );
                  self.events = events;
                  const userState = JSON.parse(self.user.state);

                  self.setState({
                    ...self.metaData,
                    ...userState,
                    events: self.events
                  }, () => self.updateEventData());


                  const eventsData = getRestEventsData(self.metaData);
                  eventsData.then(events => {

                    const allEvents = [...self.events, ...events];

                    self.events = allEvents;

                    localStorage.removeItem(
                      'mrt_' + (_CACHE - 1) + '_Events-' + month(today()) + "-" + year(today())
                    );
                    localStorage.setItem(
                      'mrt_' + _CACHE + '_Events-' + month(today()) + "-" + year(today()),
                      JSON.stringify(self.events)
                    );
                    // self.events = events;
                    const userState = JSON.parse(self.user.state);

                    self.setState({
                      ...self.metaData,
                      ...userState,
                      events: self.events
                    }, () => self.updateEventData());
                  });
                });
                
              } else {

                const events = JSON.parse(RefLocalStorage_Events);
                self.events = events;
                const userState = JSON.parse(self.user.state);
                // _DEBUG && console.log(userState)

                self.setState({
                  ...self.metaData,
                  ...userState,
                  events: self.events
                }, () => self.updateEventData());

              }
            });
          } else {

            self.metaData = JSON.parse(RefLocalStorage_Meta);

            if (RefLocalStorage_Events === null) {

                const eventsData = getFirstEventsData(self.metaData);
                eventsData.then(events => {
                  localStorage.removeItem(
                    'mrt_'+ (_CACHE - 1) +'_Events-' + month(today()) + "-" + year(today())
                  );
                  localStorage.setItem(
                    'mrt_' + _CACHE + '_Events-' + month(today()) + "-" + year(today()),
                    JSON.stringify(events)
                  );
                  self.events = events;
                  const userState = JSON.parse(self.user.state);

                  self.setState({ 
                    ...self.metaData,
                    ...userState,
                    events: self.events
                  }, () => self.updateEventData());


                  const eventsData = getRestEventsData(self.metaData);
                  eventsData.then(events => {

                    // console.log( self.events )
                    const allEvents = [...self.events, ...events];
                    // console.log( allEvents );

                    self.events = allEvents;

                    localStorage.removeItem(
                      'mrt_' + (_CACHE - 1) + '_Events-' + month(today()) + "-" + year(today())
                    );
                    localStorage.setItem(
                      'mrt_' + _CACHE + '_Events-' + month(today()) + "-" + year(today()),
                      JSON.stringify(self.events)
                    );

                    // self.events = events;

                    const userState = JSON.parse(self.user.state);

                    self.setState({
                      ...self.metaData,
                      ...userState,
                      events: self.events
                    }, () => self.updateEventData());
                  });
                });

            } else {

              const firstEvents = JSON.parse(RefLocalStorage_Events);

              if (firstEvents.length <= 100 ) {

                const eventsData = getRestEventsData(self.metaData);
                eventsData.then(events => {

                  const allEvents = [...firstEvents, ...events];

                  self.events = allEvents;

                  console.log()

                  localStorage.removeItem(
                    'mrt_' + (_CACHE - 1) + '_Events-' + month(today()) + "-" + year(today())
                  );
                  localStorage.setItem(
                    'mrt_' + _CACHE + '_Events-' + month(today()) + "-" + year(today()),
                    JSON.stringify(self.events)
                  );
                  // self.events = events;
                  const userState = JSON.parse(self.user.state);

                  self.setState({
                    ...self.metaData,
                    ...userState,
                    events: self.events
                  }, () => self.updateEventData());
                });
                

              } else {
                // console.log(JSON.parse(RefLocalStorage_Events).length);
                self.updateEventData();
              }

            }
          }

          // KEEP UPDATING IN THE BACKGROUND
        }

      })
      .catch(function (error) {
        _DEBUG && console.log('failed', error);
      });
    }
  }


  componentDidUpdate() {

    // _DEBUG && console.log('componentDidUpdate');

    const {
      events,
      shortLinks,
      ready,
      modal,
      brands,
      owners,
      regions,
      offers,
      channels,
      brand_groups,
      brands_data,
      featured_markets,
      market_scopes,
      program_types,
      segments,
      campaign_groups,
      ...configurations
    } = this.state;

    const self = this;

    // _DEBUG && console.log(this.events);


    configurations['modal'] = { ...this.state.modal, new: false, edit: false};
    // _DEBUG && console.log(configurations);

    const sameState = this.stateString === JSON.stringify(configurations);
    
    
    if (!sameState) {

      const shareableLink = this.getShareableLink();
      _DEBUG && console.log(shareableLink);
      

      // _DEBUG && console.log(this.stateString);
      _DEBUG && console.log('state changed');

      this.stateString = JSON.stringify(configurations);

      if (this.stateString.length < _STATE_STRING_MAX_LENGTH ) {
        localStorage.removeItem('mrt_'+ (_CACHE - 1) +'_State');
        localStorage.setItem('mrt_'+ _CACHE +'_State', this.stateString);
      } else {
        localStorage.removeItem('mrt_'+ _CACHE +'_State');
      }

      this.ready = false;

      _DEBUG && console.log('calling user', 260);

      axios({
        method: 'put',
        url: _WP_URL + "/wp-json/wp/v2/users/" + this.user.id,
        headers: this.auth(),
        data: {
          description: this.stateString.length < _STATE_STRING_MAX_LENGTH ? this.stateString : ''
        }
      }).then(function (response) {
        self.ready = true;
        // _DEBUG && console.log('success', response.data.description);
        _DEBUG && console.log('success saving user state online');
      }).catch(function (error) {
        _DEBUG && console.log('failed', error);
      });  

      // console.log(this.auth());

      // axios({
      //   method: 'get',
      //   // url: _WP_URL + "/wp-json/acf/v3/options/options/",
      //   url: _WP_URL + "/wp-json/wp/v2/links/",
      //   headers: this.auth(),
      //   // data: {
      //   //   name: 'hola',
      //   //   url: 'jkldsajkldas'
      //   // }
      // }).then(function (response) {
      //   console.log(response);
      // }).catch(function (error) {
      //   console.log(error);
      // });  

    } else {
      _DEBUG && console.log('same state');
    }
  }

  componentWillUnmount() {
    // TODO: cancel eventsData
    this.setState({
      ready: false,
      modal: { edit: false }
    });
    // base.removeBinding(this.firebaseShortLinksref);
  }

  auth = () => {
    const token = sessionStorage.getItem(`auth-${today()}`);
    if (token) {
      return { 'Authorization': "Bearer " + token };
    } else {
      this.props.history.push('/login', {});
    }
  }

  updateEventData = () => {

    // _DEBUG && console.log('updating');
    // this.setState({ready: false});

    const self = this;

    const latestEventsData = getLatestEventsData(10);

    this.setState({refreshing: true});
    
    latestEventsData.then(latestEvents => {
      
      // _DEBUG && console.log(latestEvents)

      let RefLocalStorage_Events = localStorage.getItem('mrt_'+ _CACHE +'_Events-' + month(today()) + "-" + year(today()));
      let RefLocalStorage_Meta = localStorage.getItem('mrt_'+ _CACHE +'_Meta-' + month(today()) + "-" + year(today()));
      this.metaData = JSON.parse(RefLocalStorage_Meta);
      // this.metaData = JSON.parse(atob(RefLocalStorage_Meta));

      this.events = JSON.parse(RefLocalStorage_Events); //.filter(e => e.status);
      let eventsIds = {};


      Object.keys(this.events).forEach(e => { 
        eventsIds[this.events[e].id] = e;
      });
      

      Object.keys(latestEvents).forEach(e => {
        if (eventsIds[latestEvents[e].id] !== undefined) {
          this.events[eventsIds[latestEvents[e].id]] = latestEvents[e];
        } else {
          this.events.push(latestEvents[e]);
        }
      });

      localStorage.removeItem(
        'mrt_' + (_CACHE - 1) + '_Events-' + month(today()) + "-" + year(today())
      );
      localStorage.setItem(
        'mrt_'+ _CACHE +'_Events-' + month(today()) + "-" + year(today()),
        JSON.stringify(this.events)
      );

      this.setState({
        ...JSON.parse( this.state.ready ? this.stateString : this.user.state),
        ...this.metaData,
        events: this.events
      });

      this.setState({refreshing: false});
      // this.updateEventOrder({ sortBy: ['date_modified', 'offer[0]["name"]', 'region[0]["name"]'], orderBy: ["desc", "desc", "desc"], groupByType: 'modified', orderDirection: 'DESCENDING' });
      
    }).then( () => {

      self.updateEventList(self.events, true);
      self.setState({
        ready: true
      });

    });
  };

  getShareableLink = () => {
    const encodedState = btoa(this.stateString);
    let shortLinks = this.state.shortLinks;
    shortLinks = isValid(shortLinks)
      ? shortLinks
      : {};
    let index = Object.keys(shortLinks).map(itm => shortLinks[itm]).indexOf(encodedState);

    let key = '';
    if (index < 0) {
      do {
        key = keyGenerator(5);
      } while (isValid(shortLinks[key]));

      shortLinks[key] = encodedState;
      this.setState({shortLinks})
    } else {
      key = Object.keys(shortLinks)[index];
    }
    return {key};
  };

  logout = () => this.props.history.push('/login', {});

  help = () => this.props.history.push('/help', {});

  activeFilter = filterType => Object.keys(filterType).filter((f, i) => filterType[f].active === true);

  prepareEventList = (events, filter, field) => events.filter(e => {
    // _DEBUG && console.log(e, field, e[field]);
    return e[field].reduce((x, c) => {
      // _DEBUG && console.log(typeof e[field][0], field)
      const eventList = x || (this.activeFilter(filter).indexOf(typeof e[field][0] === 'number' ? c.toString() : c.id.toString()) >= 0)
      return eventList
    }, false)
  });

  updateEventList = (events, update) => {

    _DEBUG && console.log('updateEventList'); 

    const timeRange = getTimeRange(this.state.time);
    const dayOfTheYear = getExtreme([today()]);

    // FILTER BY STATUS
    events = events.filter(e => e.status); 

    // FILTER BY TIME
    events = events.filter(e => !(e.latestDay < timeRange.earliestDay || e.earliestDay > timeRange.latestDay));
    
    // FILTER BY FILTERS (=O)
    events = Object.keys(this.state.filtersList).reduce((acc, f) => {
      const result = this.prepareEventList(acc, this.state.filtersList[f].items, this.state.filtersList[f].name);
      return result;
    }, events);

    // FILTER BY VIGENCY
    events = !this.state.vigency.past ? events.filter(e => !(e.latestDay < dayOfTheYear)) : events;
    events = !this.state.vigency.between ? events.filter(e => !(e.latestDay >= dayOfTheYear && e.earliestDay <= dayOfTheYear)) : events;
    events = !this.state.vigency.future ? events.filter(e => !(e.earliestDay > dayOfTheYear)) : events;
    
    // FILTER BY STARRED
    events = this.state.starred.show ? events.filter(e => this.state.starred.items.indexOf(e.id) > -1) : events;

    // FILTER BY KEYWORDS
    if (this.state.search.active && isValid(this.state.search.term)){
      
      events = events.filter(e => {
        const toSearch = this.state.search.term;
        let o = {};
        _SEARCHABLE.forEach(x => 
          typeof e[x] === 'string'
            ? o[x] = e[x]
            : o[x] = e[x][0].name);
        // console.log(o);
        // const o = { campaign_name: e.campaign_name, description: e.description, owner: e.owner[0].name };
        const result = Object.keys(o).filter(i => o[i].toLowerCase().indexOf(toSearch.toLowerCase()) !== -1)
        return result.length > 0;
      }).map( e => {
        // console.log(e);
        
        const toSearch = this.state.search.term;
        const toReplace = new RegExp(toSearch, "gi"); 
        // console.log(e)
        // const o = { campaign_name: e.campaign_name, description: e.description, owner: e.owner };
        let o = {};
        _SEARCHABLE.forEach(x => o[x] = e[x]);
        Object.keys(o).forEach( i => {
          // console.log(typeof o[i], i);
          if( typeof o[i] === 'string') {
            o[i] = o[i].replace(toReplace, x => `<b class="searched">${x}</b>`);
          } else {
            const newName = o[i][0]['name'];
            o[i][0]['name'] = newName.replace(toReplace, x => `<b class="searched">${x}</b>`);
          }
          // console.log(e, o);
          e = { ...e, ...o };
        });
        // console.log(e);
        return e;
      });
    }

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
    this.events = JSON.parse(localStorage.getItem('mrt_'+ _CACHE +'_Events-' + month(today()) + "-" + year(today()))).filter(e => e.status);
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
    let filtersList = this.state.filtersList;
    filtersList[filterName]['items'][filter]['active'] = active;

    this.setState({ filtersList: filtersList }, () => {
        this.updateEventList(this.events);
    });
  };

  batchChange = (filterName, active) => {
    let filtersList = this.state.filtersList;

    for (let filter in filtersList[filterName].items ) {
      filtersList[filterName].items[filter].active = active;
    }

    this.setState({ filtersList }, () => this.updateEventList(this.events));
  };

  handleOpenModal = (targetId) => {
    this.setState({modal:{ ...OpenModal(targetId, this.state.events)}});
  }

  isStarred = (id) => {
    return this.state.starred.items.indexOf(id) > -1;
  }

  addEntry = () => {

    let currentEvents = this.state.events;

    const newEvent= { 
      id: Date.now(),
      campaign_name: "",
      description: "",
      region: [{id:0, name: 'select', color: '#222'}],
      offer: [{id:0, name: 'select', color: '#222'}],
      featured_market: [{id:0, name: 'select'}], 
      market_more: "", 
      market_scope: [{ id: 437, name: 'select'}], 
      campaign_group: [{id:0, name: 'select'}], 
      program_type: [{id:0, name: 'select'}], 
      segment: [{id:0, name: 'select'}], 
      owner: [{id:0, name: 'select'}], 
      brands: [],
      channels: [],
      other_channels: "",
      dates: {
        sell: { start: "", end: ""},
        stay: { start: "", end: ""}
      }
    };

    currentEvents.push(newEvent);
    this.setState({events: currentEvents, modal: {modalEvent: currentEvents.length - 1, show: true, edit: true, new: true}});
  }
  
  canEdit = (user) => ['editor', 'author', 'administrator'].indexOf(user.role) > -1;

  canCreate = (user) => ['author', 'editor', 'administrator'].indexOf(user.role) > -1;

  handleResetFilters = () => {

    let newfiltersList = this.state.filtersList;

    Object.keys(this.state.filtersList).forEach(x => {
      Object.keys(this.state.filtersList[x].items).forEach(y => {
        newfiltersList[x].items[y].active = true;
      })
    })

    this.updateState({ ...this.state, ...defaultState, order: this.state.order, view: this.state.view, filtersList: newfiltersList, starred: {items: this.state.starred.items, show: false} }, true);
  }

  handleRefreshCache = () => {
    localStorage.removeItem('mrt_' + (_CACHE) + '_Meta-'   + month(today()) + "-" + year(today()) );
    localStorage.removeItem('mrt_' + (_CACHE) + '_State', this.stateString);
    window.location.reload();
  }

  render() {

    // _DEBUG && console.log(this.state.filtersList);

    let time = !_ISMOBILE() ? this.state.time : {...this.state.time, numberOfYears: 1 };
        time = time.Y === (_PREVIOUSYEAR - 1) && (this.state.view === 'timeline' || time.mode !== 'Y') ? {...time, Y: _CURRENTYEAR} : time;

    const appClass = (collapsed, show) => {
      return `App ${collapsed ? ' collapsed' : ''}${show ? ' modal-on' : ''}`
    }

    return (

      <div>

      {
      this.state.ready && this.state.events !== [] ?

      <div className={appClass(this.state.sidebar.collapsed || '', this.state.modal.show || '')}>

      <main id="main" className="main" role="main" style={{ backgroundImage: `url(${_BACKGROUNDIMAGES.IMAGES[0]})` }}>
        <Header collapsed={this.state.sidebar.collapsed} logout={this.logout} addEntry={this.addEntry} canCreate={this.canCreate(this.user)} />
        
        <div className="content-frame">
        
          <div className={`content ${this.state.view}-view`}>

            {
             (this.state.refreshing || this.events.length <= 100) &&
              <div className="refreshing">
              </div>
            }

            <div className="more-tools">
              {
                this.canEdit(this.user) && this.canCreate(this.user) &&
                <span onClick={() => window.open('https://marriottcalendar.com/backend/wp-admin', '_blank')}> <i className="nc-icon-mini media-2_knob"></i> Admin</span>
              }
              {
              this.canEdit(this.user) && this.canCreate(this.user) &&
               "|"
              }   
              {// <span onClick={e => console.log(this.getShareableLink())}> <i className="nc-icon-mini ui-2_share-bold"></i> Copy Link</span>|
              }
              <span onClick={e => this.handleRefreshCache()}> <i className="nc-icon-mini arrows-e_refresh-20"></i> Reload</span> 
              <span onClick={e => this.handleResetFilters()}> <i className="nc-icon-mini arrows-e_refresh-19"></i> Reset Filters</span> 
              <span onClick={() => window.open('/Help', '_blank')}><i className="nc-icon-mini ui-e_round-e-help"></i> Help</span>
            </div>

            <ToolBar
              time={time}
              updateState={this.updateState}
              view={this.state.view}
              groupByType={this.state.order.groupByType}
              orderDirection={this.state.order.orderDirection} 
              sortBy={this.state.order.sortBy} 
              orderBy={this.state.order.orderBy}
              vigency={this.state.vigency}
              updateEventOrder={this.updateEventOrder}
              starred={this.state.starred}
              search={this.state.search}
              getShareableLink={this.getShareableLink}
              sidebarCollapse={this.state.sidebar.collapsed}
              allEvents={this.events}
              events={this.state.events}
              helpers={{brands: this.state.brands, channels: this.state.channels}}
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
                  modalEventId={isValid(this.state.events[this.state.modal.modalEvent]) ? this.state.events[this.state.modal.modalEvent].id : null}
                  modal={isValid(this.state.events[this.state.modal.modalEvent]) ? this.state.modal : {show: false}}
                  brandsInfo={this.state.brands}
                  channelsInfo={this.state.channels}
                  isStarred={this.isStarred}
                  handleResetFilters={this.handleResetFilters}
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
              handleOpenModal={this.handleOpenModal}
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
              history={this.props.history}
              updateEventData={this.updateEventData}
              canEdit={this.canEdit(this.user)}
              userId={this.user.id}
              brandGroups={this.state.brand_groups}
              isStarred={this.isStarred}
            />
          }
        </div>
      </main>

      <Sidebar 
        regions={this.state.regions}
        brands={this.state.brands}
        brand_groups={this.state.brand_groups}
        offers={this.state.offers}
        owners={this.state.owners}
        channels={this.state.channels}
        updateFilter={this.updateFilter}
        collapsed={this.state.sidebar.collapsed || false}
        updateState={this.updateState}
        ready={this.state.ready}
        batchChange={this.batchChange}
        disabled={this.state.modal.show && isValid(this.state.events[this.state.modal.modalEvent])}
        filtersList={this.state.filtersList}
        events={this.events}
        smartFilters={this.events.length > 100}
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