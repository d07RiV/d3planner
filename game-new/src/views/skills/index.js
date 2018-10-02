import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { MenuItem, NavDropdown } from 'react-bootstrap';
import { Route, Redirect, Switch } from 'react-router-dom';

import { ErrorView, withAsync, ActiveContainer, scrollView, Cache } from 'utils';
import { charClasses, classIcons } from 'game';

import { SkillView, PassiveView } from './common';
import { SkillsViewDiff } from './diff';
import './skills.css';

const SkillsMenu = ({build, suffix}) => (
  <ActiveContainer path={`/${build}/skills`}>
    <NavDropdown eventKey="skills"
                 title="Skills"
                 id="skills-menu">
      {Object.keys(charClasses).map(id => (
        <LinkContainer key={id} to={`/${build}/skills/${id}${suffix}`}>
          <MenuItem eventKey={"skills." + id}>
            <img src={classIcons[charClasses[id]]} className="skills-menu-icon"/>
            {charClasses[id]}
          </MenuItem>
        </LinkContainer>
      ))}
    </NavDropdown>
  </ActiveContainer>
);

const SkillsList = ({ build, data, pathname }) => {
  const categories = {};
  Object.keys(data).forEach(id => {
    const skill = data[id];
    categories[skill.category] = (categories[skill.category] || []);
    categories[skill.category].push(id);
  });
  Object.values(categories).forEach(cat => cat.sort((a, b) => data[a].level - data[b].level));
  const catNames = Object.keys(categories).sort((a, b) => data[categories[a][0]].level - data[categories[b][0]].level);
  return (
    <React.Fragment>
      {catNames.map(cat => (
        <div className="skill-category">
          <h3>{cat}</h3>
          <ul>
            {categories[cat].map(id => <SkillView key={id} build={build} id={id} data={data[id]} pathname={pathname}/>)}
          </ul>
        </div>
      ))}
    </React.Fragment>
  );
};

const PassivesList = ({ build, data, pathname }) => (
  <div className="skill-passives">
    <h3>Passives</h3>
    <ul>
      {Object.keys(data).sort((a, b) => data[a].level - data[b].level).map(id => (
        <PassiveView key={id} build={build} id={id} data={data[id]} pathname={pathname}/>
      ))}
    </ul>
  </div>
);

class SkillsViewComponent extends React.Component {
  render() {
    const { data, ...props } = this.props;
    if (!data) {
      return <ErrorView data={{error: "No data for specified version."}}/>;
    }
    return (
      <div className="SkillsView">
        <SkillsList {...props}
                    data={data.skills}/>
        <PassivesList {...props}
                      data={data.passives}/>
      </div>
    );
  }
}

const SkillsViewWithScroll = scrollView(SkillsViewComponent, ["name"]);

const SkillsViewNormal = withAsync({
  data: ({match}, {cache}) => cache.fetch(`/api/${match.params.build}/skills`, {global: true})
}, ({match: {params: {build, name}}, data, location}) => (
  <SkillsViewWithScroll build={build}
                        data={data[name]}
                        pathname={location.pathname}/>
), undefined, ErrorView);
SkillsViewNormal.contextTypes = Cache.context;

const SkillsView = () => (
  <Switch>
    <Route path={`/:build/skills/:name/diff/:diff`} component={SkillsViewDiff}/>
    <Route path={`/:build/skills/diff/:diff`} render={({match: {params: {build, diff}}}) =>
      <Redirect to={`/${build}/skills/demonhunter/diff/${diff}`}/>
    }/>
    <Route path={`/:build/skills/:name`} component={SkillsViewNormal}/>
    <Route path={`/:build/skills`} render={({match}) =>
      <Redirect to={`/${match.params.build}/skills/demonhunter`}/>
    }/>
  </Switch>
);

export { SkillsMenu, SkillsView };