// TODO TOOOOOOOOOOOOOODO

activeFilter = (filterType) => {
  return Object.keys(filterType).filter((f, i) => filterType[f] === true)
};

prepareEventList = (events, filter, field) => {
  return events.filter(e => this.activeFilter(filter).indexOf(e[field]) >= 0);
};

prepareEventListMulti = (events, filter, field) => {
  const ev = events.filter(e => e[field].reduce((x, c) => x || (this.activeFilter(filter).indexOf(c) >= 0), false));
  return ev;
};

export const filterByTime = (events, timeRange) => events.filter(e => !(e.latestDay < timeRange.earliestDay || e.earliestDay > timeRange.latestDay));

export const filterByFilter = events => this.prepareEventList(events, this.state.regions, "region");
export const filterByTime = events => this.prepareEventList(events, this.state.offers, "offer");

export const filterByTime = events => this.prepareEventListMulti(events, this.state.brands, "brands");
export const filterByTime = events => this.prepareEventListMulti(events, this.state.channels, "channels");

export const filterByTime = events => events.filter(e => !this.state.vigency.past ? !(e.latestDay < dayOfTheYear) : true );
export const filterByTime = events => events.filter(e => !this.state.vigency.between ? !(e.latestDay >= dayOfTheYear && e.earliestDay <= dayOfTheYear) : true );
export const filterByTime = events => events.filter(e => !this.state.vigency.future ? !(e.earliestDay > dayOfTheYear) : true );
export const filterByTime = events => events.filter(e => this.state.starred.show ? (this.state.starred.items.indexOf(e.id) > -1) : true );

export const filterByTime = events => orderBy(events, this.state.order.sortBy, this.state.order.orderBy);
