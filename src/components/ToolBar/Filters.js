import React, {Component} from 'react';

import {TriggerBox} from './Triggers';

export class Header extends Component {
  render() {
    return (
      <header>
        {this.props.children}
      </header>
    )
  }
}

export const FilterCategory = props => !props.disabled && <div className="filter-category">{props.children}</div>

// width={window.innerWidth + 75}
export class FiltersGroup extends Component {
  render() {
    return (
      <div>
        {
          !this.props.disabled &&
          <nav className='filters-group'>
            {
              this.props.collapsed ?
              <TriggerBox title={this.props.title} icon={this.props.icon} width={250} draggable={false} align='left'>
                {this.props.children}
              </TriggerBox> :
              <div>{this.props.children}</div>
            }
          </nav>
        }
      </div>
    )
  }
}
