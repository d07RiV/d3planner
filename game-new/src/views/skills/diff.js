import React from 'react';
import { Link } from 'react-router-dom';

import { ErrorView, withAsync, Icon, Cache, scrollView } from 'utils';
import { lineDiff, multilineDiff, valueDiff } from 'utils/diff';
import { elements, SkillView, PassiveView } from './common';

const runesEqual = (lhs, rhs) => lhs.name === rhs.name && lhs.element === rhs.element && lhs.desc === rhs.desc && lhs.level === rhs.level;
const skillsEqual = (lhs, rhs) => {
  if (lhs.name !== rhs.name) return false;
  if (lhs.element !== rhs.element) return false;
  if (lhs.desc !== rhs.desc) return false;
  if (lhs.level !== rhs.level) return false;
  if (Object.keys(rhs.runes).some(rune => !runesEqual(lhs.runes[rune], rhs.runes[rune]))) return false;
  return true;
};
const passivesEqual = (lhs, rhs) => lhs.name === rhs.name && lhs.desc === rhs.desc && lhs.level === rhs.level && lhs.flavor === rhs.flavor;

const SkillDiff = ({lbuild, rbuild, id, lhs, rhs, pathname}) => (
  <li id={id} className="skill-view">
    <div className="skill-header">
      <Icon className="skill-icon" src={`/webgl/icons/${rhs.icon}`}/>
      <div className="skill-info">
        <p className="skill-name"><Link to={`/${rbuild}/powers/${rhs.power}/diff/${lbuild}`}>{lineDiff(lhs.name, rhs.name)}</Link></p>
        <p className="skill-element">{valueDiff(elements[lhs.element], elements[rhs.element])}</p>
        {multilineDiff(lhs.desc, rhs.desc).map((text, index) => <p key={index} className="skill-desc">{text}</p>)}
        <p className="skill-level">Unlocked at level {valueDiff(lhs.level, rhs.level)}.</p>
      </div>
      <div className="skill-id"><Link to={`${pathname}#${id}`} replace>{id}</Link></div>
    </div>
    {Object.keys(rhs.runes).sort((a, b) => rhs.runes[a].level - rhs.runes[b].level).map(letter => {
      const lr = lhs.runes[letter] || {}, rr = rhs.runes[letter];
      return (
        <div className="skill-rune">
          <div className={"rune-icon rune-" + letter}>({letter})</div>
          <div className="skill-info">
            <p className="skill-name">{lineDiff(lr.name || "", rr.name)}</p>
            <p className="skill-element">{valueDiff(elements[lr.element], elements[rr.element])}</p>
            {multilineDiff(lr.desc || "", rr.desc).map((text, index) => <p key={index} className="skill-desc">{text}</p>)}
            <p className="skill-level">Unlocked at level {valueDiff(lr.level, rr.level)}.</p>
          </div>
        </div>
      );
    })}
  </li>
);

const PassiveDiff = ({ lbuild, rbuild, id, lhs, rhs, pathname }) => (
  <li id={id} className="skill-view">
    <div className="skill-header">
      <Icon className="skill-icon" src={`/webgl/icons/${rhs.icon}`}/>
      <div className="skill-info">
        <p className="skill-name"><Link to={`/${rbuild}/powers/${rhs.power}/diff/${lbuild}`}>{lineDiff(lhs.name, rhs.name)}</Link></p>
        {multilineDiff(lhs.desc, rhs.desc).map((text, index) => <p key={index} className="skill-desc">{text}</p>)}
        <p className="skill-level">Unlocked at level {valueDiff(lhs.level, rhs.level)}.</p>
        <p className="skill-flavor">{lineDiff(lhs.flavor, rhs.flavor)}</p>
      </div>
      <div className="skill-id"><Link to={`${pathname}#${id}`} replace>{id}</Link></div>
    </div>
  </li>
);

