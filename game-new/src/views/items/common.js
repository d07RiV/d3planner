import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Popover, OverlayTrigger } from 'react-bootstrap';

import { Icon, iota } from 'utils';
import { itemClasses, allClassIcons, classIcons } from 'game';

const highlightBox = box => {
  box = box.parentElement;
  box.classList.add("raised");
  box.classList.add("highlighted");
  setTimeout(() => {
    box.classList.remove("highlighted");
    setTimeout(() => {
      box.classList.remove("raised");
    }, 1000);
  }, 10);
};

const IconTooltip = ({icons, classes, ...props}) => {
  const micons = [...icons];
  for (let i = itemClasses.length * 2 - 1; i > 0; --i) {
    if (i & 1) micons[i] = micons[i] || micons[i - 1];
    if (i >= 2) micons[i] = micons[i] || micons[i & 1];
  }
  /*if (classes) itemClasses.forEach((cls, index) => {
    if (!classes.includes(cls)) {
      micons[index * 2] = 0;
      micons[index * 2 + 1] = 0;
    }
  });*/
  const getIcons = (list, name) => {
    list = list.filter(idx => micons[idx]);
    if (!list.length) return null;
    const icon = micons[list[0]];
    if (!list.every(idx => micons[idx] === icon)) return null;
    list.forEach(idx => micons[idx] = 0);
    return (
      <span key={list[0]} className="icon-box">
        <span className="icon-title">{name}</span>
        <Icon src={`/webgl/icons/${icon}`} className="item-icon"/>
      </span>
    );
  }
  if (getIcons(iota(14), "All classes")) return null;
  return (
    <Popover id="class-icons" {...props}>
      {getIcons(iota(7).map(i => i * 2), "Male")}
      {getIcons(iota(7).map(i => i * 2 + 1), "Female")}
      {itemClasses.map((cls, index) => getIcons([index * 2, index * 2 + 1], <small>{cls}</small>))}
      {micons.map((icon, index) => getIcons([index], <img title={itemClasses[index / 2]} src={allClassIcons[index]}/>))}
    </Popover>
  );
};

class ItemIcon extends React.Component {
  onMouseOver = (...args) => {
    if (this._trigger) this._trigger.handleMouseOver(...args);
  }
  onMouseOut = (...args) => {
    if (this._icon && ReactDOM.findDOMNode(this._icon) === document.activeElement) return;
    if (this._trigger) this._trigger.handleMouseOut(...args);
  }
  render() {
    const { icon, classes } = this.props;
    const icons = icon.split(",").map(name => parseInt(name, 10));
    let mainCls = (classes ? itemClasses.indexOf(classes[0]) : 0);
    if (mainCls < 0) mainCls = 0;
    const mainIcon = (icons[mainCls * 2] || icons[0]);
    if (!mainIcon) return null;
    return (
      <OverlayTrigger placement="right"
                      shouldUpdatePosition={true}
                      ref={node => this._trigger = node}
                      trigger="focus"
                      overlay={<IconTooltip icons={icons} classes={classes}/>}>
        <Icon src={`/webgl/icons/${mainIcon}`}
              tabIndex={-1}
              className="item-icon"
              ref={node => this._icon = node}
              onMouseOver={this.onMouseOver}
              onMouseOut={this.onMouseOut}
              onClick={(e) => e.target.focus()}/>
      </OverlayTrigger>
    );
  }
}

const canonizeStats = (stats, powers) => {
  if (!powers || !powers.length || stats.some(line => line.includes("$"))) return stats;
  return stats.slice().sort((a, b) => b.length - a.length).map((stat, index) => {
    if (stat.includes("$")) return stat;
    let powerIndex = -1;
    if (powers) {
      if (powers.length === 1 && index === 0) {
        powerIndex = 0;
      } else if (powers.length === 2 && index <= 1) {
        powerIndex = 0;
      } else if (powers.length === 2 && index === 2) {
        powerIndex = 1;
      }
    }
    return (powerIndex >= 0 ? stat + "$" + powers[powerIndex] : stat);
  });
};

const ItemStat = ({build, stat, className}) => {
  if (Array.isArray(stat)) {
    return (
      <li>
        <span className={className}>One of {stat.length} Magic Properties (varies)</span>
        <ul>
          {stat.map((sub, idx) => <ItemStat key={idx} build={build} stat={sub} className={className}/>)}
        </ul>
      </li>
    );
  } else if (stat.includes("$")) {
    const [text, power] = stat.split("$");
    return <li><Link to={`/${build}/powers/${power}`} className={className}>{text}</Link></li>;
  } else {
    return <li><span className={className}>{stat}</span></li>;
  }
};

const ItemStats = ({ build, stats }) => (
  <ul>
    {stats.map((stat, index) => <ItemStat key={index} build={build} stat={stat}/>)}
  </ul>
);

const ItemDrops = ({classes}) => (
  <p className="classes">
    Drops for:
    {itemClasses.map(cls => <img key={cls} title={cls} src={classIcons[cls]} className={classNames("icon", {disabled: !classes.includes(cls)})}/>)}
  </p>
);

const ItemView = ({build, id, item, mergeTop, mergeBottom, pathname, drop, className, ...props}) => (
  <div id={id} className={classNames("item-box", {mergeTop, mergeBottom}, className)} {...props}>
    <div className="item-header">
      {!!item.icon && <ItemIcon icon={item.icon} classes={item.drop_classes}/>}
      <div className="item-info">
        <p className="item-name">{item.name}</p>
        {!!item.type && <p className="item-type">{item.type}</p>}
        {!!item.set && <p className="item-set">Set: <Link to={`/${build}/itemsets#${item.setid}`}>{item.set}</Link></p>}
        {!!item.flavor && <p className="item-flavor">{item.flavor}</p>}
      </div>
      <div className="item-id"><Link to={`${pathname}#${id}`} replace>{id}</Link></div>
    </div>
    {!!item.primary && <div className="item-stats">Primary: <ItemStats stats={item.primary}/></div>}
    {!!item.secondary && <div className="item-stats">Secondary: <ItemStats build={build} stats={canonizeStats(item.secondary, item.powers)}/></div>}
    {(!!item.drop_classes || item.drop_weight != null || item.drop_level != null) &&
      (drop && (!item.drop_classes || !item.drop_classes.length || !item.drop_weight) ?
        <div className="item-drops"><p className="drop-disabled">Drop disabled</p></div> :
        <div className="item-drops">
          {!!item.drop_classes && <ItemDrops classes={item.drop_classes}/>}
          {item.drop_weight != null && <p>Drop weight: {item.drop_weight}</p>}
          {item.drop_level != null && <p>Drop level: {item.drop_level}</p>}
        </div>
      )
    }
  </div>
);

export { canonizeStats, ItemIcon, ItemStat, ItemDrops, ItemStats, ItemView, highlightBox };