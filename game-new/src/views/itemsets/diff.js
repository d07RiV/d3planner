import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { ErrorView, withAsync, iota, Cache, scrollView } from 'utils';
import { jsonMerge, lineDiff } from 'utils/diff';
import { ItemSetView, highlightBox } from './common';

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
    if (lhs[i] !== rhs[i]) {
      return false;
    }
  }
  return true;
};
const setsEqual = (lhs, rhs) => {
  if (lhs.name !== rhs.name) return false;
  if (iota(10).some(key => !statsEqual(lhs[key], rhs[key]))) return false;
  return true;
};

const SetStat = ({build, stat, className}) => {
  if (stat.includes("$")) {
    const [text, power] = stat.split("$");
    return <li><Link to={`/${build}/powers/${power}`} className={className}>{text}</Link></li>;
  } else {
    return <li><span className={className}>{stat}</span></li>;
  }
};

const SetStatsDiff = ({lbuild, rbuild, lhs, rhs}) => {
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
        const lnull = (lv == null), rnull =  (rv == null);
        let lstr = lv, lpow = null, rstr = rv, rpow = null;
        if (typeof lstr === "string" && lstr.includes("$")) [lstr, lpow] = lstr.split("$");
        if (typeof rstr === "string" && rstr.includes("$")) [rstr, rpow] = rstr.split("$");
        if (lnull !== rnull || (lpow !== rpow && (lpow || lstr !== rstr))) {
          return [
            lv && <SetStat key={"lhs." + index} build={lbuild} stat={lv} className="bg-red"/>,
            rv && <SetStat key={"rhs." + index} build={rbuild} stat={rv} className="bg-green"/>
          ];
        } else if (rpow) {
          return <li key={index}><Link to={`/${rbuild}/powers/${rpow}`}>{lineDiff(lstr, rstr)}</Link></li>;
        } else {
          return <li key={index}>{lineDiff(lstr, rstr)}</li>;
        }
      })}
    </ul>
  );
};

const ItemSetDiff = ({lbuild, rbuild, id, lhs, rhs, mergeTop, mergeBottom, pathname}) => (
  <li id={id} className={classNames("set-box", {mergeTop, mergeBottom})}>
    <div className="set-header">
      <div className="set-name">{lineDiff(lhs.name, rhs.name)}</div>
      <div className="set-id"><Link to={`${pathname}#${id}`} replace>{id}</Link></div>
    </div>
    {iota(10).map(count => ((lhs[count] != null || rhs[count] != null) && 
      <div className="set-bonus" key={count}><span className="set-bonus-count">({count}) Set:</span>
        <SetStatsDiff lbuild={lbuild} rbuild={rbuild} lhs={lhs[count] || []} rhs={rhs[count] || []}/>
      </div>
    ))}
  </li>
);

const SetsDiffList = ({lbuild, rbuild, lhs, rhs, names, pathname}) => (
  <ul>
    {names.map((id, index) => {
      const _name = iid => (rhs[iid] || lhs[iid] || {}).name;
      const mergeTop = (index > 0 && _name(names[index - 1]) === _name(id));
      const mergeBottom = (index < names.length - 1 && _name(names[index + 1]) === _name(id));
      const props = {key: id, id: id, pathname, mergeTop, mergeBottom};
      if (lhs[id] && rhs[id]) {
        return (
          <ItemSetDiff {...props}
                       lbuild={lbuild}
                       rbuild={rbuild}
                       lhs={lhs[id]}
                       rhs={rhs[id]}/>
        );
      } else if (lhs[id]) {
        return (
          <ItemSetView {...props}
                       build={lbuild}
                       set={lhs[id]}
                       className="set-removed"/>
        );
      } else if (rhs[id]) {
        return (
          <ItemSetView {...props}
                       build={rbuild}
                       set={rhs[id]}
                       className="set-added"/>
        );
      } else {
        return null;
      }
    })}
  </ul>
);

// don't turn into functional or scrollView will break
class ItemSetsDiffComponent extends React.Component {
  render() {
    const { lbuild, rbuild, lhs, rhs, pathname } = this.props;
    let names = Object.keys(lhs);
    Object.keys(rhs).forEach(id => {
      if (!lhs[id]) names.push(id);
    });
    names = names.filter(id => !lhs[id] || !rhs[id] || !setsEqual(lhs[id], rhs[id]));
    names.sort((a, b) => {
      const ia = (rhs[a] || lhs[a]), ib = (rhs[b] || lhs[b]);
      if (ia.name !== ib.name) return ia.name.localeCompare(ib.name);
      return a.localeCompare(b);
    });
    return (
      <div className="ItemSetsView">
        {names.length > 0 ?
          <SetsDiffList lbuild={lbuild}
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

const ItemSetsDiffWithScroll = scrollView(ItemSetsDiffComponent);

const ItemSetsDiff = withAsync({
  rhs: ({match}, {cache}) => cache.fetch(`/api/${match.params.build}/itemsets`, {global: true}),
  lhs: ({match}, {cache}) => cache.fetch(`/api/${match.params.diff}/itemsets`, {global: true}),
}, ({match: {params: {build, diff}}, lhs, rhs, location}) => {
  const lbuild = parseInt(diff, 10), rbuild = parseInt(build, 10);
  return <ItemSetsDiffWithScroll
    rbuild={Math.max(lbuild, rbuild)}
    lbuild={Math.min(lbuild, rbuild)}
    lhs={lbuild < rbuild ? lhs : rhs}
    rhs={lbuild < rbuild ? rhs : lhs}
    pathname={location.pathname}
    onHashLink={highlightBox}
  />;
}, undefined, ErrorView);
ItemSetsDiff.contextTypes = Cache.context;

export { ItemSetsDiff };