const SkillsDiff = ({ lbuild, rbuild, lhs, rhs, pathname }) => {
  let names = Object.keys(lhs);
  Object.keys(rhs).forEach(id => {
    if (!lhs[id]) names.push(id);
  });

  const categories = {}, catLevel = {};
  names.forEach(id => {
    const { category, level } = (rhs[id] || lhs[id]);
    if (catLevel[category] == null) {
      catLevel[category] = level;
    } else {
      catLevel[category] = Math.min(catLevel[category], level);
    }
    if (!lhs[id] || !rhs[id] || !skillsEqual(lhs[id], rhs[id])) {
      categories[category] = (categories[category] || []);
      categories[category].push(id);
    }
  });
  Object.values(categories).forEach(cat => cat.sort((a, b) => (rhs[a] || lhs[a]).level - (rhs[b] || lhs[b]).level));
  const catNames = Object.keys(categories).sort((a, b) => catLevel[a] - catLevel[b]);
  return (
    <React.Fragment>
      {catNames.map(cat => (
        <div className="skill-category">
          <h3>{cat}</h3>
          <ul>
            {categories[cat].map(id => {
              const props = {key: id, id: id, pathname};
              if (lhs[id] && rhs[id]) {
                return <SkillDiff {...props}
                  lbuild={lbuild}
                  rbuild={rbuild}
                  lhs={lhs[id]}
                  rhs={rhs[id]}
                />;
              } else if (lhs[id]) {
                return <SkillView {...props}
                  build={lbuild}
                  data={lhs[id]}
                  className="skill-removed"
                />;
              } else if (rhs[id]) {
                return <SkillView {...props}
                  build={rbuild}
                  data={rhs[id]}
                  className="skill-added"
                />;
              } else {
                return null;
              }
            })}
          </ul>
        </div>
      ))}
    </React.Fragment>
  );
};

const PassivesDiff = ({ lbuild, rbuild, lhs, rhs, pathname }) => {
  let names = Object.keys(lhs);
  Object.keys(rhs).forEach(id => {
    if (!lhs[id]) names.push(id);
  });
  names = names.filter(id => !lhs[id] || !rhs[id] || !passivesEqual(lhs[id], rhs[id]));
  names.sort((a, b) => (rhs[a] || lhs[a]).level - (rhs[b] || lhs[b]).level);
  if (!names.length) return null;

  return (
    <div className="skill-passives">
      <h3>Passives</h3>
      <ul>
        {names.map(id => {
          const props = {key: id, id: id, pathname};
          if (lhs[id] && rhs[id]) {
            return <PassiveDiff {...props}
              lbuild={lbuild}
              rbuild={rbuild}
              lhs={lhs[id]}
              rhs={rhs[id]}
            />;
          } else if (lhs[id]) {
            return <PassiveView {...props}
              build={lbuild}
              data={lhs[id]}
              className="skill-removed"
            />;
          } else if (rhs[id]) {
            return <PassiveView {...props}
              build={rbuild}
              data={rhs[id]}
              className="skill-added"
            />;
          } else {
            return null;
          }
        })}
      </ul>
    </div>
  );
};

// don't turn into functional or scrollView will break
class SkillsDiffComponent extends React.Component {
  render() {
    const { lhs, rhs, ...props } = this.props;
    return (
      <div className="SkillsView">
        <SkillsDiff {...props}
                    lhs={lhs.skills || {}}
                    rhs={rhs.skills || {}}/>
        <PassivesDiff {...props}
                      lhs={lhs.passives || {}}
                      rhs={rhs.passives || {}}/>
        <div className="no-results">No differences</div>
      </div>
    );
  }
}

const SkillsDiffWithScroll = scrollView(SkillsDiffComponent, ["name"]);

const SkillsViewDiff = withAsync({
  rhs: ({match}, {cache}) => cache.fetch(`/api/${match.params.build}/skills`, {global: true}),
  lhs: ({match}, {cache}) => cache.fetch(`/api/${match.params.diff}/skills`, {global: true}),
}, ({match: {params: {build, name, diff}}, lhs, rhs, location}) => {
  const lbuild = parseInt(diff, 10), rbuild = parseInt(build, 10);
  return <SkillsDiffWithScroll
    lbuild={Math.min(lbuild, rbuild)}
    rbuild={Math.max(lbuild, rbuild)}
    lhs={(lbuild < rbuild ? lhs : rhs)[name] || {}}
    rhs={(lbuild < rbuild ? rhs : lhs)[name] || {}}
    pathname={location.pathname}
  />;
}, undefined, ErrorView);
SkillsViewDiff.contextTypes = Cache.context;

export { SkillsViewDiff };