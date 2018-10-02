import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Checkbox } from 'react-bootstrap';

import { ErrorView, scrollView, withAsync, Cache } from 'utils';
import { jsonMerge, lineDiff, valueDiff } from 'utils/diff';
import { canonizeStats, ItemIcon, ItemStat, ItemView, ItemDrops, highlightBox } from './common';
import { itemClasses, classIcons } from 'game';

const trimStat = stat => {
  if (typeof stat !== "string") return stat;
  const pos = stat.indexOf("$");
  if (pos >= 0) return stat.substr(0, pos);
  return stat;
};

const statsEqual = (lhs, rhs) => {
  if (!lhs && !rhs) return true;
  if (!lhs || !rhs) return false;
  if (lhs.length !== rhs.length) return false;
  const sortFunc = (a, b) => b.length - a.length;
  lhs = lhs.map(x => typeof x === "string" ? trimStat(x) : x).sort(sortFunc);
  rhs = rhs.map(x => typeof x === "string" ? trimStat(x) : x).sort(sortFunc);
  for (let i = 0; i < lhs.length; ++i) {
    if (Array.isArray(lhs[i]) && Array.isArray(rhs[i])) {
      if (!statsEqual(lhs[i], rhs[i])) {
        return false;
      }
    } else if (lhs[i] !== rhs[i]) {
      return false;
    }
  }
  return true;
};
const itemsEqual = (lhs, rhs) => {
  if (lhs.name !== rhs.name) return false;
  if (lhs.type !== rhs.type) return false;
  if (lhs.setid !== rhs.setid) return false;
  if (lhs.flavor !== rhs.flavor) return false;
  if (!statsEqual(lhs.primary, rhs.primary)) return false;
  if (!statsEqual(lhs.secondary, rhs.secondary)) return false;
  if (lhs.drop_classes && rhs.drop_classes) {
    if (lhs.drop_classes.some(cls => !rhs.drop_classes.includes(cls))) return false;
    if (rhs.drop_classes.some(cls => cls !== "Necromancer" && !lhs.drop_classes.includes(cls))) return false;
  }
  //if (lhs.drop_level !== rhs.drop_level) return false;
  if (lhs.drop_weight != null && rhs.drop_weight != null) {
    if (lhs.drop_weight !== rhs.drop_weight) return false;
  }
  return true;
};

const StatsDiff = ({lbuild, rbuild, lhs, rhs}) => {
  let lines = jsonMerge(lhs, rhs);
  lines = lines.slice().sort(([al, ar], [bl, br]) => {
    const a = (ar || al), b = (br || bl);
    const ai = (typeof a === "string" && a.includes("$"));
    const bi = (typeof b === "string" && b.includes("$"));
    if (ai !== bi) return bi - ai;
    return lines.indexOf(a) - lines.indexOf(b);
  });
  return (
    <ul>
      {lines.map(([lv, rv], index) => {
        const la = Array.isArray(lv), ra = Array.isArray(rv), lnull = (lv == null), rnull =  (rv == null);
        let lstr = lv, lpow = null, rstr = rv, rpow = null;
        if (typeof lstr === "string" && lstr.includes("$")) [lstr, lpow] = lstr.split("$");
        if (typeof rstr === "string" && rstr.includes("$")) [rstr, rpow] = rstr.split("$");
        if (la !== ra || lnull !== rnull || (lpow !== rpow && (lpow || lstr !== rstr))) {
          return [
            lv && <ItemStat key={"lhs." + index} build={lbuild} stat={lv} className="bg-red"/>,
            rv && <ItemStat key={"rhs." + index} build={rbuild} stat={rv} className="bg-green"/>
          ];
        } else if (ra) {
          return (
            <li key={index}>
              <span>One of {valueDiff(lv.length, rv.length)} Magic Properties (varies)</span>
              <StatsDiff lbuild={lbuild} rbuild={rbuild} lhs={lv} rhs={rv}/>
            </li>
          );
        } else if (rpow) {
          return <li key={index}><Link to={`/${rbuild}/powers/${rpow}`}>{lineDiff(lstr, rstr)}</Link></li>;
        } else {
          return <li key={index}>{lineDiff(lstr, rstr)}</li>;
        }
      })}
    </ul>
  );
};

