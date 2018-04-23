import React, {Component} from 'react';

import {TriggerBox, Trigger} from './Triggers';
import {Title} from './Title';
import Pagination from './Pagination';

import { _ISMOBILE } from '../../config/constants';
import { _MONTHS, _QUARTERS, _THREEYEARS, _PREVIOUSYEAR, _CURRENTYEAR, _TIMELIMITS } from '../../helpers/dates';


const FilterCategory = props => !props.disabled && <div className="filter-category">{props.children}</div>

// width={window.innerWidth + 75}
const FiltersGroup = props => !props.disabled &&
<nav className='filters-group'>
  {
    _ISMOBILE() ?
    <TriggerBox title={props.title} icon={props.icon} width={250} draggable={false} align='left'>
    {/* <TriggerBox title='Settings' icon='nc-icon-mini ui-1_settings-gear-65' width={window.innerWidth + 75} draggable={false} align='center'> */}
      {props.children}
    </TriggerBox> :
    <div>{props.children}</div>
  }
</nav>

class ToolBar extends Component {

  render() {

    const normalizeYear = year => year === _PREVIOUSYEAR - 1 ? _CURRENTYEAR : year;

    return (
      <header>
      { !(this.props.time.mode === 'Y' && this.props.view === 'grid') &&
         <Pagination time={this.props.time} updateState={this.props.updateState} limit={_TIMELIMITS} />
      }
      <Title time={this.props.time} view={this.props.view}/>

      <FiltersGroup title='Settings' icon='nc-icon-mini ui-1_settings-gear-65' disabled={this.props.search.active}>
        <FilterCategory>
          <TriggerBox title='Date' icon='nc-icon-mini ui-1_calendar-60' width={270} renderChildren={true} align='left'>
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
              this.props.time.mode === 'Y' && !_ISMOBILE() && this.props.view !== 'grid' &&
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
            {this.props.time.mode === 'Y' && this.props.view === 'timeline' && <hr/>}

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

        { _ISMOBILE() && <hr/> }

        <FilterCategory>
          {/* <TriggerBox title='Sort' icon='nc-icon-mini design_bullet-list-67'> */}
          <TriggerBox title='Sort / Order' icon='nc-icon-mini arrows-2_direction' width={300} renderChildren={true} align='left'>
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

        { _ISMOBILE() && <hr/> }
        {/* { _ISMOBILE() && <h4>Vigency</h4> } */}

        <FilterCategory>
          <Trigger caption='Toggle past events' propState={this.props.vigency.past} propStateValue={true} icon='nc-icon-mini arrows-2_cross-left'
            payload={() => this.props.updateState({vigency:{...this.props.vigency, past: !this.props.vigency.past}}, true)}/>
          <Trigger caption='Toggle current events' propState={this.props.vigency.between} propStateValue={true} icon='nc-icon-mini design_window-responsive'
            payload={() => this.props.updateState({vigency:{...this.props.vigency, between: !this.props.vigency.between}}, true)}/>
          <Trigger caption='Toggle future events' propState={this.props.vigency.future} propStateValue={true} icon='nc-icon-mini arrows-2_cross-right'
            payload={() => this.props.updateState({vigency:{...this.props.vigency, future: !this.props.vigency.future}}, true)}/>
        </FilterCategory>

        { _ISMOBILE() && <hr/> }
        {/* { _ISMOBILE() && <h4>View Type</h4> } */}

        <FilterCategory>
          <Trigger caption='View as grid' propState={this.props.view} propStateValue='grid' icon='nc-icon-mini ui-2_grid-square'
            payload={() => this.props.updateState({view: 'grid'})}/>
          <Trigger caption='View as timeline' propState={this.props.view} propStateValue='timeline' icon='nc-icon-mini ui-2_menu-35'
            payload={() => this.props.updateState({view: 'timeline'})}/>
        </FilterCategory>

        { _ISMOBILE() && <hr/> }
        {/* { _ISMOBILE() && <h4>View Type</h4> } */}

        <FilterCategory>
          <Trigger caption='Starred items' propState={this.props.starred.show} propStateValue={true} icon='nc-icon-mini nc-icon-mini health_heartbeat-16'
            payload={() => this.props.updateState({starred:{...this.props.starred, show: !this.props.starred.show}}, true)}/>
        </FilterCategory>

      </FiltersGroup>

      <FiltersGroup title=' ' icon='nc-icon-mini ui-1_zoom' disabled={true}>
        <FilterCategory>
          <Trigger caption='Search' icon='nc-icon-mini ui-1_zoom'
            payload={() => this.props.updateState({search:{active: !this.props.search.active}})}/>
          </FilterCategory>
      </FiltersGroup>
      </header>
    )
  }
}

export default ToolBar;
