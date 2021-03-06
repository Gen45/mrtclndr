export const _PREV = -1;
export const _NEXT = 1;

// export const _BASEURL = 'https://marriottcalendar.com'
// export const _BASEURL = 'http://localhost:3000';
export const _LOGO = {URL:'/images/logo.svg', ALT: 'Marriott Logo'};

export const _MOBILEWIDTH = 650;
export const _SIDEBAR = 300;
export const _DEBOUNCE = 50;

export const _CACHE = '022';

export const _STATE_STRING_MAX_LENGTH = 6500;
export const _ISMOBILE = () => window.innerWidth < _MOBILEWIDTH;

// export const _FILTER_FEATURED_MARKETS = false;
export const _FILTER_FEATURED_MARKETS = true;

export const _DEBUG = false;
// export const _DEBUG = true;

export const _BACKGROUNDIMAGES = {
  IMAGES: ['/images/topographic.png'],
  // IMAGES: ['/images/bokeh.jpg'],
  LENGTH: function() {
    return this.IMAGES.length
  }
};

export const _TRANSITIONTIME = 150;

// COLORS
export const _COLORS = {
  BLACK: "#161616",
  DARKGRAY: "#333333",
  DARKERGRAY: "#2b2b2b",
  DARKISHGRAY: "#595959",
  MEDIUMGRAY: "#666666",
  LIGHTGRAY: "#999999",
  LIGHTERGRAY: "#c2c2c2",
  LIGHTESTGRAY: "#f5f5f5",
  GREEN: "#0fe50f",
  WHITE: "#ffffff",
  ACCENT: "#e4144a",
  SUCCESS: "#70cb74"
};

// export const _WP_URL = 'http://admin.marriottcalendar.loc';
// export const _WP_URL = 'https://marriottcalendar.com/backend';
export const _WP_URL = 'https://marriottcalendar.com/backend';
