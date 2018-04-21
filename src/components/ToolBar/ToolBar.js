import React, {Component} from 'react';

import {TriggerBox, Trigger} from './Triggers';
import {Title} from './Title';
import Pagination from './Pagination';

import { _MONTHS, _ISMOBILE, _THREEYEARS, _PREVIOUSYEAR, _NEXTYEAR } from '../../config/constants';


const FilterCategory = props => <div className="filter-category">{props.children}</div>

// width={window.innerWidth + 75}
const MainFilters = props =>
<nav className="main-filters">
  {
    _ISMOBILE() ?
    <TriggerBox title="Settings" icon="nc-icon-mini ui-1_settings-gear-65" width={250} draggable={false} align="left">
    {/* <TriggerBox title="Settings" icon="nc-icon-mini ui-1_settings-gear-65" width={window.innerWidth + 75} draggable={false} align="center"> */}
      {props.children}
    </TriggerBox> :
    <div>{props.children}</div>
  }
</nav>

class ToolBar extends Component {

  render() {

    return (<header>
      <Pagination time={this.props.time} stateUpdate={this.props.stateUpdate} limit={{Q: 4, M: 12, Y: {start: _PREVIOUSYEAR, end: _NEXTYEAR}}} />
      <Title time={this.props.time} view={this.props.view}/>

      <MainFilters>
        <FilterCategory>
          <TriggerBox title="Date" icon="nc-icon-mini ui-1_calendar-60" width={260} renderChildren={true}>
            <div className="group">
              <h4>VIEW MODE</h4>
              <Trigger propState={this.props.time.mode} propStateValue='Y'
                payload={() => this.props.stateUpdate({time: {...this.props.time, mode: 'Y'}}, true)}>
                Year
              </Trigger>
              <Trigger propState={this.props.time.mode} propStateValue='Q'
                payload={() => this.props.stateUpdate({time: {...this.props.time, mode: 'Q'}}, true)}>
                Quarter
              </Trigger>
              <Trigger propState={this.props.time.mode} propStateValue='M'
                payload={() => this.props.stateUpdate({time: {...this.props.time, mode: 'M'}}, true)}>
                Month
              </Trigger>
              <hr/>
            </div>
            {
              this.props.time.mode === 'Q' &&
              <div className="group">
                <h4>QUARTER</h4>
                {[1,2,3,4].map( q =>
                <Trigger key={q} propState={this.props.time.Q} propStateValue={q}
                  payload={() => this.props.stateUpdate({time: {...this.props.time, Q: q}}, true)}>
                  Q{q}
                </Trigger>)
                }
                <hr/>
              </div>
            }
            {
              this.props.time.mode === 'M' &&
              <div className="group">
                <h4>MONTH</h4>
                {_MONTHS.map( (m, i) =>
                <Trigger key={m} propState={this.props.time.M} propStateValue={i + 1}
                  payload={() => this.props.stateUpdate({time: {...this.props.time, M: i + 1}}, true)}>
                  {m}
                </Trigger>)
                }
                <hr/>
              </div>
            }

            <div className="group">
              <h4>YEAR</h4>
              {
                _THREEYEARS.map( (y, i) =>
                <Trigger key={y} propState={this.props.time.Y} propStateValue={y}
                  payload={() => this.props.stateUpdate({time: {...this.props.time,  Y: y}}, true)}>
                  20{y}
                </Trigger>)
              }
              {this.props.time.mode === 'Y' && !_ISMOBILE() && <hr/>}
            </div>

            {
              this.props.time.mode === 'Y' && !_ISMOBILE() &&
              <div className="group">
                <h4>NUMBER OF YEARS</h4>
                {[1,2,3].map( (n, i) =>
                <Trigger key={n} propState={this.props.time.numberOfYears} propStateValue={n}
                  payload={() => this.props.stateUpdate({time: {...this.props.time, numberOfYears: n}}, true)}>
                  {n}
                </Trigger>)
                }
              </div>
            }

          </TriggerBox>
        </FilterCategory>

        { _ISMOBILE() && <hr/> }

        <FilterCategory>
          {/* <TriggerBox title="Sort" icon="nc-icon-mini design_bullet-list-67"> */}
          <TriggerBox title="Sort / Order" icon="nc-icon-mini arrows-2_direction" width={300} renderChildren={true}>
            <div className="group">
              <h4>Sort by</h4>
              <Trigger propState={this.props.groupByType} propStateValue='date' icon='nc-icon-mini ui-1_calendar-57'
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

            <h4>Order Direction</h4>
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

        { _ISMOBILE() && <hr/> }
        {/* { _ISMOBILE() && <h4>Vigency</h4> } */}

        <FilterCategory>
          <Trigger propState={this.props.vigency.past} propStateValue={true} icon='nc-icon-mini arrows-2_cross-left'
            payload={() => this.props.stateUpdate({vigency:{...this.props.vigency, past: !this.props.vigency.past}}, true)}/>
          <Trigger propState={this.props.vigency.between} propStateValue={true} icon='nc-icon-mini design_window-responsive'
            payload={() => this.props.stateUpdate({vigency:{...this.props.vigency, between: !this.props.vigency.between}}, true)}/>
          <Trigger propState={this.props.vigency.future} propStateValue={true} icon='nc-icon-mini arrows-2_cross-right'
            payload={() => this.props.stateUpdate({vigency:{...this.props.vigency, future: !this.props.vigency.future}}, true)}/>
        </FilterCategory>

        { _ISMOBILE() && <hr/> }
        {/* { _ISMOBILE() && <h4>View Type</h4> } */}

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
