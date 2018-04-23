import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';

// COMPONENTS
// import Search from './Search';
import Filter from './Filter/Filter';
import BrandsFilter from './Filter/BrandsFilter';

// DATA
import regions from '../../config/regions.json';
import brands from '../../config/brands.json';
import brandGroups from '../../config/brandGroups.json';
import offers from '../../config/offers.json';
import channels from '../../config/channels.json';

class Sidebar extends Component {

  componentDidUpdate() {
  }

  handleCollapse = () => {
    this.props.updateState({sidebar: {collapsed: !this.props.collapsed}})
  };

  render() {
    return (<aside className="sidebar">
      <header onClick={() => {
          this.handleCollapse();
        }}>
        <span className="icon">
          <i className="nc-icon-outline arrows-1_tail-right"></i>
        </span>
        <h3>Filters</h3>
        <span className={`toggle-status ${this.props.collapsed
            ? 'collapsed'
            : ''}`}></span>
      </header>

        <div className="nano">
          {/* <div className="scroll-wrapper nano-content"> */}
            {/* <Search /> */}
            <Scrollbars thumbMinSize={100} universal={true} autoHide={true} style={{
                height: '100%'
              }}>
              <Filter title={"Regions"} filterName={"regions"} filters={this.props.regions} icon={"nc-icon-outline travel_world"} filterInfo={regions} updateFilter={this.props.updateFilter} tooltips={false} />
              <BrandsFilter title={"Brands"} filterName={"brands"} filters={this.props.brands} icon={"nc-icon-outline objects_diamond"} filterInfo={brands} filterCategories={brandGroups} updateFilter={this.props.updateFilter} tooltips={true} />
              <Filter title={"Offers"} filterName={"offers"} icon={"nc-icon-outline ui-1_check-circle-07"} filters={this.props.offers} filterInfo={offers} updateFilter={this.props.updateFilter}  tooltips={false} labelDot={true}/>
              <Filter title={"Channels"} filterName={"channels"} icon={"nc-icon-outline ui-1_send"} filters={this.props.channels} filterInfo={channels} updateFilter={this.props.updateFilter} tooltips={false} />
            </Scrollbars>
          {/* </div> */}
        </div>

    </aside>)
  }
}

export default Sidebar;
