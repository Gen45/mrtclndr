import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';
import findIndex from 'lodash/findIndex';

// STYLES
import './styles/style.css';

// DATA
import eventsData from './config/eventsData';
import defaultState from './config/defaultState.json';

// CONSTANTS
import {_MONTHS, _ISMOBILE, _BACKGROUNDIMAGE} from './config/constants';

// HELPERS
import {daysInMonth, getExtreme, getTimeRange, today} from './helpers/dates';
import {isValid} from './helpers/misc';

// LOCAL COMPONENTS
import Header from './components/Header';
import ToolBar from './components/ToolBar/ToolBar';
import MonthBar from './components/MonthBar';
import MonthLines from './components/MonthLines';
import EventsWrapper from './components/Event/EventsWrapper';
import Sidebar from './components/Sidebar/Sidebar';
import Modal from './components/Helpers/Modal';

const Overlay = (props) => <div className={`overlay ${props.hasModal()}`}/>

class App extends Component {

  state = {
    ...defaultState,
    collapsed: false,
    modal: false,
    modalEvent: null
  };

  events = eventsData();

  componentWillMount() {
    this.updateEventList();
  }

  componentDidMount() {
    const events = this.events;
    const localStorageRef = localStorage.getItem('marriott-calendar');
    // console.log(localStorageRef);
    if (localStorageRef) {
      this.setState({
        events,
        ...JSON.parse(localStorageRef)
      }, this.updateEventList );
    }
  }

  componentDidUpdate() {
    const {
      events,
      ...stateNoEvents
    } = this.state;
    localStorage.setItem('marriott-calendar', JSON.stringify(stateNoEvents));
    // const ENCODED = btoa(unescape(encodeURIComponent(JSON.stringify(stateNoEvents))));
    // console.log(ENCODED.length);
  }

  activeFilter = (filterType) => {
    return Object.keys(filterType).filter((f, i) => filterType[f] === true)
  };

  prepareEventList = (events, filter, field) => {
    return events.filter(e => this.activeFilter(filter).indexOf(e[field]) >= 0);
  };

  prepareEventListMulti = (events, filter, field) => {
    const ev = events.filter(e => e[field].reduce((x, c) => x || (this.activeFilter(filter).indexOf(c) >= 0), false));
    return ev;
  };

  updateEventList = () => {
    const timeRange = getTimeRange(this.state.time);
    const dayOfTheYear = getExtreme([today()],'right');

    let events = this.events;

    events = events.filter(e => !(e.latestDay < timeRange.earliestDay || e.earliestDay > timeRange.latestDay));

    events = this.prepareEventList(events, this.state.regions, "region");
    events = this.prepareEventListMulti(events, this.state.brands, "brands");
    events = this.prepareEventList(events, this.state.offers, "offer");
    events = this.prepareEventListMulti(events, this.state.channels, "channels");

    events = events.filter(e => !this.state.vigency.past ? !(e.latestDay < dayOfTheYear) : true );
    events = events.filter(e => !this.state.vigency.between ? !(e.latestDay >= dayOfTheYear && e.earliestDay <= dayOfTheYear) : true );
    events = events.filter(e => !this.state.vigency.future ? !(e.earliestDay > dayOfTheYear) : true );

    events = orderBy(events, this.state.order.sortBy, this.state.order.orderBy);

    this.setState({events});
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

  stateUpdate = (newState, update) => {
    this.setState({
      ...this.state,
      ...newState
    }, () => {
      if (update) {
        this.updateEventList();
      }
    });
  };

  updateFilter = (filter, filterName, active) => {
    let filters = this.state[filterName];
    filters[filter] = active;
    this.setState({filterName});
    this.updateEventList();
  };

  handleCollapse = () => {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  };

  handleOpenModal = (id) => {
    const modalEvent = findIndex(this.state.events, ['id', id]);
    this.setState({modal: true, modalEvent});
  };

  handleCloseModal = () => {
    this.setState({modal: false, modalEvent: null});
  };

  handleModalNav = (increment) => {
    let newModalEvent = (this.state.modalEvent + increment) % this.state.events.length;
    newModalEvent = newModalEvent < 0
      ? this.state.events.length - 1
      : newModalEvent;
    this.setState({modalEvent: newModalEvent});
  };

  // handleToggleFav = (eventId) => {
  //   const state = this.state;
  //   state.starred.indexOf(eventId) > -1
  //    = state[favList][eventId] ? !state[favList][eventId]
  //   this.setState({favEvents: newModalEvent});
  // };

  // RENDER
  render(props) {

    const time = !_ISMOBILE() ? this.state.time : {...this.state.time, numberOfYears: 1 };
    const mode = time.mode;
    const timespan = mode === 'Q' || mode === 'M'
      ? 1
      : this.state.time.numberOfYears;
    const Q = time.Q;
    const M = time.M;
    this.years = range(timespan).map(y => y + time.Y);
    this.months = mode === 'Q'
      ? _MONTHS.slice(Q * 3 - 3, Q * 3)
      : mode === 'M'
        ? _MONTHS.slice(M - 1, M)
        : _MONTHS;

    const appClass = () => {
      return `App ${this.state.collapsed
        ? 'collapsed'
        : ''} ${this.state.modal
          ? 'modal-on'
          : ''}`
    }

    const hasModal = () => this.state.modal
      ? 'active'
      : '';

    return (<div className={appClass()}>
      <main id="main" className="main" role="main">
        <Header collapsed={this.state.collapsed}/>
        <div className="content-frame" style={{backgroundImage: `url(${_BACKGROUNDIMAGE})`}}>
          <div id="view" className={`content ${this.state.view}-view`}>
            <Overlay hasModal={hasModal}/>
            <ToolBar time={time} stateUpdate={this.stateUpdate} view={this.state.view} groupByType={this.state.order.groupByType} orderDirection={this.state.order.orderDirection} sortBy={this.state.order.sortBy} orderBy={this.state.order.orderBy} vigency={this.state.vigency} updateEventOrder={this.updateEventOrder}/>
            <MonthBar time={time} years={this.years} months={this.months}/>
            <div className="nano">
              <MonthLines time={time} years={this.years} months={this.months}/>
              <Scrollbars thumbMinSize={100} universal={true} style={{
                  height: '100%'
                }}>
                <EventsWrapper events={this.state.events} view={this.state.view} handleOpenModal={this.handleOpenModal} time={time} modalEventId={this.state.modalEvent !== null ? this.state.events[this.state.modalEvent].id : null}/>
              </Scrollbars>
            </div>
          </div>
          {
            this.state.modal &&
            <Modal
              modalPosition={this.state.modalPosition}
              handleCloseModal={this.handleCloseModal}
              handleModalNav={this.handleModalNav}
              handleToggleFav={this.handleToggleFav}
              modal={this.state.modal}
              events={this.state.events}
              modalEvent={this.state.modalEvent}
              time={time}
            />
          }
        </div>
      </main>
      <Sidebar regions={this.state.regions} brands={this.state.brands} offers={this.state.offers} channels={this.state.channels} updateFilter={this.updateFilter} handleCollapse={this.handleCollapse} collapsed={this.state.collapsed}/>
    </div>);
  }
}

export default App;
