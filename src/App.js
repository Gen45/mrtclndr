import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import sortBy from 'lodash/sortBy';

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
    events = sortBy(events, this.state.sortBy, ['desc']);
    this.setState({events});
  };

  viewSwitcher = (view) => {
    if (this.state.view !== view) {
      this.setState({view});
    }
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

    return (<div className={`App ${this.state.collapsed
        ? 'collapsed'
        : ''} ${this.state.modal
          ? 'modal-on'
          : ''}`}>
      <main id="main" className="main" role="main">
        <Header/>
        <div className="content-frame">
          <div id="view" className={`content ${this.state.view}-view`}>
            <div className={`overlay ${this.state.modal
                ? 'active'
                : ''}`}/>
            <ToolBar defaultTime={this.state.time} viewSwitcher={this.viewSwitcher}/>
            <MonthBar/>
            <div className="nano">
              <MonthLines/>
              <Scrollbars thumbMinSize={100} universal={true} style={{
                  height: '100%'
                }}>
                <EventsWrapper events={this.state.events} view={this.state.view} handleOpenModal={this.handleOpenModal}/>
              </Scrollbars>
            </div>
          </div>
          {
            this.state.modal && <div className="modal grid-view">
                <Event event={this.state.modalEvent} view='grid' elevated={true} modal={this.state.modal} handleCloseModal={this.handleCloseModal}/>
              </div>
          }
        </div>
      </main>
      <Sidebar regions={this.state.regions} brands={this.state.brands} offers={this.state.offers} channels={this.state.channels} updateFilter={this.updateFilter} handleCollapse={this.handleCollapse}/>
    </div>);
  }
}

export default App;
