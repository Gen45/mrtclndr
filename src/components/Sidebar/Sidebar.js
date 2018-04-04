import React, {Component} from 'react';

import Search from './Search';
import Regions from './Regions';
// import Brands from './Brands';
import Offers from './Offers';
// import Channels from './Channels';

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
                {/* <Brands title={"Brands"} brands={this.props.brands} titleIcon={"nc-icon-outline objects_diamond"} updateBrands={this.props.updateBrands}/> */}
                <Offers title={"Offers"} offers={this.props.offers} titleIcon={"nc-icon-outline ui-1_check-circle-07"} updateOffer={this.props.updateOffer}/>
                {/* <Channels /> */}
            </div>
        </div>


      </aside>
    )
  }
}

export default Sidebar;
