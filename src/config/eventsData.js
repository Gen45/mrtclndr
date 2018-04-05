import events from './events.json';
// import offers from './offers.json';
// import channels from './channels.json';
// import regions from './regions.json';
// import brands from './brands.json';

const eventsData = () => {
  return events.map(e => {
    let event = {};

    return {
      id: e["Id"],
      region: e["Owner SubRegion"],
      brands: e["Brand"].split(','),
      campaignName: e["Campaign Name"],
      description: e["Description"],
      campaignGroup: e["Campaign Group"],
      segment: e["Segment"],
      market: e["Entire US"],
      programType: e["Program Type"],
      offer: e["Offer"],
      channels: {
        "EVENTS": e["Events"],
        "MEDIA": e["Media"],
        "CONTENT": e["Content"],
        "DIRECT_MAIL": e["Direct Mail"],
        "EMAIL": e["Email"],
        "ON_PROPERTY": e["On Property"],
        "BRAND_COM": e["Brand-dot-Com"],
        "LOYALTY-OFFER": e["Loyalty"],
        "PR": e["PR"],
        "SOCIAL": e["Social"]
      },
      otherChannels: e["Other Channels"],
      owner: {
        name: e["Owner"]
      },
      dates: {
        sell: {
          start: e["Sell Start Date"],
          end: e["Sell End Date"]
        },
        stay: {
          start: e["Stay Start Date"],
          end: e["Stay End Date"]
        },
        multidate() {
          return (this.sell.start !== this.stay.start || this.sell.end !== this.stay.end)
        }
      }
    }
  });
}

export default eventsData;
