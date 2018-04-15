import React, {Component} from 'react';

class Content extends Component {

  render() {

    const filterCategories = this.props.filterCategories
      ? this.props.filterCategories
      : [];

    const putColor = color => color ? {backgroundColor: color, borderColor: color}: {};

    return (<div className={`content${this.props.inner
        ? '-inner'
        : ''}`}>
      {
        Object.keys(this.props.filters).map((r, i) => {

          const filter = r.toUpperCase();
          const filterName = this.props.filterInfo[r]["name"].toUpperCase();
          const filterIcon = this.props.filterInfo[r]["icon"] || false;
          const filterImage = this.props.filterInfo[r]["image"] || false;
          const active = this.props.filters[r];
          const color = this.props.filterInfo[r]["color"] || false;

          // console.log(color, putColor(color));

          // if (this.props.filterCategories.indexOf(r) )
          return (filterCategories.indexOf(r) > -1 || filterCategories.length === 0)
            ? <span key={i} className={`filter-tag`}>
                <input type="checkbox" id={`filter-${filter}`} checked={active} onChange={(event) => {
                    this.props.handleChange(event, filter, active)
                  }}/>

                <label htmlFor={`filter-${filter}`} style={putColor(color)} >{filterIcon && <i className={filterIcon} />}{" "}
                  {
                    filterImage
                      ? <img src={filterImage} alt=""/>
                      : filterName
                  }
                </label>
              </span>
            : null;
        })
      }
    </div>)
  }
}

export default Content;
