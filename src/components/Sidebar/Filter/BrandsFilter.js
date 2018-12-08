import React, {Component} from 'react';

import {Scrollbars} from 'react-custom-scrollbars';
import {ResizableBox} from 'react-resizable';

// COMPONENTS
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

import {isValid} from '../../../helpers/misc';

class BrandsFilter extends Component {

  state = {
    collapsed: false
  }

  componentDidUpdate() {
    // // console.log('filter ' + this.props.title + ' updated');
  }

  handleChange = (event, filter, active) => {
    this.props.updateFilter(filter, this.props.filterName, event.target.checked);
  };

  // batchChange = (active) => {
  //   for (let filter in this.props.filters) {
  //     this.props.updateFilter(filter, this.props.filterName, active);
  //   }
  // };

  handleCollapse = () => {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  };

  handleSearch = (e, target) => {
    this.setState({keyPhrase: target.value.toUpperCase()});
  };

  handleClearSearch = () => {
    this.setState({keyPhrase: ''});
    this.search.value = '';
  };

  render() {
    const filterName = this.props.filterName;
    const filterCategories = this.props.filterCategories;
    const filters = this.props.filters;


    return (<div className={`filter ${this.state.collapsed
                ? 'collapsed'
                : ''} filter-wrap-${this.props.filterName}`}>

              <Header handleCollapse={this.handleCollapse} icon={this.props.icon} title={this.props.title}/>

              <div className="content">
                <div className="brand-cat-filters">
                  <div className="input-icon">
                    <input id="search_brand_box" ref={(input) => this.search = input} className="search-box rounded" type="text" placeholder="Brand Search" onChange={(e) => {
                        this.handleSearch(e, this.search)
                      }}/> {
                      isValid(this.state.keyPhrase)
                        ? <i className="nc-icon-mini ui-1_circle-remove" onClick={() => {
                              this.handleClearSearch()
                            }} style={{
                              cursor: 'pointer'
                            }}/>
                        : <i className="nc-icon-mini ui-1_zoom"/>
                    }
                  </div>
                </div>

                {/* <FilterCategory category={"ALL"}/>
          {Object.keys(filterCategories).map((r, i) => <FilterCategory key={i} category={filterCategories[r]["name"].toUpperCase()}/>)}
        </div> */
                }

                <div className="brand-filters">

                  <ResizableBox width={280} height={255} minConstraints={[0, 0]} axis='y'>
                    <Scrollbars thumbMinSize={50} universal={true} style={{
                        height: 100 + '%'
                      }} autoHide={true}>

                      {
                        Object.keys(filterCategories).map((c, i) => {
                          const keyPhrase = this.state.keyPhrase !== "" && isValid(this.state.keyPhrase)
                            ? this.state.keyPhrase
                            : '';
                          // const validKeyPhrase = this.props.filters[r]["name"].toUpperCase().indexOf(keyPhrase) > -1;

                  // console.log(filterCategories[c]["brands"]);

                  const isInSearch = filterCategories[c]["brands"].map((b, i) => { 
                    // console.log(this.props.filters)

                    return this.props.filters[b]["name"]
                    }).join('').toUpperCase().indexOf(keyPhrase) > -1
                            ? true
                            : false;

                          return isInSearch || keyPhrase === "" || keyPhrase === undefined
                            ? <div key={i} id={filterCategories[c]["name"].toUpperCase()} className="brand-category">
                                <h4>
                                  <span>{filterCategories[c]["name"]}</span>
                                </h4>
                                <Content filterName={filterName} filters={filters} filterCategories={filterCategories[c]["brands"]} handleChange={this.handleChange} inner={true} keyPhrase={keyPhrase} tooltips={this.props.tooltips} TooltipTheme='dark'></Content>
                              </div>
                            : null
                        })
                      }

                    </Scrollbars>
                  </ResizableBox>
                </div>

              </div>
              <Footer filterName={this.props.filterName} filters={this.props.filters} batchChange={this.props.batchChange}/>
            </div>)
  }
}

export default BrandsFilter;
