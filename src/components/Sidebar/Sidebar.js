import React, {Component} from 'react';

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

  componentDidUpdate(){
    // console.log('sidebar updated');
  }

  render() {
    return (
      <aside className="sidebar">
        <header id="sidebar-toggle" onClick={() => {
            this.props.handleCollapse();
          }}
        >
            <span className="icon icon-circle"><i className="nc-icon-outline arrows-1_tail-right"></i></span>
            <h3>Filters</h3>
            <span className={`toggle-status ${this.props.collapsed ? 'collapsed' : ''}`}></span>
        </header>
        <div  className="nano">
            <div className="scroll-wrapper nano-content">

                {/* <Search /> */}
                <Filter
                  title={"Regions"}
                  filterName={"regions"}
                  filters={this.props.regions}
                  titleIcon={"nc-icon-outline travel_world"}
                  filterInfo={regions}
                  updateFilter={this.props.updateFilter}
                />
                <BrandsFilter
                  title={"Brands"}
                  filterName={"brands"}
                  filters={this.props.brands}
                  titleIcon={"nc-icon-outline objects_diamond"}
                  filterInfo={brands}
                  filterCategories={brandGroups}
                  updateFilter={this.props.updateFilter}
                />
                <Filter
                  title={"Offers"}
                  filterName={"offers"}
                  titleIcon={"nc-icon-outline ui-1_check-circle-07"}
                  filters={this.props.offers}
                  filterInfo={offers}
                  updateFilter={this.props.updateFilter}
                />
                <Filter
                  title={"Channels"}
                  filterName={"channels"}
                  titleIcon={"nc-icon-outline ui-1_send"}
                  filters={this.props.channels}
                  filterInfo={channels}
                  updateFilter={this.props.updateFilter}
                />
            </div>
        </div>


      </aside>
    )
  }
}

export default Sidebar;
