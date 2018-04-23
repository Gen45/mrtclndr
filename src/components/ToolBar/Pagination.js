import React, {Component} from 'react';

import {_PREV, _NEXT} from '../../config/constants';

class Pagination extends Component {

  handlePagination = increment => {
    const limit = this.props.limit;
    const mode = this.props.time.mode;
    const incrementedValue = (this.props.time[mode] + increment);
    const incrementedYear = mode === 'Y' ? incrementedValue
          : incrementedValue === 0 || incrementedValue > limit[mode] ? this.props.time.Y + increment : this.props.time.Y;

    this.props.time.Y = incrementedYear < limit.Y.start ? limit.Y.end : incrementedYear > limit.Y.end ? limit.Y.start : incrementedYear;
    this.props.time[mode] = mode !== 'Y' ? incrementedValue === 0 ? limit[mode] : incrementedValue > limit[mode] ? 1 : incrementedValue : this.props.time.Y;

    let newState = {};
    newState[mode] = this.props.time[mode];
    newState['Y'] = this.props.time.Y
    this.props.updateState({time: {...this.props.time, ...newState}}, true);
  };

  render() {
    return (
      <span className="pagination">
        <a className="prev">
          <i className="nc-icon-outline arrows-1_minimal-left" onClick={() => this.handlePagination(_PREV) }/>
        </a>
        <a className="next">
          <i className="nc-icon-outline arrows-1_minimal-right" onClick={() => this.handlePagination(_NEXT) }/>
        </a>
      </span>
    )
  }
}

export default Pagination;
