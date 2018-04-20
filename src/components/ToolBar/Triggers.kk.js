import React, {Component} from 'react';
import Draggable from 'react-draggable';
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
    return (

<div>
{
      !this.props.renderChildren ?

      <div className="inner">
        <a className="nav-trigger" onClick={() => this.toggleBox()}>
          <i className={this.props.icon}/> {` ${this.props.title}`}
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
      :
      <div>
        {this.props.children}
      </div>
}
</div>

    )
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
