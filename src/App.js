import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Scrollbars} from 'react-custom-scrollbars';
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';
import findIndex from 'lodash/findIndex';
import Draggable from 'react-draggable';
// import groupBy from 'lodash/groupBy';

// STYLES
import './styles/style.css';

// DATA
import eventsData from './config/eventsData';
import defaultState from './config/defaultState.json';
import {_MONTHS} from './config/constants';

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
    setTimeout(() => this.updateEventList(), 1);
  }

  componentDidMount() {
    const events = this.events;
    const localStorageRef = localStorage.getItem('hola');
    // console.log(localStorageRef);
    if (localStorageRef) {
      this.setState({
        events,
        ...JSON.parse(localStorageRef)
      });
    }
  }

  componentDidUpdate() {
    const {
      events,
      ...stateNoEvents
    } = this.state;
    localStorage.setItem('hola', JSON.stringify(stateNoEvents));
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
    // console.log(ev.length);
    return ev;
  };

  updateEventList = () => {
    let events = [];
    events = this.prepareEventList(this.events, this.state.regions, "region");
    events = this.prepareEventList(events, this.state.offers, "offer");
    events = this.prepareEventListMulti(events, this.state.channels, "channels");
    events = this.prepareEventListMulti(events, this.state.brands, "brands");
    events = orderBy(events, this.state.order.sortBy, this.state.order.orderBy);
    this.setState({events});
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

  stateUpdate = newState => this.setState({
    ...this.state,
    ...newState
  });

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
    // const modalEvent = Object.values(this.state.events).filter((e, i) => e['id'] === id)[0];
    const modalEvent = findIndex(this.state.events, ['id', id]);
    console.log(modalEvent)
    this.setState({modal: true, modalEvent});
  };

  handleCloseModal = () => {
    this.setState({modal: false, modalEvent: null});
  };

  handleModalNav = (change) => {
    // console.log(e);
    let newModalEvent = (this.state.modalEvent + change) % this.state.events.length;
    newModalEvent = newModalEvent < 0
      ? this.state.events.length - 1
      : newModalEvent;
    // console.log(newModalEvent, this.modalEventBox);
    this.getCoordinates(this.modalEventBox);
    this.setState({modalEvent: newModalEvent});
  }

  getCoordinates = element => ReactDOM.findDOMNode(element);

  render(props) {

    const mode = this.state.time.mode;
    const timespan = mode === 'Q' || mode === 'M'
      ? 1
      : this.state.time.numberOfYears;
    const Q = this.state.time.Q;
    const M = this.state.time.M;
    this.years = range(timespan).map(y => y + this.state.time.Y);
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
      const navStyle = {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.1)',
        height: 100,
        width: 50 + '%',
        padding: '0 30px',
        verticalAlign: 'middle',
        lineHeight: 100 + 'px',
        fontSize: 2 + 'em',
        borderRadius: 50
      };
      return this.state.modal && <div className="modal grid-view">
        <OutsideAlerter event={this.handleCloseModal}>
          <Draggable>
            <div style={{
                width: 'auto',
                height: 'auto'
              }}>
              <nav style={{
                  position: 'absolute',
                  top: 50 + '%',
                  left: 50 + '%',
                  width: 100 + '%',
                  height: 100,
                  transform: 'translate(-50%, -50%)',
                  maxWidth: 600,
                  minWidth: 450,
                  cursor: 'pointer'
                }}>
                <span className="prev" style={{
                    ...navStyle,
                    right: 50 + '%',
                    textAlign: 'left'
                  }} onClick={(e) => this.handleModalNav(-1)}>
                  <i className="nc-icon-mini arrows-1_minimal-left"/>
                </span>
                <span className="next" style={{
                    ...navStyle,
                    left: 50 + '%',
                    textAlign: 'right'
                  }} onClick={(e) => this.handleModalNav(1)}>
                  <i className="nc-icon-mini arrows-1_minimal-right"/>
                </span>
              </nav>
              <Event ref={(event) => this.modalEventBox = event} event={this.state.events[this.state.modalEvent]} view='grid' elevated={true} modal={this.state.modal} handleCloseModal={this.handleCloseModal} time={this.state.time}/>
            </div>
          </Draggable>
        </OutsideAlerter>
      </div>
    };

    return (<div className={appClass()}>
      <main id="main" className="main" role="main">
        <Header/>
        <div className="content-frame" style={{backgroundImage: 'url(images/bokeh.jpg)'}}>
          <div id="view" className={`content ${this.state.view}-view`}>
            <Overlay hasModal={hasModal}/>
            <ToolBar time={this.state.time} stateUpdate={this.stateUpdate} view={this.state.view} groupByType={this.state.order.groupByType} orderDirection={this.state.order.orderDirection} sortBy={this.state.order.sortBy} orderBy={this.state.order.orderBy} updateEventOrder={this.updateEventOrder}/>
            <MonthBar time={this.state.time} years={this.years} months={this.months}/>
            <div className="nano">
              <MonthLines time={this.state.time} years={this.years} months={this.months}/>
              <Scrollbars thumbMinSize={100} universal={true} style={{
                  height: '100%'
                }}>
                <EventsWrapper events={this.state.events} view={this.state.view} handleOpenModal={this.handleOpenModal} time={this.state.time}/>
              </Scrollbars>
            </div>
          </div>
          <Modal/>
        </div>
      </main>
      <Sidebar regions={this.state.regions} brands={this.state.brands} offers={this.state.offers} channels={this.state.channels} updateFilter={this.updateFilter} handleCollapse={this.handleCollapse}/>
    </div>);
  }
}

export default App;