const NumberDiff = ({lhs, rhs, label}) => {
  if (lhs != null && rhs != null) {
    return <p>{label}{valueDiff(lhs, rhs)}</p>;
  } else if (rhs != null) {
    return <p>{label}{rhs}</p>;
  } else {
    return null;
  }
};

const ItemDropDiff = ({lhs, rhs}) => (
  <div className="item-drops">
    {lhs.drop_classes && rhs.drop_classes && (
      <p className="classes">
        Drops for: {itemClasses.map(cls => {
          const li = lhs.drop_classes.includes(cls), ri = rhs.drop_classes.includes(cls);
          const img = <img key={cls} title={cls} src={classIcons[cls]} className={classNames("icon", {disabled: !li && !ri})}/>
          if (li && !ri) {
            return <span className="bg-red">{img}</span>;
          } else if (!li && ri) {
            return <span className="bg-green">{img}</span>;
          } else {
            return img;
          }
        })}
      </p>
    )}
    {rhs.drop_classes && !lhs.drop_classes && <ItemDrops classes={rhs.drop_classes}/>}
    <NumberDiff lhs={lhs.drop_weight} rhs={rhs.drop_weight} label="Drop weight: "/>
    <NumberDiff lhs={lhs.drop_level} rhs={rhs.drop_level} label="Drop level: "/>
  </div>
);

const ItemDiff = ({lbuild, rbuild, id, lhs, rhs, mergeTop, mergeBottom, pathname}) => (
  <li>
    <div id={id} className={classNames("item-box", {mergeTop, mergeBottom})}>
      <div className="item-header">
        {!!rhs.icon && <ItemIcon icon={rhs.icon} classes={rhs.drop_classes}/>}
        <div className="item-info">
          <p className="item-name">{lineDiff(lhs.name, rhs.name)}</p>
          {!!rhs.type && <p className="item-type">{valueDiff(lhs.type, rhs.type)}</p>}
          {!!rhs.setid && rhs.setid === lhs.setid && <p className="item-set">Set: <Link to={`/${rbuild}/itemsets#${rhs.setid}`}>{rhs.set}</Link></p>}
          {!!rhs.setid && rhs.setid !== lhs.setid && <p className="item-set">{"Set: "}
            {!!lhs.setid && <Link className="bg-red" to={`/${lbuild}/itemsets#${lhs.setid}`}>{lhs.set}</Link>}{" "}
            <Link className="bg-green" to={`/${rbuild}/itemsets#${rhs.setid}`}>{rhs.set}</Link>
          </p>}
          {!!rhs.flavor && <p className="item-flavor">{lineDiff(lhs.flavor || "", rhs.flavor)}</p>}
        </div>
        <div className="item-id"><Link to={`${pathname}#${id}`} replace>{id}</Link></div>
      </div>
      {!!rhs.primary && <div className="item-stats">Primary: <StatsDiff lhs={lhs.primary || []} rhs={rhs.primary}/></div>}
      {!!rhs.secondary && <div className="item-stats">Secondary: <StatsDiff
        lbuild={lbuild} rbuild={rbuild}
        lhs={canonizeStats(lhs.secondary || [], lhs.powers || [])}
        rhs={canonizeStats(rhs.secondary, rhs.powers || [])}/>
      </div>}
      {(!!rhs.drop_classes || rhs.drop_weight != null || rhs.drop_level != null) &&
        <ItemDropDiff lhs={lhs} rhs={rhs}/>
      }
    </div>
  </li>
);

