import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';

// COMPONENTS
import Content from './Content';
import Footer from './Footer';

class BrandsFilter extends Component {

  state = {
    collapsed: false
  }

  componentDidUpdate() {
    // console.log('filter ' + this.props.title + ' updated');
  }

  handleChange = (event, filter, active) => {
    this.props.updateFilter(filter, this.props.filterName, event.target.checked);
  };

  batchChange = (active) => {
    for (let filter in this.props.filters) {
      this.props.updateFilter(filter, this.props.filterName, active);
    }
  };

  handleCollapse = () => {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  };

  render() {
    const filterName = this.props.filterName;
    const filterCategories = this.props.filterCategories;
    const filters = this.props.filters;

    return (<div className={`filter ${this.state.collapsed
        ? 'collapsed'
        : ''} filter-wrap-${this.props.filterName}`}>
      <header onClick={() => {
          this.handleCollapse();
        }}>
        <span className="icon icon-circle">
          <i className={this.props.titleIcon}></i>
        </span>
        <h3>{this.props.title}</h3>
      </header>
      <div className="content">
        <div className="brand-cat-filters">

          {/* <div id="BRAND_SEARCH">
            <div className="input-icon">
              <input id="search_brand_box" className="search-box rounded" type="text" placeholder="Filter Brands"/>
              <i className="nc-icon-mini ui-1_zoom"></i>
            </div>
          </div> */}

          {/* <FilterCategory category={"ALL"}/>
          {Object.keys(filterCategories).map((r, i) => <FilterCategory key={i} category={filterCategories[r]["name"].toUpperCase()}/>)} */}

        </div>

        <div className="brand-filters">
          <Scrollbars thumbMinSize={100} universal={true} style={{
              height: '100%'
            }}>

            {
              Object.keys(filterCategories).map((c, i) =>
              <div key={i} id={filterCategories[c]["name"].toUpperCase()} className="brand-category">
                <h4>
                  <span>{filterCategories[c]["name"]}</span>
                </h4>
                <Content filterName={filterName} filters={filters} filterCategories={filterCategories[c]["brands"]} filterInfo={this.props.filterInfo} handleChange={this.handleChange} inner={true}/>
              </div>)
            }

          </Scrollbars>
        </div>

      </div>
      <Footer filterName={filterName} batchChange={this.batchChange}/>
    </div>)
  }
}

export default BrandsFilter;
