import React, {Component} from 'react';
import Vimeo from '@u-wave/react-vimeo';
import {Scrollbars} from 'react-custom-scrollbars';


// STYLES
import '../styles/style.css';

// CONSTANTS
import {  _BACKGROUNDIMAGES,  _COLORS } from '../config/constants';


// LOCAL COMPONENTS
import Header from './Main/Header';

const videos = [
  { id: 312456796, name: 'LOGIN' },
  { id: 312451622, name: 'ADD NEW ENTRY' },
  { id: 312451739, name: 'EDIT ENTRY' },
  { id: 312451714, name: 'DELETE ENTRY' },
  { id: 312580849, name: 'ADDING ENTRY FROM BACKEND' },
  { id: 312456827, name: 'TIME FRAME TOOLS' },
  { id: 312456803, name: 'SORT - ORDER' },
  { id: 312460254, name: 'VALIDITY PERIOD' },
  { id: 312466218, name: 'FILTER BY KEYWORD' },
  { id: 312466369, name: 'ADD STARS' },
];

class Help extends Component {

  render() {
    
    return (

      <div>

      <div className="collapsed">

      <main id="main" className="main help" role="main" style={{ backgroundImage: `url(${_BACKGROUNDIMAGES.IMAGES[0]})` }}>
        
        <Header collapsed={true} noLogout={true} />
        
        <div className="content-frame">
        
              <h1>Help</h1> <div className={`content `}>


<Scrollbars thumbMinSize={100} universal={true} style={{
    height: '100%'
  }} autoHide={true}>



  <div className="videos">

    {videos.map((video, index) => (
      <div className="video">
        <div className="thumb"></div>
          <Vimeo
            video={video.id}
            showTitle={false}
            showPortrait={false}
            showByline={false}
            color={_COLORS.ACCENT}
            onPause={this.handlePlayerPause}
            onPlay={this.handlePlayerPlay}
            onEnd={this.handleEnd}
          />
          {/* <div className="title" >
            {video.name}
          </div> */}

      </div>

    ))}
  </div>



</Scrollbars>
          </div>
        

        </div>
      </main>


    </div>


    </div> 
    
    );
  }
}

export default Help;