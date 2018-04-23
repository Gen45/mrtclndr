import React, {Component} from 'react';

// COMPONENTS
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

class Filters extends Component {

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

    return (<div className={`filter ${this.state.collapsed
        ? 'collapsed'
        : ''}`}>
      <Header handleCollapse={this.handleCollapse} icon={this.props.icon} title={this.props.title}/>
      <Content filterName={this.props.filterName} filters={this.props.filters} filterInfo={this.props.filterInfo} handleChange={this.handleChange} labelDot={this.props.labelDot} TooltipTheme='light' tooltips={this.props.tooltips}/>
      <Footer filterName={this.props.filterName} batchChange={this.batchChange}/>
    </div>)
  }
}

export default Filters;
