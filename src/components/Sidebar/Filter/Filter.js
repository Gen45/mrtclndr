import React, {Component} from 'react';

// COMPONENTS
import Content from './Content';
import Footer from './Footer';

class Filters extends Component {

  state = {
    collapsed : false
  }

  componentDidUpdate(){
    // console.log('filter ' + this.props.title + ' updated');
  }

  handleChange = (event, filter, active) => {
    this.props.updateFilter(filter, this.props.filterName, event.target.checked);
  };

  batchChange = (active) => {
    for(let filter in this.props.filters) {
      this.props.updateFilter(filter, this.props.filterName, active);
    }
  };

  handleCollapse = () => {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed });
  };

  render() {

    return (<div className={`filter ${this.state.collapsed ? 'collapsed' : ''}`}>
      <header onClick={() => {
          this.handleCollapse();
        }}
      >
        <span className="icon icon-circle">
          <i className={this.props.titleIcon}></i>
        </span>
        <h3>{this.props.title}</h3>
      </header>

      <Content filterName={this.props.filterName} filters={this.props.filters} filterInfo={this.props.filterInfo} handleChange={this.handleChange} labelDot={this.props.labelDot}/>

      <Footer filterName={this.props.filterName} batchChange={this.batchChange} />
    </div>)
  }
}

export default Filters;
