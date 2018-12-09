import axios from 'axios';

import find from 'lodash/find';

import {
  getExtreme
} from '../helpers/dates';

import {
  decodeHTML
} from '../helpers/misc';

const WP_URL = 'http://admin.marriottcalendar.com/wp-json/wp/v2/';
const parameters = '/?per_page=100';

export async function eventsData() {
  try {

    let entries = [];

    const channelPromise = axios(`${WP_URL}channel${parameters}`);
    const brandPromise = axios(`${WP_URL}brand${parameters}`);
    const offerPromise = axios(`${WP_URL}offer${parameters}`);
    const regionPromise = axios(`${WP_URL}region${parameters}`);
    const ownerPromise = axios(`${WP_URL}owner${parameters}`);
    const campaign_groupPromise = axios(`${WP_URL}campaign_group${parameters}`);
    const segmentPromise = axios(`${WP_URL}segment${parameters}`);
    const market_scopePromise = axios(`${WP_URL}market_scope${parameters}`);
    const featured_markets1Promise = axios(`${WP_URL}featured_markets${parameters}&page=1`);
    const featured_markets2Promise = axios(`${WP_URL}featured_markets${parameters}&page=2`);
    const program_typePromise = axios(`${WP_URL}program_type${parameters}`);
    const entry1Promise = axios(`${WP_URL}entry${parameters}&page=1`);
    const entry2Promise = axios(`${WP_URL}entry${parameters}&page=2`); // DISABLE
    const entry3Promise = axios(`${WP_URL}entry${parameters}&page=3`); // DISABLE
    const entry4Promise = axios(`${WP_URL}entry${parameters}&page=4`); // DISABLE
    const entry5Promise = axios(`${WP_URL}entry${parameters}&page=5`); // DISABLE
    // const entry6Promise = axios(`${WP_URL}entry${parameters}&page=6`); // DISABLE //KILL

    const [
      channel,
      brand,
      offer,
      region,
      owner,
      campaign_group,
      segment,
      market_scope,
      featured_markets1,
      featured_markets2,
      program_type,
      entry1,
      entry2, // DISABLE
      entry3, // DISABLE
      entry4, // DISABLE
      entry5,  // DISABLE
      // entry6  // DISABLE //KILL
    ] =
    await Promise.all(
      [channelPromise,
        brandPromise,
        offerPromise,
        regionPromise,
        ownerPromise,
        campaign_groupPromise,
        segmentPromise,
        market_scopePromise,
        featured_markets1Promise,
        featured_markets2Promise,
        program_typePromise,
        entry1Promise,
        entry2Promise,  // DISABLE
        entry3Promise,  // DISABLE
        entry4Promise,  // DISABLE
        entry5Promise,   // DISABLE
        // entry6Promise   // DISABLE //KILL
      ]);


    const featured_marketsALL = [...featured_markets1.data, ...featured_markets2.data];
    // const lastPage = entry6.data.status === 400 ? {} : entry6.data; //KILL
    const entriesALL = [...entry1.data
      , ...entry2.data, ...entry3.data, ...entry4.data, ...entry5.data // DISABLE
      // , ...lastPage // DISABLE //KILL
      ];

    const regions = region.data.map((r) => {
      return {
        id: r.id,
        slug: r.slug,
        count: r.count,
        name: r.name,
        color: r.acf.color
      }
    });

    const channels = channel.data.map((c) => {
      return {
        id: c.id,
        slug: c.slug,
        count: c.count,
        name: c.name,
        icon: c.acf.icon
      }
    });

    const offers = offer.data.map((o) => {
      return {
        id: o.id,
        slug: o.slug,
        count: o.count,
        name: o.name,
        color: o.acf.color
      }
    });    
    
    const brands = brand.data.filter( (b) => { return b.acf.group ===  false; }).map((b) => {
      return {
        id: b.id,
        slug: b.slug,
        count: b.count,
        image: b.acf.logo,
        abreviation: b.acf.abreviation,
        name: b.name
      }
    });

    const brandGroups = brand.data.filter( (bg) => { return bg.acf.group ===  true; }).map((bg) => {
      return {
        id: bg.id,
        slug: bg.slug,
        count: bg.count,
        name: bg.name,
        brands: bg.acf.sub_brands.map(b => find(brand.data, i => i.id === b).slug)
      }
    });

    // var t0 = performance.now();
    let i = [];
    entries = entriesALL.map(e => {
      i.push(e.id);
      return {
        id: e.id,
        region: [find(regions, r => r.id === e.region[0])],
        brands: e.brand.map(b => find(brand.data, i => i.id === b).slug),
        channels: e.channel.map(c => find(channels, i => i.id === c)),
        campaignName: decodeHTML(e.title.rendered),
        description: e.acf.description,
        owner: e.owner[0] ? {
          name: find(owner.data, o => o.id === e.owner[0]).name
        } : {},
        campaignGroup: find(campaign_group.data, cg => cg.id === e.acf.campaign_group).name,
        segment: e.segment[0] ? find(segment.data, s => s.id === e.segment[0]).name : null,
        market: e.featured_markets[0] ? find(featured_marketsALL, fm => fm.id === e.featured_markets[0]).name : null,
        marketScope: e.market_scope[0] ? find(market_scope.data, ms => ms.id === e.market_scope[0]).name : null,
        programType: e.program_type[0] ? find(program_type.data, pt => pt.id === e.program_type[0]).name : null,
        offer: e.offer[0] ? [{
          name: find(offer.data, o => o.id === e.offer[0]).name,
          color: find(offer.data, o => o.id === e.offer[0]).acf.color,
          id: find(offer.data, o => o.id === e.offer[0]).id,
          slug: find(offer.data, o => o.id === e.offer[0]).slug
        }] : [{}],
        otherChannels: e.acf.other_channels,
        ongoing: e.acf.dates.ongoing,
        datesType: e.acf.dates.multidate ? 'MULTIDATE' : 'SINGLEDATE',
        dates: {
          sell: {
            start: e.acf.dates.sell.start,
            end: e.acf.dates.sell.end
          },
          stay: {
            start: e.acf.dates.stay.start,
            end: e.acf.dates.stay.end
          }
        },
        earliestDay: getExtreme([e.acf.dates.sell.start, e.acf.dates.stay.start], 'left'),
        latestDay: getExtreme([e.acf.dates.sell.end, e.acf.dates.stay.end], 'right')
      }
    });

    // console.log(i)
    // var t1 = performance.now();

    // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");

    // console.log(entriesALL);

    return {
      entries,
      channels,
      brands,
      brandGroups,
      offers,
      regions
    };

  } catch (e) {
    console.error(e);
  }
}

export default eventsData;