import React, {Component} from 'react';
import range from 'lodash/range';


import {TriggerBox, Trigger} from './Triggers';

import {_MONTHS} from '../../config/constants';

const Title = props => {
  let detail,
    segment;
  switch (props.time.mode) {
    case 'Y':
      {

        detail = props.view === 'timeline' ? range(props.time.numberOfYears).reduce( (a, y, i, ar) => a+=`20${y + props.time.Y}${i < props.time.numberOfYears - 1 ? ' - ': ''}`, '') : '';
        segment = 'YEARS';
        break;
      }
    case 'M':
      {
        detail = `20${props.time.Y}`;
        segment = `${_MONTHS[props.time.M - 1]}`;
        break;
      }
    case 'Q':
      {
        detail = `20${props.time.Y}`;
        segment = `Q${props.time.Q}`;
        break;
      }
    default: {
      detail = '...';
      segment = 'Loading';
      break;
    }
  }
  return <h2 className="title">
    <span className="segment">{segment}</span>
    <span className="detail">{detail}</span>
  </h2>
}

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
      {/* <Pagination/> */}
      <Title time={this.props.time} view={this.props.view}/>

      <MainFilters>

        <FilterCategory>
          <TriggerBox title="Date" icon="nc-icon-mini ui-1_calendar-57" width={260}>
            <div className="group">
              <h4>VIEW MODE</h4>
              <Trigger propState={this.props.time.mode} propStateValue='Y'
                payload={() => this.props.stateUpdate({time: {...this.props.time, mode: 'Y'}})}>
                Year
              </Trigger>
              <Trigger propState={this.props.time.mode} propStateValue='Q'
                payload={() => this.props.stateUpdate({time: {...this.props.time, mode: 'Q'}})}>
                Quarter
              </Trigger>
              <Trigger propState={this.props.time.mode} propStateValue='M'
                payload={() => this.props.stateUpdate({time: {...this.props.time, mode: 'M'}})}>
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
                  payload={() => this.props.stateUpdate({time: {...this.props.time, Q: q}})}>
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
                  payload={() => this.props.stateUpdate({time: {...this.props.time, M: i + 1}})}>
                  {m}
                </Trigger>)
                }
                <hr/>
              </div>
            }

            <div className="group">
              <h4>YEAR</h4>
              {
                [17, 18, 19].map( (y, i) =>
                <Trigger key={y} propState={this.props.time.Y} propStateValue={y}
                  payload={() => this.props.stateUpdate({time: {...this.props.time,  Y: y}})}>
                  20{y}
                </Trigger>)
              }
              {this.props.time.mode === 'Y' && <hr/>}
            </div>

            {
              this.props.time.mode === 'Y' &&
              <div className="group">
                <h4>NUMBER OF YEARS</h4>
                {[1,2,3].map( (n, i) =>
                <Trigger key={n} propState={this.props.time.numberOfYears} propStateValue={n}
                  payload={() => this.props.stateUpdate({time: {...this.props.time, numberOfYears: n}})}>
                  {n}
                </Trigger>)
                }
              </div>
            }

          </TriggerBox>
        </FilterCategory>

        <FilterCategory>
          {/* <TriggerBox title="Sort" icon="nc-icon-mini design_bullet-list-67"> */}
          <TriggerBox title="Sort / Order" icon="nc-icon-mini arrows-2_direction" width={300}>
            <div className="group">
              <h4>Sort by</h4>
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

        {/* <FilterCategory>
          <Trigger propState={this.props.vigency} propStateValue='past' icon='nc-icon-mini arrows-2_cross-left'
          payload={() => this.props.stateUpdate({vigency: 'past'})}/>
          <Trigger propState={this.props.vigency} propStateValue='all' icon='nc-icon-mini design_window-responsive'
          payload={() => this.props.stateUpdate({vigency: 'all'})}/>
          <Trigger propState={this.props.vigency} propStateValue='future' icon='nc-icon-mini arrows-2_cross-right'
          payload={() => this.props.stateUpdate({vigency: 'future'})}/>
        </FilterCategory> */}

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
