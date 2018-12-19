import axios from 'axios';

import find from 'lodash/find';

import {
  getExtreme, isMultidate
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
    const entry1Promise = axios(`${WP_URL}entry${parameters}&page=1`); // DISABLE 0
    const entry2Promise = axios(`${WP_URL}entry${parameters}&page=2`); // DISABLE 1
    const entry3Promise = axios(`${WP_URL}entry${parameters}&page=3`); // DISABLE 2
    const entry4Promise = axios(`${WP_URL}entry${parameters}&page=4`); // DISABLE 3
    const entry5Promise = axios(`${WP_URL}entry${parameters}&page=5`); // DISABLE 4

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
      entry1, // DISABLE 0
      entry2, // DISABLE 1
      entry3, // DISABLE 2
      entry4, // DISABLE 3
      entry5,  // DISABLE 4
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
        entry1Promise, // DISABLE 0
        entry2Promise,  // DISABLE 1
        entry3Promise,  // DISABLE 2
        entry4Promise,  // DISABLE 3
        entry5Promise,   // DISABLE 4
      ]);


    const featured_marketsALL = [...featured_markets1.data, ...featured_markets2.data];

    const entriesALL = [
      ...entry1.data, // DISABLE 0
      ...entry2.data, // DISABLE 1
      ...entry3.data, // DISABLE 2
      ...entry4.data, // DISABLE 3
      ...entry5.data // DISABLE 4       
      ];

    // console.log(entriesALL);

    const regions = region.data.map((r) => {
      return {
        id: r.id,
        slug: r.slug,
        count: r.count,
        name: decodeHTML(r.name),
        color: r.acf.color
      }
    });

    const channels = channel.data.map((c) => {
      return {
        id: c.id,
        slug: c.slug,
        count: c.count,
        name: decodeHTML(c.name),
        icon: c.acf.icon
      }
    });

    const offers = offer.data.map((o) => {
      return {
        id: o.id,
        slug: o.slug,
        count: o.count,
        name: decodeHTML(o.name),
        color: o.acf.color
      }
    });    
    
    const brands = brand.data.filter( (b) => { return b.acf.group === false; }).map((b) => {
      return {
        id: b.id,
        slug: b.slug,
        count: b.count,
        image: b.acf.logo,
        abreviation: b.acf.abreviation,
        name: decodeHTML(b.name)
      }
    });

    const brandGroups = brand.data.filter( (bg) => bg.acf.group ===  true ).map((bg) => {
      return {
        id: bg.id,
        slug: bg.slug,
        count: bg.count,
        name: decodeHTML(bg.name),
        preset: bg.acf.preset,
        brands: bg.acf.sub_brands.map(b => find(brand.data, i => i.id === b).id)
      }
    });

    const featured_markets = featured_marketsALL.map((b) => {
      return {
        id: b.id,
        slug: b.slug,
        count: b.count,
        name: decodeHTML(b.name)
      }
    });

    const campaign_groups = campaign_group.data.map((o) => {
      return {
        id: o.id,
        slug: o.slug,
        count: o.count,
        name: decodeHTML(o.name)
      }
    });   
    
    const market_scopes = market_scope.data.map((o) => {
      return {
        id: o.id,
        slug: o.slug,
        count: o.count,
        name: decodeHTML(o.name)
      }
    });   

    const program_types = program_type.data.map((o) => {
      return {
        id: o.id,
        slug: o.slug,
        count: o.count,
        name: decodeHTML(o.name)
      }
    });   

    const segments = segment.data.map((o) => {
      return {
        id: o.id,
        slug: o.slug,
        count: o.count,
        name: decodeHTML(o.name)
      }
    });  
    
    const owners = owner.data.map((o) => {
      return {
        id: o.id,
        slug: o.slug,
        count: o.count,
        name: decodeHTML(o.name)
      }
    });  

    // console.log(entriesALL[0]);

    // var t0 = performance.now();
    entries = entriesALL.map(e => {

      const dates = {
        sell: {
          start: e.acf.dates.sell.start,
          end: e.acf.dates.sell.end
        },
        stay: {
          start: e.acf.dates.stay.start,
          end: e.acf.dates.stay.end
        }
      };
      
      const _brands = e.brand.length > 0 ? e.brand : [find(brand.data, x => x.slug === 'no-brand').id];
      const _channels = e.channel.length > 0 ? e.channel : [find(channel.data, x => x.slug === 'no-channel').id];
      const _offers = e.offer[0] ? find(offer.data, x => x.id === e.offer[0]) : find(offer.data, x => x.slug === 'no-offer');
      const _featured_markets = e.featured_markets[0] ? find(featured_marketsALL, x => x.id === e.featured_markets[0]) : find(featured_marketsALL, x => x.slug === 'no-featured-market');
      const _campaign_groups = e.campaign_group[0] ? find(campaign_group.data, x => x.id === e.campaign_group[0]) : find(campaign_group.data, x => x.slug === 'no-campaign-group');
      const _market_scopes = e.market_scope[0] ? find(market_scope.data, x => x.id === e.market_scope[0]) : find(market_scope.data, x => x.slug === 'no-market-scope');
      const _program_types = e.program_type[0] ? find(program_type.data, x => x.id === e.program_type[0]) : find(program_type.data, x => x.slug === 'no-program-type');
      const _segments = e.segment[0] ? find(segment.data, x => x.id === e.segment[0]) : find(segment.data, x => x.slug === 'no-segment');
      const _owners = e.owner[0] ? find(owner.data, x => x.id === e.owner[0]) : find(owner.data, x => x.slug === 'no-owner');
      const _regions = e.region[0] ? find(region.data, x => x.id === e.region[0]) : find(region.data, x => x.slug === 'no-region');
      
      // console.log(e, _campaign_groups, campaign_groups.data);

      return {
        id: e.id,
        wp_link: e.link,

        campaignName: decodeHTML(e.title.rendered) || '',
        description: e.acf.description || '',
        
        region: [{ id: _regions.id, color: _regions.acf.color, name: _regions.name}],
        brands: [...new Set(_brands.reduce(
          (bs, b) => {
            const _brand = find(brand.data, i => i.id === b);
            return _brand.acf.group ? [..._brand.acf.sub_brands, ...bs] : [b, ...bs];
          }
          ,[]))],
        channels: _channels,
        offer: [{ id: _offers.id, name: _offers.name, color: _offers.acf.color }],
        featured_market: [{ id: _featured_markets.id, name: _featured_markets.name }],
        campaign_group: [{ id: _campaign_groups.id, name: _campaign_groups.name }],
        market_scope: [{ id: _market_scopes.id, name: _market_scopes.name }],
        program_type: [{ id: _program_types.id, name: _program_types.name }],
        segment: [{ id: _segments.id, name: _segments.name }],
        owner:  [{ id: _owners.id, name: _owners.name }],

        otherChannels: e.acf.other_channels || '',
        ongoing: e.acf.dates.ongoing,
        datesType: isMultidate(dates) ? 'MULTIDATE' : 'SINGLEDATE',

        dates: dates,
        earliestDay: getExtreme([dates.sell.start, dates.stay.start], 'left'),
        latestDay: getExtreme([dates.sell.end, dates.stay.end], 'right')
      }

    });

    // let entriesNamed = {};

    // for( let e of entries ) {
    //   entriesNamed[e.id] = e;
    // }

    // console.log(entriesNamed);
    // var t1 = performance.now();


    // console.log(entriesALL);

    return {
      entries,
      channels,
      brands,
      brandGroups,
      offers,
      regions,
      featured_markets,
      campaign_groups,
      market_scopes,
      program_types,
      segments,
      owners
    };

  } catch (e) {
    console.error(e);
  }
}

export default eventsData;