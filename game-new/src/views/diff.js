import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { MenuItem, NavItem } from 'react-bootstrap';

import { makeRegex, underlinerFunc, NavSearchDropdown, withAsyncLoading } from 'utils';

const formatVersion = (versions, build) => {
  if (!versions) return build.toString();
  let name = versions.versions[build] || "Unknown build";
  if (versions.live == build) {
    name += " (Live)";
  } else if (versions.ptr == build) {
    name += " (PTR)";
  }
  return name;
};

const NavDivider = () => (
  <li className="nav-separator"/>
);

class DiffMenuDropdown extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {search: ""};
  }
  onSearch = search => this.setState({search});
  onToggle = () => this.setState({search: ""});
  render() {
    const { build: curBuild, diff, type, pathname, hash, versions } = this.props;
    const { search } = this.state;
    const searchRegex = (search.trim() ? makeRegex(search, true) : null);
    const formatVersionItem = build => (
      searchRegex ? underlinerFunc(formatVersion(versions, build), searchRegex) : formatVersion(versions, build)
    );
    const whitelist = type && versions && versions[type];
    const itemProps = build => {
      const props = {};
      if (whitelist && !whitelist.includes(parseInt(build, 10))) {
        props.className = "no-data";
        props.title = "No data";
      }
      return props;
    };

    const keys = versions && Object.keys(versions.versions).map(build => parseInt(build, 10)).sort((a, b) => b - a);
    const results = (keys != null && keys.filter(build =>
      !searchRegex || formatVersion(versions, build).match(searchRegex)
    ).map(build => (build != curBuild ?
      <LinkContainer key={build} to={`${pathname}/diff/${build}${hash}`}>
        <MenuItem eventKey={"diff." + build} {...itemProps(build)}>{formatVersionItem(build)}</MenuItem>
      </LinkContainer> :
      <MenuItem key={build} eventKey={"diff." + build} disabled>{formatVersionItem(build)}</MenuItem>
    )));
    return (
      <NavSearchDropdown eventKey="diff"
                         activeKey={diff ? "diff." + diff : undefined}
                         title={diff ? "Diff against: " +formatVersion(versions, diff) : "Diff"}
                         search={search}
                         onSearch={this.onSearch}
                         onToggle={this.onToggle}
                         id="diff-menu">
        {results && results.length ? results : <MenuItem header className="no-results">No Results</MenuItem>}
      </NavSearchDropdown>
    );
  }
}

const DiffMenuActiveWrapped = withAsyncLoading({
  versions: ({versions}) => versions,
}, ({match: {params: {build, type, path, diff}}, location, versions}) => (
  <React.Fragment>
    <NavDivider/>
    <DiffMenuDropdown build={build}
                      type={type}
                      diff={diff}
                      pathname={`/${build}/${type}${path ? "/" + path : ""}`}
                      hash={location.hash}
                      versions={versions}/>
    <LinkContainer to={`/${build}/${type}${path ? "/" + path : ""}`} exact>
      <NavItem>Normal view</NavItem>
    </LinkContainer>
  </React.Fragment>
));

const DiffMenuInactiveWrapped = withAsyncLoading({
  versions: ({versions}) => versions,
}, ({match: {params: {build, type}}, location, versions}) => (["items", "skills", "itemsets", "powers"].includes(type) &&
  <React.Fragment>
    <NavDivider/>
    <DiffMenuDropdown build={build}
                      type={type}
                      pathname={location.pathname}
                      hash={location.hash}
                      versions={versions}/>
  </React.Fragment>
));

const DiffMenu = ({versions}) => (
  <Switch>
    <Route path="/:build/:type?/:path*/diff/:diff" render={(props) => <DiffMenuActiveWrapped {...props} versions={versions}/>}/>
    <Route path="/:build/:type" render={(props) => <DiffMenuInactiveWrapped {...props} versions={versions}/>}/>
  </Switch>
);

export { DiffMenu };
