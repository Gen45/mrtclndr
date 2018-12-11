import React, { Component } from "react";

class EnterData extends Component {
  
  render() {
    console.log(Object.keys(this.props));
    return (
      <div className="main-overlay">
        <div className="enter-data-wrapper">
          <div className="enter-data-header">
            <h2>Add New Entry</h2>
          </div>
          <div className="enter-data-body">
            <div className="col col-full">
              <div className="form-input">
                <input type="text" placeholder="Enter new campaign name" />
              </div>
            </div>
            <div className="col col-1">

          

            <div className="form-input">
              <h3>Description</h3>
              <textarea name="description" id="" cols="30" rows="10" placeholder="Enter the description" />
            </div>

            <div className="form-input form-input--2-cols">
              <h3>Dates</h3>
              <div className="row">
                <div className="col col-50"><input type="text" placeholder="Sell Start" /></div>
                <div className="col col-50 col-end"><input type="text" placeholder="Sell End" /></div>
              </div>
              <div className="row">
                <div className="col col-50"><input type="text" placeholder="Stay Start" /></div>
                <div className="col col-50 col-end"><input type="text" placeholder="Stay End" /></div>
              </div>
            </div>

            </div>
            <div className="col col-2">
            <div className="form-input">
              <h3>Region</h3>
              <div className="form-input form-input--tags">
              {
                Object.keys(this.props.regions).map( x => 
                  <div className="form-input--tags-wrapper" key={x}>
                    <input id={this.props.regions[x].slug} type="radio" name="regions" value={this.props.regions[x].id} />
                    <label htmlFor={this.props.regions[x].slug} >
                      {this.props.regions[x].name.toUpperCase()}
                    </label>
                  </div>
                )
              }
              </div>
              <small className="message">Please choose <strong>one</strong></small>
            </div>
            <div className="form-input">
              <h3>Offer</h3>
              <div className="form-input form-input--tags">
              {
                Object.keys(this.props.offers).map( x => 
                  <div className="form-input--tags-wrapper" key={x}>
                    <input id={this.props.offers[x].slug} type="radio" name="offers" value={this.props.offers[x].id} />
                    <label htmlFor={this.props.offers[x].slug} >
                      {this.props.offers[x].name.toUpperCase()}
                    </label>
                  </div>
                )
              }
              </div>
              <small className="message">Please choose <strong>one</strong></small>
            </div>
            <div className="form-input">
              <h3>Channels</h3>
              <div className="form-input form-input--tags">
              {
                Object.keys(this.props.channels).map( x => 
                  <div className="form-input--tags-wrapper" key={x}>
                    <input id={this.props.channels[x].slug} type="radio" name="channels" value={this.props.channels[x].id} />
                    <label htmlFor={this.props.channels[x].slug} >
                      {this.props.channels[x].name.toUpperCase()}
                    </label>
                  </div>
                )
              }
              </div>
              <small className="message">Please choose <strong>one</strong></small>
            </div>                           
            </div>
          </div>
          <div className="enter-data-footer"></div>
        </div>
      </div>
    );
  }
}

export default EnterData;
