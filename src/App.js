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
import Navigation from './components/Navigation';
import MonthBar from './components/MonthBar';
import MonthLines from './components/MonthLines';
import EventsWrapper from './components/Event/EventsWrapper';
import Sidebar from './components/Sidebar/Sidebar';

class App extends Component {

  state = {
    ...defaultState,
    sortBy: ["region", "offer"]
  };
  events = eventsData();

  componentWillMount() {
    this.updateEventList();
  }

  prepareEventList = (events, filter, field) => {
    return events.filter(e => {
      return this.activeFilter(filter).indexOf(e[field]) >= 0
    });
  };

  updateEventList = () => {
    let events = [];
    events = this.prepareEventList(this.events, this.state.regions, "region");
    events = this.prepareEventList(events, this.state.offers, "offer");
    // console.log(events, this.state.sortBy);

    events = sortBy(events, this.state.sortBy, ['asc']);
    // console.log(events);
    this.setState({events});
  };

  activeFilter = (filterType) => {
    return Object.keys(filterType).filter((f, i) => filterType[f] === true)
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

  render(props) {

    return (<div className="App">
      <main id="main" className="main" role="main">
        <Header/>
        <div className="content-frame">
          <div id="view" className={`content ${this.state.view}-view`}>
            <Navigation segment={this.state.time} year={this.state.year} viewSwitcher={this.viewSwitcher}/>
            <MonthBar/>
            <div className="nano">
              <MonthLines/>
              <div className="overlay"/>
              <Scrollbars thumbMinSize={100} universal={true} style={{
                  height: '100%'
                }}>
                <EventsWrapper events={this.state.events} view={this.state.view}/>
              </Scrollbars>
            </div>
          </div>
        </div>
      </main>
      <Sidebar regions={this.state.regions} updateRegion={this.updateRegion} brands={this.state.brands} updateBrand={this.updateBrand} offers={this.state.offers} updateOffer={this.updateOffer} updateFilter={this.updateFilter}/>
    </div>);
  }
}

export default App;
