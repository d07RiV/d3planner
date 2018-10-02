import React from 'react';

const makeRegex = (str, middle) => {
  const prefix = (middle && !str.match(/^\s/) ? "" : "\\b") + "(";
  const suffix = ")" + (str.match(/\s$/) ? "\\b" : "");
  str = str.trim().replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  if (!str) return;
  return new RegExp(prefix + str + suffix, "i");
};
const underlinerFunc = (value, regex) => {
  let found = false;
  return value.split(regex).map((str, index) => {
    if (!found && str.match(regex)) {
      found = true;
      return <u key={index}>{str}</u>;
    } else {
      return str;
    }
  });
};

function replaceReact(text, regex, func) {
  const result = [];
  let prev = 0, match;
  while (match = regex.exec(text)) {
    if (match.index > prev) {
      result.push(text.substring(prev, match.index));
    }
    const element = func(...match, match.index, match.string);
    if (React.isValidElement(element)) {
      result.push(React.cloneElement(element, {key: match.index}));
    } else {
      result.push(element);
    }
    prev = match.index + match[0].length;
  }
  if (prev < text.length) {
    result.push(text.substring(prev));
  }
  return result;
}

export { makeRegex, underlinerFunc, replaceReact };
