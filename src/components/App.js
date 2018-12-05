import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import orderBy from 'lodash/orderBy';
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
import {_LOGO, _ISMOBILE, _BACKGROUNDIMAGES} from '../config/constants';

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


class App extends Component {

  events = [];
  
  componentWillMount() {

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
            this.updateState({...this.state, ...decodedState, ready: true}, true);
          } else {
            this.updateState({ready: true}, true);
          }
      }
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.firebaseShortLinksref);
  }

  componentDidMount() {

    const newEvents = eventsData();
    newEvents.then((data) => { 
      let regions = {};
      let offers = {};
      let channels = {};
      let brands = {};


      for (const r in data.regions) {
        regions[data.regions[r].slug] = data.regions[r];
        // regions[data.regions[r].slug].active = true;
      }
      for (const r in data.channels) {
        channels[data.channels[r].slug] = data.channels[r];
        // channels[data.channels[r].slug].active = true;
      }
      for (const r in data.offers) {
        offers[data.offers[r].slug] = data.offers[r];
        // offers[data.offers[r].slug].active = true;
      }
      for (const r in data.brands) {
        brands[data.brands[r].slug] = data.brands[r];
        // brands[data.brands[r].slug].active = true;
      }

      this.setState({ 
        events: data.entries,
        regions,
        offers,
        brands,
        channels
     }); 

      this.events = data.entries;
      
    });
  }

  componentDidUpdate() {

    const {
      events,
      shortLinks,
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

  activeFilter = filterType => Object.keys(filterType).filter((f, i) => filterType[f].active === true);

  prepareEventList = (events, filter, field) => events.filter(e => {
    console.log(events, e, filter, field);
    const fieldArr = Object.keys(e[field]);
    // console.log(fieldArr);
    return e[field].reduce((x, c) => {
      console.log(this.activeFilter(filter), c.slug);
      const bla = x || (this.activeFilter(filter).indexOf(c.slug) >= 0)
      return bla
    }, false)
    // return e[field].reduce((x, c) => x || (this.activeFilter(filter).indexOf(c) >= 0), false)
  });

  updateEventList = (events, update) => {

    // console.log(events);

    const timeRange = getTimeRange(this.state.time);
    const dayOfTheYear = getExtreme([today()]);

    // FILTER BY TIME
    events = events.filter(e => !(e.latestDay < timeRange.earliestDay || e.earliestDay > timeRange.latestDay));
    // console.log(events);
    
    // FILTER BY FILTERS (=O)
    events = Object.keys(this.state.filtersList).reduce((acc, f) => this.prepareEventList(acc, this.state[f], this.state.filtersList[f].name), events);
    console.log(events);
    
    // FILTER BY VIGENCY
    events = !this.state.vigency.past ? events.filter(e => !(e.latestDay < dayOfTheYear)) : events;
    events = !this.state.vigency.between ? events.filter(e => !(e.latestDay >= dayOfTheYear && e.earliestDay <= dayOfTheYear)) : events;
    events = !this.state.vigency.future ? events.filter(e => !(e.earliestDay > dayOfTheYear)) : events;
    console.log(events);
    
    // FILTER BY STARRED
    events = this.state.starred.show ? events.filter(e => this.state.starred.items.indexOf(e.id) > -1) : events;
    console.log(events);

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
      <main id="main" className="main" role="main">

        <Header collapsed={this.state.sidebar.collapsed} logout={this.logout} />

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
                /> :
                <Loading>
                  <span>
                    <img width={200} src={_LOGO.URL} alt={_LOGO.ALT} style={{display: 'block', margin: '20px auto',}}/>
                     Loading
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
            />
          }
        </div>
      </main>

      <Sidebar regions={this.state.regions} brands={this.state.brands} offers={this.state.offers} channels={this.state.channels} updateFilter={this.updateFilter} collapsed={this.state.sidebar.collapsed || false} updateState={this.updateState} ready={this.state.ready} />
    </div>);
  }
}

export default App;
