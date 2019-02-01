import React, {Component} from 'react';
import { CSVLink } from "react-csv";


// import AwesomeDebouncePromise from 'awesome-debounce-promise';
// import { TransitionGroup, CSSTransition } from "react-transition-group";


import Title from './Title';
import Pagination from './Pagination';
import {FiltersGroup, FilterCategory, Header} from './Filters';
import {TriggerBox, Trigger} from './Triggers';

import { getCoordinates, removeSearched} from '../../helpers/misc';

import {_MONTHS, _QUARTERS, _THREEYEARS, _PREVIOUSYEAR, _CURRENTYEAR, _TIMELIMITS} from '../../helpers/dates';
import {_ISMOBILE, _TRANSITIONTIME} from '../../config/constants';

class ToolBar extends Component {

  state = {
    collapsed: false
  }

  componentDidMount(){
    this.sidebarCollapse = this.props.sidebarCollapse;
    let toolbarMaxWidth = 260;
    toolbarMaxWidth += this.mainFiltersGroupRef ? getCoordinates(this.mainFiltersGroupRef).offsetWidth : 0;
    toolbarMaxWidth += this.PaginationRef ? getCoordinates(this.PaginationRef).offsetWidth : 0;
    toolbarMaxWidth += this.TitleRef ? getCoordinates(this.TitleRef).offsetWidth : 0;
    this.setState({toolbarMaxWidth}, this.updateDimensions);

    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
      window.removeEventListener("resize", this.updateDimensions);
  }

  componentWillReceiveProps() {
    // console.log(this.sidebarCollapse, this.props.sidebarCollapse)
    if(this.sidebarCollapse !== this.props.sidebarCollapse){
      this.sidebarCollapse = this.props.sidebarCollapse;
      setTimeout(() => {
        // console.log(''); 
        this.updateDimensions()
      }, _TRANSITIONTIME*3);
    } else {
      this.updateDimensions();
    }
  }

  updateDimensions = () => {
    const collapseToolbar = this.state.toolbarMaxWidth > getCoordinates(this.HeaderRef).offsetWidth;
    if(collapseToolbar) {
      this.setState({collapsed: true});
    } else {
      this.setState({collapsed: false});
    }
  };

  handleSearchTerm = (keyword) => {
    const search = {search: {active: true, term: keyword}};
    this.props.updateState(search, true);
  }

  format2CSV = (events) => {
    // console.log(JSON.stringify(events[0]));
    const formatedEvents = events
    .filter(e => e.status)    
    .map( e => {     

      const channelPresent = channel => {
        // console.log(e.channels, channel);
        return e.channels.indexOf(Number(channel)) > -1 ? 'Yes' : 'No';
      }

      let event = {};

      if (typeof e.activity_log !== 'object') 
        console.log(e.id, e.campaign_name, typeof e.activity_log);

      // const activity_log = e.activity_log !==


      event["ID"] = e.id || " ";
      event["Date Created"] = e.date_created || " ";
      event["Date Modified"] = e.date_modified || " ";
      event["Last Modified by"] = e.activity_log.length > 0 ? e.activity_log[e.activity_log.length - 1].activity.user.display_name : " ";
      event["Owner"] = e.owner[0].name || " ";
      event["Owner SubRegion"] = e.region[0].name || " ";
      event["Campaign Group"] = e.campaign_group[0].name || " ";
      event["Market Scope"] = e.market_scope[0].name || " ";
      event["Destination - Featured Market"] = e.featured_market[0].name || " ";
      event["Markets more"] = e.market_more || " ";
      event["Ongoing Campaign"] = e.ongoing ? "yes" : "no" || " ";
      event["Program Type"] = e.program_type[0].name || " ";
      event["Offer"] = e.offer[0].name || " ";
      event["Segment"] = e.segment[0].name || " ";

      event["Campaign Name"] = removeSearched(e.campaign_name.replace(/<br \/>/g, '')) || " ";
      event["Description"] = removeSearched(e.description.replace(/<br \/>/g, '')) || " ";

      event["Sell Start Date"] = e["dates"]["sell"]["start"] || " ";
      event["Sell End Date"] = e["dates"]["sell"]["end"] || " ";
      event["Stay Start Date"] = e["dates"]["stay"]["start"] || " ";
      event["Stay End Date"] = e["dates"]["stay"]["end"] || " ";

      event["Brand"] = e.brands.map(b => this.props.helpers.brands[b].abreviation).toString().replace(/,/g, ', ') || " ";

      Object.keys(this.props.helpers.channels).forEach(channel => {
        if(channel !== '17' && channel !== '16') {
          event[this.props.helpers.channels[channel].name.replace(/\./g, '-')] = channelPresent(channel);
        }
      });

      event["Other Channels"] = e.otherChannels || " ";
      event["LANDING PAGE URL"] = e.landing_page_url || " ";
      event["CREATIVE URL"] = e.creative_url || " ";

      return event;
    });

    // console.log(formatedEvents);

    return formatedEvents;
  }

