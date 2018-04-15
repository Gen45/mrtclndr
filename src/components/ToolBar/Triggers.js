import React, {Component} from 'react';

import OutsideAlerter from '../Helpers/OutsideAlerter';

export class TriggerBox extends Component {

  state = {
    open: false
  }

  toggleBox = () => {
    const open = !this.state.open;
    this.setState({open});
  };

  render() {
    return (<div className="inner">
      <a id="trigger-sort-tools" className="nav-trigger" onClick={() => this.toggleBox()}>
        <i className={this.props.icon}/> {` ${this.props.title}`}
      </a>
      {
        this.state.open && <OutsideAlerter event={this.toggleBox}>
            <span className="trigger-box-children active">
              <div className="close-button" onClick={() => this.toggleBox()}/> {this.props.children}
            </span>
          </OutsideAlerter>
      }
    </div>)
  }
}

export class Trigger extends Component {

  isActive = (propState, propStateValue) =>
    propState === propStateValue
      ? 'active'
      : '';

  handleClick = payload => payload();

  render() {
    return (<a className={`nav-trigger ${this.isActive(this.props.propState, this.props.propStateValue)}`} onClick={() => this.handleClick(this.props.payload)}><i className={this.props.icon}/> {this.props.children}</a>);
  }
}

export default Trigger;
