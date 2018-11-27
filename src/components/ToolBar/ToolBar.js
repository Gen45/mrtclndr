import React, {Component} from 'react';
// import { TransitionGroup, CSSTransition } from "react-transition-group";

import Title from './Title';
import Pagination from './Pagination';
import {FiltersGroup, FilterCategory, Header} from './Filters';
import {TriggerBox, Trigger} from './Triggers';

import {getCoordinates} from '../../helpers/misc';

import {_MONTHS, _QUARTERS, _THREEYEARS, _PREVIOUSYEAR, _CURRENTYEAR, _TIMELIMITS} from '../../helpers/dates';
import {_ISMOBILE, _TRANSITIONTIME} from '../../config/constants';

class ToolBar extends Component {

  state = {
    collapsed: false
  }

  componentDidMount(){
    this.sidebarCollapse = this.props.sidebarCollapse;
    let toolbarMaxWidth = 150;
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
      setTimeout(() => {console.log('wu'); this.updateDimensions()}, _TRANSITIONTIME*3);
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
        title='Settings' icon='nc-icon-mini ui-1_settings-gear-65' disabled={this.props.search.active} collapsed={this.state.collapsed} >
        <FilterCategory>
          <TriggerBox title='Time Frame' icon='nc-icon-mini ui-1_calendar-60' width={270} renderChildren={true} align='left'>
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
          <TriggerBox title='Sort / Order' icon='nc-icon-mini arrows-2_direction' width={300} renderChildren={true} align='left'>
            <div className="group">
              <h4>Sort by</h4>
              <Trigger propState={this.props.groupByType} propStateValue='date' icon='nc-icon-outline ui-1_calendar-57'
                payload={() => this.props.updateEventOrder({sortBy: ['earliestDay','offer','region'], orderBy: this.props.orderBy, groupByType: 'date'})}>
                DATE
              </Trigger>
              <Trigger propState={this.props.groupByType} propStateValue='offer' icon='nc-icon-outline ui-1_check-circle-07'
                payload={() => this.props.updateEventOrder({sortBy: ['offer','earliestDay','region'], orderBy: this.props.orderBy, groupByType: 'offer'})}>
                OFFER
              </Trigger>
              <Trigger propState={this.props.groupByType} propStateValue='region' icon='nc-icon-outline travel_world'
                payload={() => this.props.updateEventOrder({sortBy: ['region','earliestDay','offer'], orderBy: this.props.orderBy, groupByType: 'region'})}>
                REGION
              </Trigger>
              <hr/>
            </div>

            <h4>Order by</h4>
            <Trigger propState={this.props.orderDirection} propStateValue='ASCENDING' icon='nc-icon-mini arrows-1_small-triangle-up'
              payload={() => this.props.updateEventOrder({sortBy: this.props.sortBy, orderBy: ['asc','asc','asc'], orderDirection: 'ASCENDING'})}>
              ASCENDING
            </Trigger>
            <Trigger propState={this.props.orderDirection} propStateValue='DESCENDING' icon='nc-icon-mini arrows-1_small-triangle-down'
              payload={() => this.props.updateEventOrder({sortBy: this.props.sortBy, orderBy: ['desc','desc','desc'], orderDirection: 'DESCENDING'})}>
              DESCENDING
            </Trigger>
          </TriggerBox>
        </FilterCategory>

        { this.state.collapsed && <hr/> }

        <FilterCategory disabled={false}>
          <TriggerBox title='Download' icon='nc-icon-mini arrows-1_download' width={200} renderChildren={true} align='left'>
            <div className="group">
              <h4>File</h4>
              {/* <Trigger icon='nc-icon-mini ui-1_calendar-57'
                payload={() => this.props.updateEventOrder({sortBy: ['earliestDay','offer','region'], orderBy: this.props.orderBy, groupByType: 'date'})}>
                PDF
              </Trigger> */}
              {/* <br/> */}
              <Trigger icon=''
                payload={() => console.log(this.props.getShareableLink())}>
                Share Link
              </Trigger>
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

      <FiltersGroup title=' ' icon='nc-icon-mini ui-1_zoom' disabled={true}>
        <FilterCategory>
          <Trigger caption='Search' icon='nc-icon-mini ui-1_zoom'
            payload={() => this.props.updateState({search:{active: !this.props.search.active}})}/>
          </FilterCategory>
      </FiltersGroup>
    </Header>
    )
  }
}

export default ToolBar;
