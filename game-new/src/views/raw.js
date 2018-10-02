import React from 'react';
import { Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { MenuItem } from 'react-bootstrap';

import { ErrorView, makeRegex, underlinerFunc, withAsync, withAsyncLoading,
  ActiveContainer, NavSearchDropdown, Cache } from 'utils';
import { JsonViewer } from 'json';

const RawMenu = withAsyncLoading({
  raw: ({build}, {cache}) => cache.fetch(`/api/${build}/raw`)
}, class RawMenuContainer extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {search: ""};
    }
    onSearch = search => this.setState({search});
    onToggle = () => this.setState({search: ""});
    render() {
      const { raw, build } = this.props;
      const { search } = this.state;
      const searchRegex = (search.trim() ? makeRegex(search, true) : null);
      const underliner = name => searchRegex ? underlinerFunc(name, searchRegex) : name;
      const results = (raw != null && raw.files.filter(name =>
        !searchRegex || name.match(searchRegex)
      ).map(name => (
        <LinkContainer key={name} to={`/${build}/raw/${name}`}><MenuItem eventKey={"raw." + name}>{underliner(name)}</MenuItem></LinkContainer>
      )));
      return (
        <ActiveContainer path={`/${build}/raw`}>
          <NavSearchDropdown eventKey="raw"
                             title="Raw"
                             disabled={!raw}
                             search={search}
                             onSearch={this.onSearch}
                             onToggle={this.onToggle}
                             id="raw-menu">
            {results && results.length ? results : <MenuItem header className="no-results">No Results</MenuItem>}
          </NavSearchDropdown>
        </ActiveContainer>
      );
    }
  }
);
RawMenu.contextTypes = Cache.context;

const RawViewInner = withAsync({
  data: ({match: {params: {build, name}}}, {cache}) => cache.fetch(`/api/${build}/raw/${name}`, {global: true, info: true})
}, ({data: {compressed, uncompressed, json}, match: {params: {build, name}}}) => (
  <JsonViewer key={name}
              name={name}
              size={{compressed, uncompressed}}
              url={`/api/${build}/raw/${name}`}
              value={json}
              className="app-body"/>
), undefined, ErrorView);
RawViewInner.contextTypes = Cache.context;

const RawView = () => <Route path={`/:build/raw/:name`} component={RawViewInner}/>;

export { RawMenu, RawView };