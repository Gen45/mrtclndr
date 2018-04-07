import React, {Component} from 'react';

import Search from './Search';
import Filter from './Filter';

class Sidebar extends Component {

  render() {

    return (
      <aside className="sidebar">

        <header id="sidebar-toggle">
            <span className="icon icon-circle"><i className="nc-icon-outline arrows-1_tail-right"></i></span>
            <h3>Filters</h3>
            <span className="toggle-status collapsed"></span>
        </header>
        <div  className="nano">
            <div className="scroll-wrapper nano-content">

                <Search />
                <Filter
                  title={"Regions"}
                  filterName={"regions"}
                  filters={this.props.regions}
                  titleIcon={"nc-icon-outline travel_world"}
                  updateFilter={this.props.updateFilter}
                />
                <Filter
                  title={"Offers"}
                  filterName={"offers"}
                  titleIcon={"nc-icon-outline ui-1_check-circle-07"}
                  filters={this.props.offers}
                  updateFilter={this.props.updateFilter}/>

            </div>
        </div>


      </aside>
    )
  }
}

export default Sidebar;
