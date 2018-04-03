import React, {Component} from 'react';
// import {Scrollbars} from 'react-custom-scrollbars';
import _ from 'lodash';
// import Masonry from 'react-masonry-component';
import ReactList from 'react-list';
// import MasonryInfiniteScroller from 'react-masonry-infinite';
// import moment from 'moment';

// STYLES
import './styles/style.css';

// DATA
import eventsData from './config/events.json';
import regions from './config/regions.json';

// LOCAL COMPONENTS
import Navigation from './components/Navigation';
import Header from './components/Header';
import MonthBar from './components/MonthBar';
import MonthLines from './components/MonthLines';
import Sidebar from './components/Sidebar/Sidebar';
import Event from './components/Event/Event';

class App extends Component {

  state = {
    view: "grid",
    year: "2018",
    time: "YEARS",
    regions: regions
  }

  masonryOptions = {
    transitionDuration: 0
  }

  componentWillMount() {
    this.events =
     _.sortBy(
       eventsData.filter(e => {
      return this.activeFilter(this.state.regions).indexOf(e["Owner SubRegion"]) >= 0
    })
    , "Owner SubRegion");
    console.log(this.events)
  }

  componentWillUpdate() {
    this.events =
     _.sortBy(
       eventsData.filter(e => {
      return this.activeFilter(this.state.regions).indexOf(e["Owner SubRegion"]) >= 0
    })
    , "Owner SubRegion");
    console.log(this.events)
  }

  activeFilter = (filterType) => {
    return Object.keys(filterType).filter((f, i) => filterType[f] === true)
  };

  renderItem = (index, key) => {
    return <Event key={key} event={this.events[index]}/>
  };

  viewSwitcher = (view) => {
    if (this.state.view !== view) {
      this.setState({view});
    }
  };

  updateRegion = (region, active) => {
    let regions = this.state.regions;
    // console.log({regions})
    regions[region] = active;
    // console.log({regions})
    this.setState({regions: regions});
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
              <div className="overlay"></div>

              {/* <Scrollbars
                thumbMinSize={100}
                universal={true}
                style={{
                  height: '100%'
                }}> */}

                <div className="events-wrapper" ref={(ref) => {
                    this.eventsWrapper = ref
                  }}>


                  {/* <Masonry
                      // className={'my-gallery-class'} // default ''
                      // elementType={'ul'} // default 'div'
                      options={this.masonryOptions} // default {}
                      disableImagesLoaded={false} // default false
                      updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                  >
                    {
                      Object.keys(this.events).map( (k,i) => this.renderItem(k, i) )
                    }
                  </Masonry> */}



                  {/* {
                    Object.keys(this.events).map( (k,i) => this.renderItem(k, i) )
                  } */}

                  <ReactList
                    itemRenderer={this.renderItem}
                    length={this.events.length}
                    type='variable'
                  />


                </div>
              {/* </Scrollbars> */}



            </div>
          </div>
        </div>
      </main>

      <Sidebar regions={this.state.regions} updateRegion={this.updateRegion}/>

    </div>);
  }
}

export default App;
