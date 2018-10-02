import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { Icon } from 'utils';

import './skills.css';

const elements = {
  phy: "Physical",
  col: "Cold",
  fir: "Fire",
  psn: "Poison",
  lit: "Lightning",
  hol: "Holy",
  arc: "Arcane",
};

const SkillView = ({ build, id, data, pathname, className }) => (
  <li id={id} className={classNames("skill-view", className)}>
    <div className="skill-header">
      <Icon className="skill-icon" src={`/webgl/icons/${data.icon}`}/>
      <div className="skill-info">
        <p className="skill-name"><Link to={`/${build}/powers/${data.power}`}>{data.name}</Link></p>
        <p className="skill-element">{elements[data.element]}</p>
        {data.desc.split(/\n+/).map((text, index) => <p key={index} className="skill-desc">{text}</p>)}
        <p className="skill-level">Unlocked at level {data.level}.</p>
      </div>
      <div className="skill-id"><Link to={`${pathname}#${id}`} replace>{id}</Link></div>
    </div>
    {Object.keys(data.runes).sort((a, b) => data.runes[a].level - data.runes[b].level).map(letter => {
      const rune = data.runes[letter];
      return (
        <div className="skill-rune">
          <div className={"rune-icon rune-" + letter}>({letter})</div>
          <div className="skill-info">
            <p className="skill-name">{rune.name}</p>
            <p className="skill-element">{elements[rune.element]}</p>
            {rune.desc.split(/\n+/).map((text, index) => <p key={index} className="skill-desc">{text}</p>)}
            <p className="skill-level">Unlocked at level {rune.level}.</p>
          </div>
        </div>
      );
    })}
  </li>
);

const PassiveView = ({ build, id, data, pathname }) => (
  <li id={id} className="skill-view">
    <div className="skill-header">
      <Icon className="skill-icon" src={`/webgl/icons/${data.icon}`}/>
      <div className="skill-info">
        <p className="skill-name"><Link to={`/${build}/powers/${data.power}`}>{data.name}</Link></p>
        {data.desc.split(/\n+/).map((text, index) => <p key={index} className="skill-desc">{text}</p>)}
        <p className="skill-level">Unlocked at level {data.level}.</p>
        <p className="skill-flavor">{data.flavor}</p>
      </div>
      <div className="skill-id"><Link to={`${pathname}#${id}`} replace>{id}</Link></div>
    </div>
  </li>
);

export { elements, SkillView, PassiveView };
