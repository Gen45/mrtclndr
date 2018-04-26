import React, {Component} from 'react';
import Draggable from 'react-draggable';
import OutsideAlerter from '../Helpers/OutsideAlerter';
import {Tooltip} from 'react-tippy';

import {isValid} from '../../helpers/misc';

export class TriggerBox extends Component {

  state = {
    open: false
  }

  toggleBox = () => {
    const open = !this.state.open;
    this.setState({open});
  };

  render() {
    const triggerClass = this.props.triggerClass || 'nav-trigger';
    return (
        <div className="inner">
        <a className={triggerClass} onClick={() => this.toggleBox()}>
          <i className={this.props.icon}/> {` ${isValid(this.props.title) ? this.props.title : ''}`}
        </a>
        {
          this.state.open &&
            <OutsideAlerter event={this.toggleBox}>
              <Draggable disabled={!this.props.draggable}>
                <span className="trigger-box-children active" style={{width: this.props.width || 200, textAlign: this.props.align || "center"}}>
                  <div className="close-button" onClick={() => this.toggleBox()}>
                    {this.props.title && <span><i className={this.props.icon}/> {` ${this.props.title}`}</span>}
                  </div>
                  {this.props.children}
                </span>
              </Draggable>
            </OutsideAlerter>
        }
      </div>
    )
  }
}

export class Trigger extends Component {

  isActive = (propState, propStateValue) =>
    propState === propStateValue && isValid(propState) && isValid(propStateValue)
      ? 'active'
      : '';

  handleClick = payload => payload();

  render() {
    const triggerClass = this.props.triggerClass || 'nav-trigger';
    const active = this.isActive(this.props.propState, this.props.propStateValue);
    const icon = active === 'active' && this.props.iconActive
      ? this.props.iconActive
      : this.props.icon;
    return (
    <Tooltip title={this.props.caption} trigger="mouseenter" delay={500} arrow={true} distance={15} theme="light" size="big" disabled={!this.props.caption}>
      <a className={`${triggerClass} ${active}`} onClick={() => this.handleClick(this.props.payload)}>
        <i className={icon}/> {this.props.children}
      </a>
    </Tooltip>);
  }
}

export default Trigger;
