import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';

import Loading from '../Helpers/Loading';

// COMPONENTS
// import Search from './Search';
import Filter from './Filter/Filter';
import BrandsFilter from './Filter/BrandsFilter';

// DATA
// import regions from '../../config/regions.json';
// import brands from '../../config/brands.json';
// import brandGroups from '../../config/brandGroups.json';
// import offers from '../../config/offers.json';
// import channels from '../../config/channels.json';

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
              {/* <Search /> */}
              <Scrollbars thumbMinSize={100} universal={true} autoHide={true} style={{
                  height: '100%'
                }}>
                <Filter title={"Regions"} filterName={"regions"} filters={this.props.regions} icon={"nc-icon-outline travel_world"} updateFilter={this.props.updateFilter} tooltips={false} batchChange={this.props.batchChange}/>
                <BrandsFilter title={"Brands"} filterName={"brands"} filters={this.props.brands} icon={"nc-icon-outline objects_diamond"} filterCategories={this.props.brandGroups} updateFilter={this.props.updateFilter} tooltips={true} batchChange={this.props.batchChange}/>
                <Filter title={"Offers"} filterName={"offers"} icon={"nc-icon-outline ui-1_check-circle-07"} filters={this.props.offers} updateFilter={this.props.updateFilter} tooltips={false} labelDot={true} batchChange={this.props.batchChange}/>
                <Filter title={"Channels"} filterName={"channels"} icon={"nc-icon-outline ui-1_send"} filters={this.props.channels} updateFilter={this.props.updateFilter} tooltips={false} batchChange={this.props.batchChange}/>
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
