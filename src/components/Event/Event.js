import React, {Component} from 'react';
import {Tooltip} from 'react-tippy';
import TextareaAutosize from 'react-autosize-textarea';
import Select from 'react-select';

import Header from './Header';
import Brands from './Brands';
import Dates from './Dates';
import Timelines from './Timelines';

import {isMultidate, getExtreme, today} from '../../helpers/dates';
import {isValid} from '../../helpers/misc';

import {_COLORS} from '../../config/constants';

const scaryAnimals = [
  { label: "Alligators", value: 1 },
  { label: "Crocodiles", value: 2 },
  { label: "Sharks", value: 3 },
  { label: "Small crocodiles", value: 4 },
  { label: "Smallest crocodiles", value: 5 },
  { label: "Snakes", value: 6 },
];

class Event extends Component {

  componentWillMount() {
    this.setState({});
  }

  handleOpenModal = (targetId) => {
    !this.props.elevated && this.props.handleOpenModal(targetId);
  };

  keepEdits = (e, field) => {
    this.props.event[field] = e.target.value;
  }

  render() {

    const event = this.props.event;
    const regionColor = this.props.event['region'][0].color;
    const offerColor = this.props.event['offer'][0].color;
    const time = this.props.time;
    const multidate = isMultidate(event.dates);
    const isPastEvent = event.latestDay < getExtreme([today()],'right');
    const eventClassName = `event${multidate ? ' MULTIDATE' : ''}${this.props.isModal ? ' grid-view' : ''}${isPastEvent ? ' PAST-EVENT' : ''}`;
    // console.log(regionColor);

    const isHighLighted = () => this.props.modalEventId === event.id;
    const HighLightedStyle = {boxShadow: '0 0 1px 5px rgba(160,160,160, 0.75)'};

    return (
      <div className={eventClassName} onClick={() => {
        this.handleOpenModal(event['id']);}}
        style={isHighLighted() ? HighLightedStyle : {}}
      >
        <div className='event-inner'>
        {
          this.props.view === 'grid' &&
            <Header channels={event.channels} otherChannels={event.otherChannels} color={regionColor} editable={this.props.editable} />
        }
        <div className={`event-info`}>
        {
          this.props.view === 'grid' &&
          <Dates dates={event.dates} editable={this.props.editable} event={this.props.event}/>        
        }

          <div className='info-wrapper'>
            <div className='activity'>
              {
                this.props.editable 
                //? <span><textarea className="editable-field" ref={(input) => this.editedCampaignName = input} defaultValue={event.campaignName} onChange={(e) => this.keepEdits(e)} /></span>
                ? <TextareaAutosize className="editable-field"  defaultValue={event.campaignName} onChange={(e) => this.keepEdits(e, 'campaignName')} />
                : <span> 
                    {
                    this.props.view === 'timeline' && 
                      <span className='label-dot' style={{ backgroundColor: offerColor, marginRight: '10px' }} /> 
                    }
                    {event.campaignName}
                  </span>
              }
            </div>
   
          {
            this.props.view === 'grid' && !this.props.editable &&
            <div>
              <p className='tags'>
                <span className="tag"> 
                  <span style={{ color: _COLORS.LIGHTGRAY }}>Offer: </span>
                  {event.offer[0].name.toUpperCase()} 
                  <span className='label-dot' style={{ backgroundColor: offerColor, marginLeft: '5px' }} /> 
                </span>
              </p>
              <p className='tags'>
                {
                      [
                        { name: "Region", val: event.region[0].name },
                        { name: "Featured Market", val: event.market },
                        { name: "Market Scope", val: event.marketScope },
                        { name: "Campaign Group", val: event.campaignGroup }, 
                        { name: "Program Type", val: event.programType }, 
                        { name: "Segment", val: event.segment },
                        { name: "Ongoing", val: event.ongoing ? 'Yes' : 'No' },
                      ].map((e, i)=> isValid(e.val) ?
                    <span key={i} className='tag'>
                      <span style={{color: _COLORS.LIGHTGRAY }}>{e.name}: </span> {e.val}
                    </span>
                  : null
                  )
                }
              </p>
            </div>
          }
          {
            this.props.view === 'grid' && this.props.editable &&
            <div>
              <p className='tags'>
                <span className="tag editable-field"> 
                  <span style={{ color: _COLORS.LIGHTGRAY }}>Offer: </span>
                  {event.offer[0].name.toUpperCase()} 
                  <span className='label-dot' style={{ backgroundColor: offerColor, marginLeft: '5px' }} /> 
                </span>
              </p>
            </div>
          }          


          {
            this.props.elevated && this.props.view === 'grid' &&
            <div>
            {
              this.props.editable 
              ? <p className='description'><TextareaAutosize  className="editable-field" defaultValue={event.description} onChange={(e) => this.keepEdits(e, 'description')} /> </p>
              : <p className='description'>{event.description}</p>
            }
            </div>
          }
          </div>
        {
          this.props.view === 'grid' &&
          <i className='more'/>
        }
        </div>

      {
        this.props.elevated && this.props.view === 'grid' &&
        <div className='tabs'>
          <div className={`tab-content t1 ${this.props.elevated
              ? ' active'
              : ''}`}>
            <p className='contact ' title={event.owner.name}><i className='nc-icon-mini users_circle-09' style={{color: regionColor}}/> {event.owner.name}</p>
              <Brands brands={event.brands} brandsInfo={this.props.brandsInfo} />
          </div>
        </div>
      }

      </div>

    {
      this.props.view === 'timeline' &&
      <Timelines dates={event.dates} color={regionColor} Y={time.Y} datesType={event.datesType} time={this.props.time} />
    }

    </div>)
  }
}

export default Event;
