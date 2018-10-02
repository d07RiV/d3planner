import React from 'react';
import classNames from 'classnames';
import { Route, Switch } from 'react-router-dom';
import { WindowScroller, List, AutoSizer } from 'react-virtualized';

import { ErrorView, createChainedFunction, makeRegex, SearchBox, withAsync, Cache } from 'utils';

import { ItemsDiff } from './diff';
import { ItemView, highlightBox } from './common';

import './items.css';

const matchItem = (item, regex) => {
  if (item.name.match(regex)) return true;
  if (item.type && item.type.match(regex)) return true;
  if (item.set && item.set.match(regex)) return true;
  if (item.flavor && item.flavor.match(regex)) return true;
  if (item.primary && item.primary.some(stat => {
    if (Array.isArray(stat)) {
      return stat.some(sub => sub.match(regex));
    } else {
      return stat.match(regex);
    }
  })) return true;
  if (item.secondary && item.secondary.some(stat => {
    if (Array.isArray(stat)) {
      return stat.some(sub => sub.match(regex));
    } else {
      return stat.match(regex);
    }
  })) return true;
  return false;
};

class ItemsList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {selected: 0, searchResult: null};
  }

  onScroll = ({scrollTop}) => {
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const { history } = this.props;
      history.replace(history.location.pathname + history.location.hash, {scrollTop});
    }, 500);
  }
  onHashChanged(highlight) {
    const { hash, names } = this.props;
    if (!hash || !this._list) return;
    const index = names.indexOf(hash.substr(1));
    if (index < 0) return false;
    this._list.scrollToRow(index);
    if (highlight) {
      setTimeout(() => {
        const element = document.getElementById(hash.substr(1));
        if (element) highlightBox(element);
      }, 100);
    }
    return true;
  }

  componentDidMount() {
    const state = this.props.history.location.state;
    if (state && state.scrollTop != null && this._list) {
      this._list.scrollToPosition(state.scrollTop);
    } else {
      this.onHashChanged(true);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (["view", "build", "data", "names", "drops", "pathname"].some(key => nextProps[key] !== this.props[key])) {
      return true;
    }
    if (nextProps.hash !== this.props.hash) {
      this.onHashChanged(false);
    }
    return false;
  }
  componentDidUpdate(prevProps) {
    if (this.props.hash !== prevProps.hash) {
      this.onHashChanged(false);
    }
  }

  onSearch(text, dir) {
    const { data, names } = this.props;
    const { selected, searchResult } = this.state;
    const list = [];
    if (!text.trim()) {
      this.setState({searchResult: null});
      this._list.forceUpdateGrid();
      return;
    }
    const regex = makeRegex(text);
    names.forEach((id, index) => {
      if (matchItem(data[id], regex)) {
        list.push(index);
      }
    });
    if (!list.length) {
      this.setState({searchResult: null});
      this._list.forceUpdateGrid();
      return {pos: 0, count: 0};
    }
    let next = null;
    if (dir >= 0) {
      const origin = (dir > 0 && searchResult != null ? searchResult + 1 : selected);
      next = list.find(index => index >= origin);
      if (next == null) next = list[0];
    } else {
      const origin = (searchResult != null ? searchResult - 1 : selected);
      list.forEach(index => {
        if (index <= origin) next = index;
      });
      if (next == null) next = list[list.length - 1];
    }
    this.setState({searchResult: next});
    if (this._list) {
      this._list.scrollToRow(next);
      this._list.forceUpdateGrid();
    }
    return {pos: list.indexOf(next), count: list.length};
  }

  rowRenderer = ({ index, key, style}) => {
    const { build, data, names, drops, pathname } = this.props;
    const { searchResult } = this.state;
    const item = data[names[index]];
    return (
      <div key={key}
           style={style}
           onClick={() => this.setState({selected: index})}
           className={classNames({"search-result": searchResult === index})}>
        <ItemView build={build}
                  id={names[index]}
                  item={item}
                  mergeTop={index > 0 && data[names[index - 1]].name === item.name}
                  mergeBottom={index < names.length - 1 && data[names[index + 1]].name === item.name}
                  pathname={pathname}
                  drop={drops[item.name]}/>
      </div>
    );
  }
  rowMeasure = ({ index }) => {
    const { data, names, drops } = this.props;
    const item = data[names[index]];
    const statsHeight = stats => stats.reduce((prev, stat) => {
      return prev + (Array.isArray(stat) ? statsHeight(stat) : 16);
    }, 16);

    let height = 1 + 7 + 85 + 7 + 1 + 8;
    if (index > 0 && data[names[index - 1]].name === item.name) {
      height -= 5;
    }
    if (index < names.length - 1 && data[names[index + 1]].name === item.name) {
      height -= 4;
    }
    if (item.primary) height += 10 + statsHeight(item.primary);
    if (item.secondary) height += 10 + statsHeight(item.secondary);
    if (item.drop_classes || item.drop_weight != null || item.drop_level != null) {
      height += 8;
      if (drops[item.name] && (!item.drop_weight || !item.drop_classes || !item.drop_classes.length)) {
        height += 16;
      } else {
        if (item.drop_classes) height += 24;
        if (item.drop_weight != null) height += 16;
        if (item.drop_level != null) height += 16;
      }
    }
    return height;
  }
  render() {
    const { names, view } = this.props;
    let rowHeight = 30;
    if (names.length) rowHeight = names.reduce((prev, name, index) => prev + this.rowMeasure({index}), 0) / names.length;
    return (
      <AutoSizer disableHeight>
        {({ width}) => (
          <WindowScroller scrollElement={view}>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <List autoHeight
                    ref={node => this._list = node}
                    className="item-list"
                    width={width}
                    height={height}
                    isScrolling={isScrolling}
                    onScroll={createChainedFunction(this.onScroll, onChildScroll)}
                    estimatedRowSize={rowHeight}
                    rowCount={names.length}
                    rowHeight={this.rowMeasure}
                    rowRenderer={this.rowRenderer}
                    scrollTop={scrollTop}/>
            )}
          </WindowScroller>
        )}
      </AutoSizer>
    )
  }
}

