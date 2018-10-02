import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { iota } from 'utils';
import { itemClasses, classIcons, typeToSlot } from 'game';

const highlightBox = box => {
  box.classList.add("raised");
  box.classList.add("highlighted");
  setTimeout(() => {
    box.classList.remove("highlighted");
    setTimeout(() => {
      box.classList.remove("raised");
    }, 1000);
  }, 10);
};

const ItemSetView = ({build, id, set, items, mergeTop, mergeBottom, pathname, className}) => {
  const powers = (set.powers ? [...set.powers] : []);
  const classes = {};
  if (items) Object.keys(items).forEach(id => {
    (items[id].drop_classes || []).forEach(cls => classes[cls] = true);
  });
  return (
    <li id={id} className={classNames("set-box", {mergeTop, mergeBottom}, className)}>
      <div className="set-header">
        <div className="set-name">{set.name}</div>
        <div className="set-id"><Link to={`${pathname}#${id}`} replace>{id}</Link></div>
      </div>
      {!!items && <ul className="set-items">
        {Object.keys(items).map(id => (
          <li key={id}>
            <Link to={`/${build}/items#${id}`}>{items[id].name}</Link>
            {typeToSlot[items[id].type] != null && " (" + typeToSlot[items[id].type] + ")"}
          </li>
        ))}
      </ul>}
      {Object.keys(classes).length > 0 && Object.keys(classes).length < itemClasses.length && (
        <p className="set-classes">Classes:
          {itemClasses.map(cls => <img key={cls} title={cls} src={classIcons[cls]} className={classNames("icon", {disabled: !classes[cls]})}/>)}
        </p>
      )}
      {iota(10).map(count => (set[count] != null && 
        <div className="set-bonus" key={count}><span className="set-bonus-count">({count}) Set:</span>
          <ul>
            {set[count].map((line, index) => {
              if (line.includes("$")) {
                const parts = line.split("$");
                const pidx = powers.indexOf(parts[1]);
                if (pidx >= 0) powers.splice(pidx, 1);
                return <li key={index}><Link to={`/${build}/powers/${parts[1]}`}>{parts[0]}</Link></li>;
              } else {
                return <li key={index}>{line}</li>;
              }
            })}
          </ul>
        </div>
      ))}
      {powers.length > 0 && (
        <div className="set-powers">Powers:
          <ul>
            {powers.map(id => <li key={id}><Link to={`/${build}/powers/${id}`}>{id}</Link></li>)}
          </ul>
        </div>
      )}
    </li>
  );
};

export { highlightBox, ItemSetView };