  render() {



    const normalizeYear = year => year === _PREVIOUSYEAR - 1 ? _CURRENTYEAR : year;

    return (
      <Header ref={Header => this.HeaderRef = Header}>
    {
      !(this.props.time.mode === 'Y' && this.props.view === 'grid') &&
      <Pagination ref={Pagination => this.PaginationRef = Pagination}
        time={this.props.time} updateState={this.props.updateState} limit={_TIMELIMITS} />
    }
      <Title ref={Title => this.TitleRef = Title}
        time={this.props.time} view={this.props.view}/>

      <FiltersGroup ref={FiltersGroup => this.mainFiltersGroupRef = FiltersGroup}
        title='Settings' icon='nc-icon-mini ui-1_settings-gear-65' disabled={false} collapsed={this.state.collapsed } >
        <FilterCategory>
          <TriggerBox title='Time' icon='nc-icon-mini ui-1_calendar-60' width={270} renderChildren={true} align='left' showTitle={false}>
            <div className='group'>
              <h4>MODE</h4>
              <Trigger propState={this.props.time.mode} propStateValue='Y'
                payload={() => this.props.updateState({time: {...this.props.time, mode: 'Y', }}, true)}>
                Year
              </Trigger>
              <Trigger propState={this.props.time.mode} propStateValue='Q'
                payload={() => this.props.updateState({time: {...this.props.time, mode: 'Q', Y: normalizeYear(this.props.time.Y)}}, true)}>
                Quarter
              </Trigger>
              <Trigger propState={this.props.time.mode} propStateValue='M'
                payload={() => this.props.updateState({time: {...this.props.time, mode: 'M', Y: normalizeYear(this.props.time.Y)}}, true)}>
                Month
              </Trigger>
              <hr/>
            </div>
            {
              this.props.time.mode === 'Q' &&
              <div className='group'>
                <h4>QUARTER</h4>
                {_QUARTERS.map( q =>
                <Trigger key={q} propState={this.props.time.Q} propStateValue={q}
                  payload={() => this.props.updateState({time: {...this.props.time, Q: q}}, true)}>
                  Q{q}
                </Trigger>)
                }
                <hr/>
              </div>
            }
            {
              this.props.time.mode === 'M' &&
              <div className='group'>
                <h4>MONTH</h4>
                {_MONTHS.map( (m, i) =>
                <Trigger key={m} propState={this.props.time.M} propStateValue={i + 1}
                  payload={() => this.props.updateState({time: {...this.props.time, M: i + 1}}, true)}>
                  {m}
                </Trigger>)
                }
                <hr/>
              </div>
            }
            {
              this.props.time.mode === 'Y' && !_ISMOBILE() && this.props.view === 'timeline' &&
              <div className='group'>
                <h4>NUMBER OF YEARS TO SHOW</h4>
                {[1,2,3].map( (n, i) =>
                <Trigger key={n} propState={this.props.time.numberOfYears} propStateValue={n}
                  payload={() => this.props.updateState({time: {...this.props.time, numberOfYears: n}}, true)}>
                  {n}
                </Trigger>)
                }
              </div>
            }
            {this.props.time.mode === 'Y' && !_ISMOBILE() && this.props.view === 'timeline' && <hr/>}

            <div className='group'>
              <h4>{`${this.props.time.mode === 'Y' && this.props.view === 'timeline' ? 'STARTING ' : ''}YEAR`}</h4>
              {
                this.props.time.mode === 'Y' && this.props.view === 'grid' &&
                <Trigger key="all" propState={this.props.time.Y} propStateValue={_PREVIOUSYEAR - 1}
                  payload={() => this.props.updateState({time: {...this.props.time,  Y: _PREVIOUSYEAR - 1, numberOfYears: 3}}, true)}>
                  ALL
                </Trigger>
              }
              {
                 _THREEYEARS.map( (y, i) =>
                <Trigger key={y} propState={this.props.time.Y} propStateValue={y}
                  payload={() => this.props.updateState({time: {...this.props.time,  Y: y}}, true)}>
                  20{y}
                </Trigger>)
              }
            </div>

          </TriggerBox>
        </FilterCategory>

        { this.state.collapsed && <hr/> }

          <FilterCategory>
            <TriggerBox title="Sort/Order" icon="nc-icon-mini arrows-2_direction" width={300} renderChildren={true} align="left">
              <div className='group'>
                <h4>Sort by</h4>
                <Trigger propState={this.props.groupByType} propStateValue="modified" icon="nc-icon-outline ui-2_time-clock"
                  payload={() => this.props.updateEventOrder({sortBy: ["date_modified","offer[0]['name']","region[0]['name']"], orderBy: this.props.orderBy, groupByType: "modified"})}>
                  MODIFIED
                </Trigger>
                <Trigger propState={this.props.groupByType} propStateValue="date" icon="nc-icon-outline ui-1_calendar-57"
                  payload={() => this.props.updateEventOrder({sortBy: ["earliestDay","offer[0]['name']","region[0]['name']"], orderBy: this.props.orderBy, groupByType: "date"})}>
                  DATE
                </Trigger>
                <Trigger propState={this.props.groupByType} propStateValue="offer" icon="nc-icon-outline ui-1_check-circle-07"
                  payload={() => this.props.updateEventOrder({sortBy: ["offer[0]['name']","earliestDay","region[0]['name']"], orderBy: this.props.orderBy, groupByType: "offer"})}>
                  OFFER
                </Trigger>
                <Trigger propState={this.props.groupByType} propStateValue="region" icon="nc-icon-outline travel_world"
                  payload={() => this.props.updateEventOrder({sortBy: ["region[0]['name']","earliestDay","offer[0]['name']"], orderBy: this.props.orderBy, groupByType: "region"})}>
                  REGION
                </Trigger>
                <Trigger propState={this.props.groupByType} propStateValue="owner" icon="nc-icon-outline users_circle-09"
                  payload={() => this.props.updateEventOrder({sortBy: ["owner[0]['name']","earliestDay","offer[0]['name']"], orderBy: this.props.orderBy, groupByType: "owner"})}>
                  OWNER
                </Trigger>
                <Trigger propState={this.props.groupByType} propStateValue="alpha" icon="nc-icon-outline education_book-39"
                  payload={() => this.props.updateEventOrder({sortBy: ["campaign_name","earliestDay","offer[0]['name']"], orderBy: this.props.orderBy, groupByType: "alpha"})}>
                  A-Z
                </Trigger>
                <hr/>
              </div>

              <h4>Order by</h4>
              <Trigger propState={this.props.orderDirection} propStateValue="ASCENDING" icon="nc-icon-mini arrows-1_small-triangle-up"
                payload={() => this.props.updateEventOrder({sortBy: this.props.sortBy, orderBy: ["asc","asc","asc"], orderDirection: "ASCENDING"})}>
                ASCENDING
              </Trigger>
              <Trigger propState={this.props.orderDirection} propStateValue="DESCENDING" icon="nc-icon-mini arrows-1_small-triangle-down"
                payload={() => this.props.updateEventOrder({sortBy: this.props.sortBy, orderBy: ["desc","desc","desc"], orderDirection: "DESCENDING"})}>
                DESCENDING
              </Trigger>
            </TriggerBox>
          </FilterCategory>

        { this.state.collapsed && <hr/> }

        <FilterCategory disabled={false}>
          <TriggerBox title='Download' icon='nc-icon-mini arrows-1_download' width={200} renderChildren={true} align='left'>
            <div className="group">
              <h4>CSV File (for excel)</h4>

              <Trigger icon='' disabled={true}
                payload={() => console.log(this.props.getShareableLink())}>
                Share Link
              </Trigger>

              <CSVLink target="_self" className="nav-trigger" filename={"marriott-calendar-all-entries" + new Date().getTime() +".csv"} data={this.format2CSV(this.props.allEvents)} style={{textDecoration: "none"}}>
                <span className="trigger-box-title" > All entries </span>
              </CSVLink>

              <CSVLink target="_self" className="nav-trigger" filename={"marriott-calendar-" + new Date().getTime() +".csv"} data={this.format2CSV(this.props.events)} style={{textDecoration: "none"}}>
                <span className="trigger-box-title" > Filtered entries </span>
              </CSVLink>

            </div>
          </TriggerBox>
        </FilterCategory>

        { this.state.collapsed && <hr/> }

        <FilterCategory>
          <Trigger caption='Toggle past events' propState={this.props.vigency.past} propStateValue={true} icon='nc-icon-mini design_align-right'
            payload={() => this.props.updateState({vigency:{...this.props.vigency, past: !this.props.vigency.past}}, true)}/>
          <Trigger caption='Toggle current events' propState={this.props.vigency.between} propStateValue={true} icon='nc-icon-mini design_align-center-horizontal'
            payload={() => this.props.updateState({vigency:{...this.props.vigency, between: !this.props.vigency.between}}, true)}/>
          <Trigger caption='Toggle future events' propState={this.props.vigency.future} propStateValue={true} icon='nc-icon-mini design_align-left'
            payload={() => this.props.updateState({vigency:{...this.props.vigency, future: !this.props.vigency.future}}, true)}/>
        </FilterCategory>

        { this.state.collapsed && <hr/> }

        <FilterCategory>
          <Trigger caption='View as grid' propState={this.props.view} propStateValue='grid' icon='nc-icon-mini ui-2_grid-square'
            payload={() => this.props.updateState({view: 'grid'})}/>
          <Trigger caption='View as timeline' propState={this.props.view} propStateValue='timeline' icon='nc-icon-mini ui-2_menu-35'
            payload={() => this.props.updateState({view: 'timeline'})}/>
        </FilterCategory>

        { this.state.collapsed && <hr/> }

        <FilterCategory>
          <Trigger caption='Starred items' propState={this.props.starred.show} propStateValue={true} icon='nc-icon-mini ui-2_favourite-31'
            payload={() => this.props.updateState({starred:{...this.props.starred, show: !this.props.starred.show}}, true)}/>
        </FilterCategory>
      </FiltersGroup>

      <FiltersGroup title=' ' icon='nc-icon-mini ui-1_zoom' disabled={false}>
        <FilterCategory>
          <Trigger caption='Search' icon='nc-icon-mini ui-1_zoom'
            payload={() => this.props.updateState({search:{active: !this.props.search.active}}, true)}/>
          {
            this.props.search.active &&
            <div className="searchInput" >
              <input type="text" placeholder="Filter by keyword" value={this.props.search.term} onChange={e => this.handleSearchTerm(e.target.value)} />
              <div className="erase" onClick={() => this.handleSearchTerm('')}><i className="nc-icon-mini ui-1_simple-remove" onClick={() => this.handleSearchTerm('')} /></div>
            </div>
          }
        </FilterCategory>
      </FiltersGroup>

      <FiltersGroup title=' 'disabled={true}>
        <FilterCategory>
            <Trigger caption='Help' icon='nc-icon-mini ui-2_alert'
              payload={() => window.open('/Help', '_blank')}/>
        </FilterCategory>
      </FiltersGroup>

    </Header>
    )
  }
}

export default ToolBar;