class ItemsViewComponent extends React.Component {
  state = {}
  
  onSearch = (text, dir) => {
    if (this._list) return this._list.onSearch(text, dir);
  }
  onRef = node => this.setState({view: node});
  render() {
    const { build, data, pathname, history, hash } = this.props;
    const { view } = this.state;
    let names = Object.keys(data);
    names.sort((a, b) => {
      const ia = data[a], ib = data[b];
      if (ia.name !== ib.name) return ia.name.localeCompare(ib.name);
      const ad = (!ia.drop_weight || !ia.drop_classes || !ia.drop_classes.length);
      const bd = (!ib.drop_weight || !ib.drop_classes || !ib.drop_classes.length);
      if (ad !== bd) return bd - ad;
      return a.localeCompare(b);
    });
    const dropEnabled = {};
    names.forEach(id => {
      const item = data[id];
      if (item.drop_weight && item.drop_classes && item.drop_classes.length) {
        dropEnabled[item.name] = true;
      }
    });
    return (
      <div className="ItemsView" ref={this.onRef}>
        <SearchBox ref={node => this._search = node} onSearch={this.onSearch}/>
        {!!view &&
          <ItemsList ref={node => this._list = node}
                     view={view}
                     build={build}
                     data={data}
                     names={names}
                     drops={dropEnabled}
                     history={history}
                     pathname={pathname}
                     hash={hash}/>
        }
      </div>
    );
  }
}

const ItemsViewNormal = withAsync({
  data: ({match}, {cache}) => cache.fetch(`/api/${match.params.build}/items`, {global: true})
}, ({match, data, history, location: {pathname, hash}}) => (
  <ItemsViewComponent build={match.params.build} data={data} history={history} pathname={pathname} hash={hash}/>
), undefined, ErrorView);
ItemsViewNormal.contextTypes = Cache.context;

const ItemsView = () => (
  <Switch>
    <Route path={`/:build/items/diff/:diff`} component={ItemsDiff}/>
    <Route path={`/:build/items`} component={ItemsViewNormal}/>
  </Switch>
);

export { ItemsView };
