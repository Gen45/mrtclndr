import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Scrollbars} from 'react-custom-scrollbars';
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';
import findIndex from 'lodash/findIndex';
import Draggable from 'react-draggable';

// STYLES
import './styles/style.css';

// DATA
import eventsData from './config/eventsData';
import defaultState from './config/defaultState.json';

// CONSTANTS
import {_MONTHS, _ISMOBILE, _PREV, _NEXT, _BACKGROUNDIMAGE} from './config/constants';

// HELPERS
import {daysInMonth, getExtreme, today} from './helpers/dates';

// LOCAL COMPONENTS
import Header from './components/Header';
import ToolBar from './components/ToolBar/ToolBar';
import MonthBar from './components/MonthBar';
import MonthLines from './components/MonthLines';
import EventsWrapper from './components/Event/EventsWrapper';
import Event from './components/Event/Event';
import Sidebar from './components/Sidebar/Sidebar';
import OutsideAlerter from './components/Helpers/OutsideAlerter';

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
    // this.updateEventList();
    // setTimeout(() => this.updateEventList(), 1);
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

  getTimeRange = (time) => {
    const yearStart = time.Y;
    const yearEnd = time.mode === 'Y' ? time.Y + time.numberOfYears - 1 : time.Y;

    const monthStart = time.mode === 'Y' ? 1 : time.mode === 'Q' ? time.Q * 3 - 2 : time.M;
    const monthEnd = time.mode === 'Y' ? 12 : time.mode === 'Q' ? time.Q * 3 : time.M;

    const startDate = `${monthStart}/01/${yearStart}`;
    const endDate = `${monthEnd}/${daysInMonth(`${monthEnd}/01/${yearEnd}`)}/${yearEnd}`;

    const timeRange = {start: startDate, earliestDay: getExtreme([startDate], 'left'),  end: endDate, latestDay: getExtreme([endDate], 'right')};
    return timeRange;
  }

  updateEventList = () => {
    const timeRange = this.getTimeRange(this.state.time);
    let events = this.events;

    console.log(this.state.vigency.past);

    events = events.filter(e => !(e.latestDay < timeRange.earliestDay || e.earliestDay > timeRange.latestDay));
    events = events.filter(e => { return this.state.vigency.past === false ? !(e.latestDay < getExtreme([today()],'right')) : true} );
    events = events.filter(e => this.state.vigency.between === false ? !(e.latestDay >= getExtreme([today()],'right') && e.earliestDay <= getExtreme([today()],'right')) : true );
    events = events.filter(e => this.state.vigency.future === false ? !(e.earliestDay > getExtreme([today()],'right')) : true );
    events = this.prepareEventList(events, this.state.regions, "region");
    events = this.prepareEventList(events, this.state.offers, "offer");
    events = this.prepareEventListMulti(events, this.state.channels, "channels");
    events = this.prepareEventListMulti(events, this.state.brands, "brands");
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
    this.setState({modalPosition: this.modalDraggableRef.state, modal: false, modalEvent: null});
  };

  handleModalNav = (increment) => {
    let newModalEvent = (this.state.modalEvent + increment) % this.state.events.length;
    newModalEvent = newModalEvent < 0
      ? this.state.events.length - 1
      : newModalEvent;
    this.getCoordinates(this.modalEventBox);
    this.setState({modalPosition: this.modalDraggableRef.state, modalEvent: newModalEvent});
  }

  getCoordinates = element => ReactDOM.findDOMNode(element);

  // RENDER
  render(props) {

    const time = !_ISMOBILE ? this.state.time : {...this.state.time, numberOfYears: 1 };
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


    const Modal = () => {
      const height = 50;
      const navStyle = {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.1)',
        height: height,
        width: 50 + '%',
        padding: '0 15px',
        verticalAlign: 'middle',
        lineHeight: height + 'px',
        fontSize: 1 + 'em',
        borderRadius: height/2
      };

      const defaultPosition = this.state.modalPosition !== undefined ? {x: this.state.modalPosition.x, y: this.state.modalPosition.y} : {x: 0, y: 0};
      return this.state.modal &&
      <div className="modal grid-view">
            <OutsideAlerter event={this.handleCloseModal}>
              <Draggable ref={(modalDraggable) => {this.modalDraggableRef = modalDraggable}} defaultPosition={defaultPosition} >
            <div style={{
                width: 'auto',
                height: 'auto'
              }}>
              <nav style={{
                  position: 'absolute',
                  top: 50 + '%',
                  left: 50 + '%',
                  width: 100 + '%',
                  height: height,
                  transform: 'translate(-50%, -50%)',
                  maxWidth: 550,
                  minWidth: 420,
                  cursor: 'pointer'
                }}>
                <span className="prev" style={{
                    ...navStyle,
                    right: 50 + '%',
                    textAlign: 'left'
                  }} onClick={(e) => this.handleModalNav(_PREV)}>
                  <i className="nc-icon-mini arrows-1_minimal-left"/>
                </span>
                <span className="next" style={{
                    ...navStyle,
                    left: 50 + '%',
                    textAlign: 'right'
                  }} onClick={(e) => this.handleModalNav(_NEXT)}>
                  <i className="nc-icon-mini arrows-1_minimal-right"/>
                </span>
              </nav>
              <Event ref={(event) => this.modalEventBox = event} event={this.state.events[this.state.modalEvent]} view='grid' elevated={true} modal={this.state.modal} handleCloseModal={this.handleCloseModal} time={time}/>
            </div>
          </Draggable>
          </OutsideAlerter>
      </div>
    };

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
          <Modal/>
        </div>
      </main>
      <Sidebar regions={this.state.regions} brands={this.state.brands} offers={this.state.offers} channels={this.state.channels} updateFilter={this.updateFilter} handleCollapse={this.handleCollapse} collapsed={this.state.collapsed}/>
    </div>);
  }
}

export default App;
