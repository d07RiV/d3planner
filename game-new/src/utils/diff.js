import React from 'react';
import { isPlainObject } from './common';

function firstKey(value) {
  const isArray = Array.isArray(value);
  if (isArray || isPlainObject(value)) {
    const items = (isArray ? value : Object.values(value));
    for (let item in items) {
      const key = firstKey(item);
      if (key) return key;
    }
    return "";
  } else {
    return value.toString();
  }
}

const split = str => str.trim().split(/\s+/);
const total = parts => parts.reduce((sum, cur) => sum + cur.length, 0);
const jsonLength = value => Array.isArray(value) ? value.reduce((sum, cur) => sum + jsonLength(cur), 0) : firstKey(value).length;

const trimPower = str => {
  const index = str.indexOf("$");
  return (index >= 0 ? str.substr(0, index) : str);
};

function strDist(slhs, srhs) {
  const lhs = split(trimPower(slhs));
  const rhs = split(trimPower(srhs));
  let dp = Array(rhs.length + 1).fill(0);
  lhs.forEach(lv => {
    let prev = 0;
    dp = [0, ...rhs.map((rv, i) => prev = (lv === rv ? dp[i] + lv.length : Math.max(prev, dp[i + 1])))];
  });
  return dp[rhs.length] / Math.max(total(lhs), total(rhs));
}

function jsonDist(lhs, rhs) {
  if (!Array.isArray(lhs) || !Array.isArray(rhs)) {
    return strDist(firstKey(lhs), firstKey(rhs));
  }
  const sum = jsonMerge(lhs, rhs).reduce((sum, [lv, rv]) => (
    sum + (lv != null && rv != null ? jsonDist(lv, rv) * Math.max(jsonLength(lv), jsonLength(rv)) : 0)
  ), 0);
  return sum / Math.max(1, jsonLength(lhs), jsonLength(rhs));
}

function jsonMerge(lhs, rhs) {
  const list = lhs.map(val => [val,,]);
  rhs.forEach(val => {
    const pos = list.find(pair => pair[1] == null && jsonDist(val, pair[0]) > 0.5);
    if (pos) {
      pos[1] = val;
    } else {
      list.push([,val]);
    }
  });
  return list;
}

function lineDiff(slhs, srhs) {
  const lhs = split(slhs);
  const rhs = split(srhs);
  const dp = [...Array(lhs.length + 1)].map(x => new Uint32Array(rhs.length + 1));
  for (let i = lhs.length - 1; i >= 0; --i) {
    for (let j = rhs.length - 1; j >= 0; --j) {
      if (lhs[i] === rhs[j]) {
        dp[i][j] = dp[i + 1][j + 1] + lhs[i].length;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }
  let ci = 0, cj = 0, pi = 0, pj = 0;
  const result = [];
  const add = val => {
    const p = result.length - 1;
    if (p >= 0) {
      if (typeof result[p] === "string") {
        result[p] += " ";
        if (typeof val === "string") {
          result[p] += val;
        } else {
          result.push(val);
        }
      } else {
        if (typeof val === "string") {
          result.push(" " + val);
        } else {
          result.push(" ", val);
        }
      }
    } else {
      result.push(val);
    }
  }
  while (ci < lhs.length && cj < rhs.length) {
    if (lhs[ci] === rhs[cj]) {
      if (pi < ci) add(<span key={"lhs." + pi} className="bg-red">{lhs.slice(pi, ci).join(" ")}</span>);
      if (pj < cj) add(<span key={"rhs." + pj} className="bg-green">{rhs.slice(pj, cj).join(" ")}</span>);
      add(lhs[ci]);
      pi = ++ci;
      pj = ++cj;
    } else if (dp[ci][cj] === dp[ci + 1][cj]) {
      ++ci;
    } else {
      ++cj;
    }
  }
  if (pi < lhs.length) add(<span key={"lhs." + pi} className="bg-red">{lhs.slice(pi).join(" ")}</span>);
  if (pj < rhs.length) add(<span key={"rhs." + pj} className="bg-green">{rhs.slice(pj).join(" ")}</span>);
  return result.length > 1 ? result : (result[0] || "");
}

function multilineDiff(slhs, srhs) {
  const lhs = slhs.split(/\n+/), rhs = srhs.split(/\n+/);
  let pos = 0;
  const result = [];
  rhs.forEach(cur => {
    while (pos < lhs.length && strDist(cur, lhs[pos]) < 0.5) {
      result.push(<span className="bg-red">{lhs[pos++]}</span>);
    }
    if (pos < lhs.length) {
      result.push(lineDiff(lhs[pos++], cur));
    } else {
      result.push(<span className="bg-green">{cur}</span>);
    }
  });
  while (pos < lhs.length) {
    result.push(<span className="bg-red">{lhs[pos++]}</span>);
  }
  return result;
}

const valueDiff = (lhs, rhs) => {
  if (lhs == null && rhs == null) {
    return "";
  } else if (lhs === rhs) {
    return rhs.toString();
  } else if (lhs == null) {
    return <span className="bg-green">{rhs.toString()}</span>;
  } else if (rhs == null) {
    return <span className="bg-red">{rhs.toString()}</span>;
  } else {
    return (
      <React.Fragment>
        <span className="bg-red">{lhs.toString()}</span>{" "}<span className="bg-green">{rhs.toString()}</span>
      </React.Fragment>
    );
  }
};

export {
  strDist,
  jsonDist,
  jsonMerge,
  lineDiff,
  multilineDiff,
  valueDiff,
};
export default {
  strDist,
  jsonDist,
  jsonMerge,
  lineDiff,
  multilineDiff,
  valueDiff,
};
