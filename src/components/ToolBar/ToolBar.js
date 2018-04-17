import React, {Component} from 'react';

import {TriggerBox, Trigger} from './Triggers';

// time modes: YEARS, YEAR-17, YEAR-18, MONTH, Q1, Q2, Q3, Q4

const Title = props => <h2 className="title">
  <span className="segment">{props.defaultTime.mode}</span>
  <span className="detail">{props.defaultTime.firstYear}</span>
</h2>

const Pagination = props => <span className="pagination">
  <a className="prev">
    <i className="nc-icon-outline arrows-1_minimal-left"></i>
  </a>
  <a className="next">
    <i className="nc-icon-outline arrows-1_minimal-right"></i>
  </a>
</span>

const FilterCategory = props => <div className="filter-category">{props.children}</div>
const MainFilters = props => <nav className="main-filters">{props.children}</nav>

class ToolBar extends Component {

  render() {

    return (<header>
      <Pagination/>
      <Title defaultTime={this.props.defaultTime}/>

      <MainFilters>

        <FilterCategory>
          <TriggerBox title="Date" icon="nc-icon-mini ui-1_calendar-57">

            <Trigger propState={this.props.time} prop='time' value='YEAR' stateUpdate={this.props.stateUpdate}>
              ALL
            </Trigger>
            <Trigger propState={this.props.time} prop='time' value='YEAR-17' stateUpdate={this.props.stateUpdate}>
              2017
            </Trigger>
            <Trigger propState={this.props.time} prop='time' value='YEAR-18' stateUpdate={this.props.stateUpdate}>
              2018
            </Trigger>

          </TriggerBox>
        </FilterCategory>

        <FilterCategory>
          <TriggerBox title="Sort" icon="nc-icon-mini design_bullet-list-67">
            <h4>Group by</h4>
            <Trigger propState={this.props.groupByType} propStateValue='date' icon='nc-icon-mini ui-1_calendar-57'
              payload={() => this.props.updateEventOrder({sortBy: ['earlierDay','offer','region'], orderBy: this.props.orderBy, groupByType: 'date'})}>
              DATE
            </Trigger>
            <Trigger propState={this.props.groupByType} propStateValue='offer' icon='nc-icon-outline ui-1_check-circle-07'
              payload={() => this.props.updateEventOrder({sortBy: ['offer','earlierDay','region'], orderBy: this.props.orderBy, groupByType: 'offer'})}>
              OFFER
            </Trigger>
            <Trigger propState={this.props.groupByType} propStateValue='region' icon='nc-icon-outline travel_world'
              payload={() => this.props.updateEventOrder({sortBy: ['region','earlierDay','offer'], orderBy: this.props.orderBy, groupByType: 'region'})}>
              REGION
            </Trigger>

            <h4>Direction</h4>
            <Trigger propState={this.props.orderDirection} propStateValue='ASCENDING' icon='nc-icon-mini arrows-1_small-triangle-up'
              payload={() => this.props.updateEventOrder({sortBy: this.props.sortBy, orderBy: ['asc','asc','asc'], orderDirection: 'ASCENDING'})}>
              ASC
            </Trigger>
            <Trigger propState={this.props.orderDirection} propStateValue='DESCENDING' icon='nc-icon-mini arrows-1_small-triangle-down'
              payload={() => this.props.updateEventOrder({sortBy: this.props.sortBy, orderBy: ['desc','desc','desc'], orderDirection: 'DESCENDING'})}>
              DESC
            </Trigger>
          </TriggerBox>
        </FilterCategory>

        <FilterCategory>
          <Trigger propState={this.props.vigency} propStateValue='past' icon='nc-icon-mini arrows-2_cross-left'
          payload={() => this.props.stateUpdate({vigency: 'past'})}/>
          <Trigger propState={this.props.vigency} propStateValue='all' icon='nc-icon-mini design_window-responsive'
          payload={() => this.props.stateUpdate({vigency: 'all'})}/>
          <Trigger propState={this.props.vigency} propStateValue='future' icon='nc-icon-mini arrows-2_cross-right'
          payload={() => this.props.stateUpdate({vigency: 'future'})}/>
        </FilterCategory>

        <FilterCategory>
          <Trigger propState={this.props.view} propStateValue='grid' icon='nc-icon-mini ui-2_grid-square'
            payload={() => this.props.stateUpdate({view: 'grid'})}/>
          <Trigger propState={this.props.view} propStateValue='timeline' icon='nc-icon-mini ui-2_menu-35'
            payload={() => this.props.stateUpdate({view: 'timeline'})}/>
        </FilterCategory>
      </MainFilters>
    </header>)
  }
}

export default ToolBar;
