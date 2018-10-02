import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ErrorView, withAsync, scrollView, Cache } from 'utils';

import { ItemSetsDiff } from './diff';
import { ItemSetView, highlightBox } from './common';

import './itemsets.css';

const ItemSetsList = ({build, data, items, names, pathname}) => (
  <ul>
    {names.map((id, index) => (
      <ItemSetView key={id}
                   build={build}
                   id={id}
                   set={data[id]}
                   items={items[id] || {}}
                   mergeTop={index > 0 && data[names[index - 1]].name === data[id].name}
                   mergeBottom={index < names.length - 1 && data[names[index + 1]].name === data[id].name}
                   pathname={pathname}/>
    ))}
  </ul>
);

// don't turn into functional or scrollView will break
class ItemSetsViewComponent extends React.Component {
  render() {
    const { build, data, items, pathname } = this.props;
    let names = Object.keys(data);
    names.sort((a, b) => {
      const ia = data[a], ib = data[b];
      if (ia.name !== ib.name) return ia.name.localeCompare(ib.name);
      return a.localeCompare(b);
    });
    const setItems = {};
    Object.keys(items).forEach(id => {
      const item = items[id];
      if (item.setid) {
        setItems[item.setid] = (setItems[item.setid] || {});
        setItems[item.setid][id] = item;
      }
    });
    return (
      <div className="ItemSetsView">
        <ItemSetsList build={build}
                      data={data}
                      items={setItems}
                      names={names}
                      pathname={pathname}/>
      </div>
    );
  }
}

const ItemSetsViewWithScroll = scrollView(ItemSetsViewComponent);

const ItemSetsViewNormal = withAsync({
  data: ({match}, {cache}) => cache.fetch(`/api/${match.params.build}/itemsets`, {global: true}),
  items: ({match}, {cache}) => cache.fetch(`/api/${match.params.build}/items`, {global: true}),
}, ({match, data, items, location}) => (
  <ItemSetsViewWithScroll build={match.params.build} data={data} items={items} pathname={location.pathname} onHashLink={highlightBox}/>
), undefined, ErrorView);
ItemSetsViewNormal.contextTypes = Cache.context;

const ItemSetsView = () => (
  <Switch>
    <Route path={`/:build/itemsets/diff/:diff`} component={ItemSetsDiff}/>
    <Route path={`/:build/itemsets`} component={ItemSetsViewNormal}/>
  </Switch>
);

export { ItemSetsView };