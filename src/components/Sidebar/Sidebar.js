import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';

import Loading from '../Helpers/Loading';

// COMPONENTS
import Filter from './Filter/Filter';
import BrandsFilter from './Filter/BrandsFilter';


class Sidebar extends Component {

  componentDidUpdate() {}

  handleCollapse = () => {
    this.props.updateState({
      sidebar: {
        collapsed: !this.props.collapsed
      }
    })
  };

  render() {

    // console.log(this.props.brandGroups);

    return (<aside className={`sidebar${this.props.disabled ? ' disabled': ''}`}>
      <header onClick={() => {
          this.handleCollapse();
        }}>
        <span className="icon icon-circle">
          <i className={`nc-icon-outline ${this.props.collapsed
              ? 'arrows-2_small-left'
              : 'arrows-2_small-right'}`}></i>
        </span>
        <h3>Filters</h3>
        <span className={`toggle-status ${this.props.collapsed
            ? 'collapsed'
            : ''}`}></span>
      </header>
      {
        this.props.ready
          ? <div className="nano">
              <Scrollbars thumbMinSize={100} universal={true} autoHide={true} style={{
                  height: '100%'
                }}>
                <Filter       events={this.props.events} title={"Regions"} filtersList={this.props.filtersList} filterName={"regions"} filters={this.props.regions} icon={"nc-icon-outline travel_world"} updateFilter={this.props.updateFilter} tooltips={false} batchChange={this.props.batchChange}/>
                <BrandsFilter events={this.props.events} title={"Brands"} filtersList={this.props.filtersList} filterName={"brands"} filters={this.props.brands} icon={"nc-icon-outline objects_diamond"} filterCategories={this.props.brand_groups} updateFilter={this.props.updateFilter} tooltips={true} batchChange={this.props.batchChange}/>
                <Filter       events={this.props.events} title={"Offers"} filtersList={this.props.filtersList} filterName={"offers"} icon={"nc-icon-outline ui-1_check-circle-07"} filters={this.props.offers} updateFilter={this.props.updateFilter} tooltips={false} labelDot={true} batchChange={this.props.batchChange}/>
                <Filter       events={this.props.events} title={"Channels"} filtersList={this.props.filtersList} filterName={"channels"} icon={"nc-icon-outline ui-1_send"} filters={this.props.channels} updateFilter={this.props.updateFilter} tooltips={false} batchChange={this.props.batchChange}/>
                <Filter       events={this.props.events} title={"Owners"} filtersList={this.props.filtersList} filterName={"owners"} icon={"nc-icon-outline users_circle-09"} filters={this.props.owners} updateFilter={this.props.updateFilter} tooltips={false} batchChange={this.props.batchChange}/>
              </Scrollbars>
            </div>
          :
          <Loading>
            <span>
              <i className="nc-icon-outline ui-2_time"/>
              <br/>
              Loading
            </span>
          </Loading>

      }

    </aside>)
  }
}

export default Sidebar;
