import React, {Component} from 'react';
import {Tooltip} from 'react-tippy';

// import {shadeColor} from '../../../helpers/colors';

class Button extends Component {

  componentWillMount() {
    this.setState({active: this.props.active});
  }

  render() {

    const filter = this.props.filter;
    const filterName = this.props.filterName;
    const filterIcon = this.props.filterIcon || false;
    const filterImage = this.props.filterImage || false;
    const active = this.props.active;
    const labelDot = this.props.labelDot;
    const color = active || labelDot ? this.props.color : "rgba(153, 153, 153, 0.3)" || false;

    const putColor = color => color && !labelDot ? {backgroundColor: color, borderColor: color}: {};

    const ButtonContent = (props) => <span>
      {labelDot && <span className='label-dot' style={{backgroundColor: color}}/> }
      {filterIcon && <i className={filterIcon} />}{" "}
      {filterImage && !props.isTooltip ? <img src={filterImage} alt={filterName}/> : `${props.isTooltip ? filterName : filterName.toUpperCase()}`}
    </span>

    return (

      <Tooltip
        disabled={!this.props.tooltips}
        trigger="mouseenter"
        delay={200}
        arrow={true}
        distance={30}
        theme={this.props.TooltipTheme}
        size="big"
        html={(
          <ButtonContent isTooltip={true} />
        )}
      >
        <span className={`filter-tag`}>
          <input type="checkbox" id={`filter-${this.props.filter}`} checked={active} onChange={(event) => {
              this.props.handleChange(event, filter, active)
            }}/>

          <label htmlFor={`filter-${filter}`} style={putColor(color)} >
            <ButtonContent />
          </label>
        </span>
      </Tooltip>
    )
  }
}

export default Button;
