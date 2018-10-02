import React from 'react';
import { Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { MenuItem } from 'react-bootstrap';

import { makeRegex, underlinerFunc, NavSearchDropdown, withAsyncLoading } from 'utils';

const BuildMenuContainerWrapped = withAsyncLoading({
  versions: ({versions}) => versions,
}, class BuildMenuContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {search: ""};
  }
  onSearch = search => this.setState({search});
  onToggle = () => this.setState({search: ""});
  render() {
    const { match: { params }, versions } = this.props;
    const { search } = this.state;
    const formatVersion = build => {
      if (!versions) return build.toString();
      let name = versions.versions[build] || "Unknown build";
      if (versions.live == build) {
        name += " (Live)";
      } else if (versions.ptr == build) {
        name += " (PTR)";
      }
      return name;
    };
    const searchRegex = (search.trim() ? makeRegex(search, true) : null);
    const formatVersionItem = build => (
      searchRegex ? underlinerFunc(formatVersion(build), searchRegex) : formatVersion(build)
    );
    const suffix = (params.type ? `/${params.type}${params.path ? "/" + params.path : ""}` : "");
    const whitelist = params.type && versions && versions[params.type];
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
      !searchRegex || formatVersion(build).match(searchRegex)
    ).map(build => (
      <LinkContainer key={build} to={`/${build}${suffix}`}>
        <MenuItem eventKey={"build." + build} {...itemProps(build)}>{formatVersionItem(build)}</MenuItem>
      </LinkContainer>
    )));
    return (
      <NavSearchDropdown eventKey="build"
                         title={formatVersion(params.build)}
                         disabled={!versions}
                         search={search}
                         onSearch={this.onSearch}
                         onToggle={this.onToggle}
                         id="build-menu">
        {results && results.length ? results : <MenuItem header className="no-results">No Results</MenuItem>}
      </NavSearchDropdown>
    );
  }
});

const BuildMenu = ({versions}) => <Route path="/:build/:type?/:path*" render={(props) => <BuildMenuContainerWrapped {...props} versions={versions}/>}/>;

export { BuildMenu };
