import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import orderBy from 'lodash/orderBy';

// STYLES
import '../styles/style.css';
import 'react-tippy/dist/tippy.css';

// DATA
import eventsData from '../config/eventsData';
import defaultState from '../config/defaultState.json';

// CONSTANTS
import {_ISMOBILE, _BACKGROUNDIMAGE} from '../config/constants';

// HELPERS
import {getExtreme, getTimeRange, today, _PREVIOUSYEAR, _CURRENTYEAR} from '../helpers/dates';
import {isValid, isValidAndTrue} from '../helpers/misc';

// LOCAL COMPONENTS
import Header from './Main/Header';
import ToolBar from './ToolBar/ToolBar';
import {MonthBar, MonthLines} from './Main/MonthLines';
import EventsWrapper from './Main/EventsWrapper';
import Sidebar from './Sidebar/Sidebar';
import Modal, {OpenModal} from './Helpers/Modal';


class App extends Component {

  events = eventsData();

  componentWillMount() {

    if(isValid(this.props.location.state)) {
      if(this.props.location.state.isAuthenticated === false) {
        this.props.history.push('/login', {isAuthenticated : false});
      }
    } else {
      this.props.history.push('/login', {isAuthenticated : false});
    }

    const localStorageRef = localStorage.getItem('marriott-calendar');
    if (localStorageRef) {
      this.setState({...JSON.parse(localStorageRef)}, () => this.updateEventList(this.events));
    } else {
        this.setState({...defaultState}, () => this.updateEventList(this.events));
    }
  }

  componentDidUpdate() {
      const {
        events,
        ...stateNoEvents
      } = this.state;
    localStorage.setItem(
      'marriott-calendar',
      JSON.stringify(stateNoEvents)
    );
    // const ENCODED = btoa(unescape(encodeURIComponent(JSON.stringify(stateNoEvents))));
    // console.log(ENCODED.length);
  }

  logout = () => {
    // console.log('should logout')
    this.props.history.push('/login', {isAuthenticated : false});
  };

  activeFilter = filterType => Object.keys(filterType).filter((f, i) => filterType[f] === true);

  prepareEventList = (events, filter, field) => events.filter(e => e[field].reduce((x, c) => x || (this.activeFilter(filter).indexOf(c) >= 0), false));

  updateEventList = (events, update) => {
    const timeRange = getTimeRange(this.state.time);
    const dayOfTheYear = getExtreme([today()]);

    // FILTER BY TIME
    events = events.filter(e => !(e.latestDay < timeRange.earliestDay || e.earliestDay > timeRange.latestDay));

    // FILTER BY FILTERS (=O)
    events = Object.keys(this.state.filtersList).reduce((acc, f) => this.prepareEventList(acc, this.state[f], this.state.filtersList[f].name), events);

    // FILTER BY VIGENCY
    events = !this.state.vigency.past ? events.filter(e => !(e.latestDay < dayOfTheYear)) : events;
    events = !this.state.vigency.between ? events.filter(e => !(e.latestDay >= dayOfTheYear && e.earliestDay <= dayOfTheYear)) : events;
    events = !this.state.vigency.future ? events.filter(e => !(e.earliestDay > dayOfTheYear)) : events;

    // FILTER BY STARRED
    events = this.state.starred.show ? events.filter(e => this.state.starred.items.indexOf(e.id) > -1) : events;

    // ORDER
    events = orderBy(events, this.state.order.sortBy, this.state.order.orderBy);

    // SHOULD UPDATE?
    if (update === false ? false : true) {
      this.setState({events, ready: true});
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

  updateState = (newState, update) => {
    this.setState({
      ...this.state,
      ...newState
    }, () => {
      if (update) {
        this.updateEventList(this.events);
      }
    });
  };

  updateFilter = (filter, filterName, active) => {
    let filters = this.state[filterName];
    filters[filter] = active;
    this.setState({filterName});
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

        <div className="content-frame" style={{backgroundImage: `url(${_BACKGROUNDIMAGE})`}}>
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
            />

            <div className={`overlay${this.state.modal.show ? ' active' : ''}`}/>

            <MonthBar time={time} collapsed={this.state.sidebar.collapsed}/>

            <div className="nano">
              <MonthLines time={time}/>
              <Scrollbars thumbMinSize={100} universal={true} style={{
                  height: '100%'
                }}>
              {
                this.state.ready && this.state.events &&
                <EventsWrapper
                  events={this.state.events}
                  view={this.state.view}
                  handleOpenModal={this.handleOpenModal}
                  time={time}
                  modalEventId={isValid(this.state.modal.modalEvent) ? this.state.events[this.state.modal.modalEvent].id : null}
                  modal={this.state.modal}
                />
              }
              </Scrollbars>
            </div>

          </div>
        </div>
      </main>

      <Sidebar regions={this.state.regions} brands={this.state.brands} offers={this.state.offers} channels={this.state.channels} updateFilter={this.updateFilter} collapsed={this.state.sidebar.collapsed || false} updateState={this.updateState}/>
      {
        this.state.modal.show && this.state.ready && this.state.events &&
        <Modal
          ref={(Modal) => {this.ModalRef = Modal}}
          modalPosition={this.state.modalPosition}
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
    </div>);
  }
}

export default App;
