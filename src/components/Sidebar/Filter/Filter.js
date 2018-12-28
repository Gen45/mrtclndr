import React, {Component} from 'react';

// import {_LOGO} from '../../../config/constants';

// COMPONENTS
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

class Filters extends Component {

  state = {
    collapsed: false
  }

  handleChange = (event, filter, active) => {
    // console.log(event, filter, event.target.checked);
    this.props.updateFilter(filter, this.props.filterName, event.target.checked);
  };

  handleCollapse = () => {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  };

  render() {

    return (<div className={`filter ${this.state.collapsed
                ? 'collapsed'
                : ''}`}>
              <Header handleCollapse={this.handleCollapse} icon={this.props.icon} title={this.props.title}/>
              <Content filterName={this.props.filterName} filters={this.props.filters} handleChange={this.handleChange} labelDot={this.props.labelDot} TooltipTheme='light' tooltips={this.props.tooltips} filtersList={this.props.filtersList} />
              <Footer filterName={this.props.filterName} filters={this.props.filters} batchChange={this.props.batchChange}/>
            </div>)
  }
}

export default Filters;
