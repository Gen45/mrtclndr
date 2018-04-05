import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
// import _ from 'lodash';
// import Masonry from 'react-masonry-component';
// import ReactList from 'react-list';
// import moment from 'moment';

// STYLES
import './styles/style.css';

// DATA
import eventsData from './config/eventsData';
import defaultState from './config/defaultState.json';

// LOCAL COMPONENTS
import EventsWrapper from './components/Event/EventsWrapper';
import Navigation from './components/Navigation';
import Header from './components/Header';
import MonthBar from './components/MonthBar';
import MonthLines from './components/MonthLines';
import Sidebar from './components/Sidebar/Sidebar';
// import Event from './components/Event/Event';

  // console.log(typeOf eventsData());

 // console.log( eventsData() );

class App extends Component {

  state = { ...defaultState };
  events = eventsData();

  componentWillMount = () => {
    this.updateEventList();
  }

  prepareEventList = (events, filter, field) => {
     // _.sortBy(
    return events.filter(e => {
        return this.activeFilter(filter).indexOf(e[field]) >= 0
      });
    // , field);
  }

  updateEventList = () => {
    let events = [];
    events = this.prepareEventList(this.events, this.state.regions, "region");
    events = this.prepareEventList(events, this.state.offers, "offer");
    this.setState({ events });
  };

  // updateActiveEvents = (events, filters) => {
  //   return activeEvents;
  // }

  activeFilter = (filterType) => {
    return Object.keys(filterType).filter((f, i) => filterType[f] === true)
  };

  viewSwitcher = (view) => {
    if (this.state.view !== view) {
      this.setState({view});
    }
  };

  updateRegion = (region, active) => {
    let regions = this.state.regions;
    regions[region] = active;
    this.setState({regions: regions});
    this.updateEventList();
  };

  updateOffer = (offer, active) => {
    let offers = this.state.offers;
    offers[offer] = active;
    this.setState({offers: offers});
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
              <div className="overlay" />
              <Scrollbars
                thumbMinSize={100}
                universal={true}
                style={{
                  height: '100%'
                }}>
                <EventsWrapper events={this.state.events} view={this.state.view} />
              </Scrollbars>
            </div>
          </div>
        </div>
      </main>
      <Sidebar
        regions={this.state.regions}
        updateRegion={this.updateRegion}
        brands={this.state.brands}
        updateBrand={this.updateBrand}
        offers={this.state.offers}
        updateOffer={this.updateOffer}
      />
    </div>);
  }
}

export default App;
