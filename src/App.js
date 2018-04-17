import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import orderBy from 'lodash/orderBy';
// import groupBy from 'lodash/groupBy';

// STYLES
import './styles/style.css';

// DATA
import eventsData from './config/eventsData';
import defaultState from './config/defaultState.json';

// LOCAL COMPONENTS
import Header from './components/Header';
import ToolBar from './components/ToolBar/ToolBar';
import MonthBar from './components/MonthBar';
import MonthLines from './components/MonthLines';
import EventsWrapper from './components/Event/EventsWrapper';
import Event from './components/Event/Event';
import Sidebar from './components/Sidebar/Sidebar';
import OutsideAlerter from './components/Helpers/OutsideAlerter';

const Overlay = (props) =>
<div className={`overlay ${props.hasModal()}`}/>

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

  componentWillUpdate() {
    // this.updateEventList();
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
    events = orderBy(events, this.state.sortBy, this.state.orderBy);
    this.setState({events});
  };

  updateEventOrder = (newOrder) => {
    let events = orderBy(this.state.events, newOrder.sortBy, newOrder.orderBy);
    this.setState({
      events,
      ...newOrder
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
    const modalEvent = Object.values(this.state.events).filter(e => e['id'] === id)[0];
    this.setState({modal: true, modalEvent});
  };

  handleCloseModal = () => {
    this.setState({modal: false, modalEvent: null});
  };

  componentDidUpdate() {
    // console.log('app updated');
  }

  render(props) {

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
      return this.state.modal && <div className="modal grid-view">
        <OutsideAlerter event={this.handleCloseModal}>
          <Event event={this.state.modalEvent} view='grid' elevated={true} modal={this.state.modal} handleCloseModal={this.handleCloseModal}/>
        </OutsideAlerter>
      </div>
    };

    return (<div className={appClass()}>
      <main id="main" className="main" role="main">
        <Header/>
        <div className="content-frame">
          <div id="view" className={`content ${this.state.view}-view`}>
            <Overlay hasModal={hasModal} />
            <ToolBar defaultTime={this.state.time} stateUpdate={this.stateUpdate} view={this.state.view} groupByType={this.state.groupByType} orderDirection={this.state.orderDirection} sortBy={this.state.sortBy} orderBy={this.state.orderBy} updateEventOrder={this.updateEventOrder}/>
            <MonthBar time={this.state.time}/>
            <div className="nano">
              <MonthLines time={this.state.time}/>
              <Scrollbars thumbMinSize={100} universal={true} style={{
                  height: '100%'
                }}>
                <EventsWrapper events={this.state.events} view={this.state.view} handleOpenModal={this.handleOpenModal}/>
              </Scrollbars>
            </div>
          </div>
          <Modal />
        </div>
      </main>
      <Sidebar regions={this.state.regions} brands={this.state.brands} offers={this.state.offers} channels={this.state.channels} updateFilter={this.updateFilter} handleCollapse={this.handleCollapse}/>
    </div>);
  }
}

export default App;