const ItemDiffList = ({lbuild, rbuild, lhs, rhs, names, pathname}) => (
  <ul>
    {names.map((id, index) => {
      const _name = iid => (rhs[iid] || lhs[iid] || {}).name;
      const mergeTop = (index > 0 && _name(names[index - 1]) === _name(id));
      const mergeBottom = (index < names.length - 1 && _name(names[index + 1]) === _name(id));
      const props = {id, mergeTop, mergeBottom, drop: false, pathname};
      if (lhs[id] && rhs[id]) {
        return (
          <ItemDiff {...props}
                    key={id}
                    lbuild={lbuild}
                    rbuild={rbuild}
                    lhs={lhs[id]}
                    rhs={rhs[id]}/>
        );
      } else if (lhs[id]) {
        return (
          <li key={id}>
            <ItemView {...props}
                      build={lbuild}
                      item={lhs[id]}
                      className="item-removed"/>
          </li>
        );
      } else if (rhs[id]) {
        return (
          <li key={id}>
            <ItemView {...props}
                      build={rbuild}
                      item={rhs[id]}
                      className="item-added"/>
          </li>
        );
      } else {
        return null;
      }
    })}
  </ul>
);

class ItemsDiffComponent extends React.Component {
  static state = {equippable: true};
  constructor(props, context) {
    super(props, context);
    this.state = ItemsDiffComponent.state;
  }
  componentDidUpdate() {
    ItemsDiffComponent.state = this.state;
  }
  onEquippable = (e) => {
    this.setState({equippable: e.target.checked});
  }
  render() {
    const { lbuild, rbuild, lhs, rhs, pathname } = this.props;
    const { equippable } = this.state;
    let names = Object.keys(lhs);
    Object.keys(rhs).forEach(id => {
      if (!lhs[id]) names.push(id);
    });
    names = names.filter(id => !lhs[id] || !rhs[id] || !itemsEqual(lhs[id], rhs[id]));
    if (equippable) names = names.filter(id => {
      const item = (rhs[id] || lhs[id]);
      return !item.trivial && !item.name.match(/test ring/i);
    });
    names.sort((a, b) => {
      const ia = (rhs[a] || lhs[a]), ib = (rhs[b] || lhs[b]);
      if (ia.name !== ib.name) return ia.name.localeCompare(ib.name);
      const ad = (!ia.drop_weight || !ia.drop_classes || !ia.drop_classes.length);
      const bd = (!ib.drop_weight || !ib.drop_classes || !ib.drop_classes.length);
      if (ad !== bd) return bd - ad;
      return a.localeCompare(b);
    });
    return (
      <div className="ItemsView">
        <Checkbox checked={equippable} onChange={this.onEquippable}>Only equippable items</Checkbox>
        {names.length > 0 ?
          <ItemDiffList lbuild={lbuild}
                        rbuild={rbuild}
                        lhs={lhs}
                        rhs={rhs}
                        pathname={pathname}
                        names={names}/> :
          <div className="no-results">No differences</div>
        }
      </div>
    );
  }
}
const ItemsDiffWithScroll = scrollView(ItemsDiffComponent);

const ItemsDiff = withAsync({
  rhs: ({match}, {cache}) => cache.fetch(`/api/${match.params.build}/items`, {global: true}),
  lhs: ({match}, {cache}) => cache.fetch(`/api/${match.params.diff}/items`, {global: true}),
}, ({match: {params: {build, diff}}, lhs, rhs, location}) => {
  const lbuild = parseInt(diff, 10), rbuild = parseInt(build, 10);
  return <ItemsDiffWithScroll
    rbuild={Math.max(lbuild, rbuild)}
    lbuild={Math.min(lbuild, rbuild)}
    lhs={lbuild < rbuild ? lhs : rhs}
    rhs={lbuild < rbuild ? rhs : lhs}
    pathname={location.pathname}
    onHashLink={highlightBox}
  />;
}, undefined, ErrorView);
ItemsDiff.contextTypes = Cache.context;

export { ItemsDiff };
