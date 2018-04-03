import React, {Component} from 'react';

import Search from './Search';
import Regions from './Regions';

class Sidebar extends Component {

  render(props) {

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
                <Regions title={"Regions"} regions={this.props.regions} titleIcon={"nc-icon-outline travel_world"} updateRegion={this.props.updateRegion}/>
                {/* <Brands /> */}
                {/* <Offers /> */}
                {/* <Channels /> */}

                {/* <?php include "_sidebar/_regions.php"; ?>
                <?php include "_sidebar/_brands.php"; ?>
                <?php include "_sidebar/_offers.php"; ?>
                <?php include "_sidebar/_channels.php"; ?> */}
            </div>
        </div>


      </aside>
    )
  }
}

export default Sidebar;
