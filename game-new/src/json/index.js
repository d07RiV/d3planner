import React from 'react';
import keycode from 'keycode';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { AutoSizer, List, defaultCellRangeRenderer } from 'react-virtualized';
import { Nav, NavItem, Navbar, Glyphicon, FormGroup, OverlayTrigger, Tooltip, Popover } from 'react-bootstrap';

import { isPlainObject, iota } from 'utils';

import './json.css';

function formatSize(bytes) {
  let unitType = 0;
  const units = ['', ' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  while (bytes >= 1024) {
    bytes /= 1024;
    unitType++;
  }
  return bytes.toFixed(1) + units[unitType];
}

function getChildIndex(node, child) {
  for (let i = 0; i < node.childNodes.length; ++i) {
    if (node.childNodes[i] === child) {
      return i;
    }
  }
  return -1;
}
function getChildrenLength(node, count) {
  if (count >= node.childNodes.length) return node.textContent.length;
  let length = 0;
  for (let i = 0; i < count; ++i) {
    length += node.childNodes[i].textContent.length;
  }
  return length;
}
function getNodeOffset(node, anchor, anchorOffset) {
  let offset = 0;
  if (anchor.childNodes.length) {
    offset = getChildrenLength(anchor, anchorOffset);
  } else {
    offset = anchorOffset;
  }
  while (anchor && anchor !== node) {
    const parent = anchor.parentElement || anchor.parentNode;
    offset += getChildrenLength(parent, getChildIndex(parent, anchor));
    anchor = parent;
  }
  if (anchor !== node) return 0;
  return offset;
}
function findNodeOffset(node, offset) {
  if (!node.childNodes.length) return {node, offset: Math.min(node.textContent.length, offset)};
  for (let i = 0; i < node.childNodes.length; ++i) {
    const length = node.childNodes[i].textContent.length;
    if (offset < length || i === node.childNodes.length - 1) {
      return findNodeOffset(node.childNodes[i], offset);
    }
    offset -= length;
  }
  return {node, offset: 0};
}

function makeRegex(str) {
  str = str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  return new RegExp("(" + str + ")", "ig");
}
function findMatches(text, regex, current, lineIndex) {
  let match;
  const matches = [];
  while (match = regex.exec(text)) {
    matches.push({
      index: match.index,
      length: match[0].length,
      className: (current && current.line === lineIndex && current.offset === match.index ? "match-current" : "match")
    });
  }
  return matches;
}
function highlightMatches(text, matches, offset) {
  const result = [];
  let prev = 0;
  matches.forEach(m => {
    const start = Math.max(m.index - offset, 0), end = Math.min(m.index + m.length - offset, text.length);
    if (end <= start) return;
    if (start > prev) result.push(text.substring(prev, start));
    result.push(<span className={m.className} key={m.index}>{text.substring(start, end)}</span>);
    prev = end;
  });
  if (prev < text.length) {
    result.push(text.substring(prev));
  }
  return result;
}

class TextRow {
  constructor(params) {
    Object.assign(this, params);
  }
  render(options) {
    let {lineIndex, text} = this;
    const {key, style} = options;
    const search = this.owner.search;
    if (search) {
      const matches = findMatches(text, search, this.owner.match, lineIndex);
      text = highlightMatches(text, matches, 0);
    }
    return (
      <div className="JsonRow" key={key} style={style}>
        <span className="line" data-line-number={lineIndex + 1}/>
        {text}{"\n"}
        <span className="eol"/>
      </div>
    );
  }
}
const JsonPreview = ({value, ...props}) => {
  const renderer = new JsonRenderer(value, () => true, null, 10);
  return (
    <Popover id="json-preview" {...props}>
      {renderer.lines.map((line, index) => line.render({key: index}))}
    </Popover>
  );
};
const Collapsed = ({value, onClick}) => (
  <OverlayTrigger placement="right" overlay={<JsonPreview value={value}/>}>
    <span className="collapsed" onClick={onClick}/>
  </OverlayTrigger>
);

class ValueRow {
  static typeClasses = {
    "number": "JsonNumber",
    "string": "JsonString",
    "boolean": "JsonBoolean",
    "null": "JsonNull"
  }
  constructor(params) {
    Object.assign(this, params);
    if (isPlainObject(this.value) || Array.isArray(this.value)) {
      this.expand = this.expand.bind(this);
      this.collapse = this.collapse.bind(this);
    }
  }
  expand() {
    this.owner.expand(this);
  }
  collapse() {
    this.owner.collapse(this);
  }
  render(options) {
    const {lineIndex, indent, parentKey, lastChild, value, collapsed} = this;
    const {key, style} = options;
    let prefix = Array(indent + 1).join(" ") +
      (parentKey != null ? JSON.stringify(parentKey) + ": " : "");
    let suffix = (lastChild ? "" : ",");
    let inner = null;
    const search = this.owner.search;
    const isArray = Array.isArray(value);
    if (isPlainObject(value) || isArray) {
      prefix += (isArray ? "[" : "{");
      const length = (isArray ? value.length : Object.getOwnPropertyNames(value).length);
      if (!length) {
        prefix += (isArray ? "]" : "}");
      } else if (collapsed) {
        inner = <Collapsed value={value} onClick={this.expand}/>;
        suffix = (isArray ? "]" : "}") + suffix;
      } else {
        inner = <span className="expanded" onClick={this.collapse}/>;
        suffix = "";
      }
      if (search) {
        prefix = highlightMatches(prefix, findMatches(prefix, search, this.owner.match, lineIndex), 0);
        suffix = highlightMatches(suffix, findMatches(suffix, search), 0);
      }
    } else {
      const valueFix = (value == null ? null : value);
      const type = ValueRow.typeClasses[value == null ? "null" : typeof value] || "JsonValue";
      let valueStr = JSON.stringify(valueFix);
      if (search) {
        const matches = findMatches(prefix + valueStr + suffix, search, this.owner.match, lineIndex);
        suffix = highlightMatches(suffix, matches, prefix.length + valueStr.length);
        valueStr = highlightMatches(valueStr, matches, prefix.length);
        prefix = highlightMatches(prefix, matches, 0);
      }
      inner = <span className={type}>{valueStr}</span>;
    }
    return (
      <div className="JsonRow" key={key} style={style}>
        <span className="line" data-line-number={lineIndex + 1}/>
        {prefix}{inner}{suffix}{"\n"}
        <span className="eol"/>
      </div>
    );
  }
}

class JsonRenderer {
  constructor(value, expand, owner, limit) {
    this.value = value;
    this.expandFunc = expand;
    this.lines = [];
    this.indent = 2;
    this.owner = owner;

    this.build(this.lines, 0, value, 0, null, true, true, limit);
  }
  get raw() {
    if (!this.raw_) {
      this.raw_ = JSON.stringify(this.value, undefined, this.indent).split("\n");
    }
    return this.raw_;
  }
  get search() {
    const text = (this.owner && this.owner.state.search);
    return (text && text.trim() ? makeRegex(text) : null);
  }
  get match() {
    return this.owner && this.owner.state.match;
  }
  countLines(value) {
    let count = 1;
    if (isPlainObject(value)) {
      const names = Object.getOwnPropertyNames(value)
      count = names.reduce((prev, name) => prev + this.countLines(value[name]), count);
      if (names.length > 0) count += 1;
    } else if (Array.isArray(value)) {
      count = value.reduce((prev, val) => prev + this.countLines(val), count);
      if (value.length > 0) count += 1;
    }
    return count;
  }
  build(to, lineIndex, value, indent, parentKey, lastChild, expanded, limit) {
    if (limit != null && to.length >= limit) return lineIndex;
    const line = new ValueRow({owner: this, lineIndex: lineIndex++, indent, parentKey, lastChild, value, collapsed: !expanded});
    to.push(line);
    const isArray = Array.isArray(value);
    if (expanded && (isPlainObject(value) || isArray)) {
      const names = (isArray ? iota(value.length) : Object.getOwnPropertyNames(value));
      names.forEach((name, index) => {
        lineIndex = this.build(
          to,
          lineIndex,
          value[name],
          indent + this.indent,
          isArray ? null : name,
          index >= names.length - 1,
          this.expandFunc(value[name]),
          limit
        );
      });
      if (names.length > 0 && (limit == null || to.length < limit)) {
        line.expanded = new TextRow({
          owner: this,
          text: Array(indent + 1).join(" ") + (isArray ? "]" : "}") + (lastChild ? "" : ","),
          lineIndex: lineIndex++
        });
        to.push(line.expanded);
      }
    } else {
      lineIndex += this.countLines(value) - 1; // minus one because we already incremented by one
    }
    return lineIndex;
  }
  expand(line) {
    if (!line.collapsed) return;
    const index = this.lines.indexOf(line);
    if (index < 0) return;
    if (line.collapsed === true) {
      line.collapsed = [];
      this.build(line.collapsed, line.lineIndex, line.value, line.indent, line.parentKey, line.lastChild, true);
    }
    this.lines.splice(index, 1, ...line.collapsed);
    this.owner.forceUpdate();
    window.getSelection().removeAllRanges();
  }
  collapse(line) {
    const index = this.lines.indexOf(line);
    if (index < 0) return;
    const endIndex = this.lines.indexOf(line.expanded, index);
    if (endIndex < 0) return;
    const to = [];
    this.build(to, line.lineIndex, line.value, line.indent, line.parentKey, line.lastChild, false);
    to[0].collapsed = this.lines.splice(index, endIndex - index + 1, ...to);
    this.owner.forceUpdate();
    window.getSelection().removeAllRanges();
  }

  reveal(line) {
    const reveal_ = (list, line) => {
      const index = list.findIndex((value, index) => value.lineIndex <= line && (index + 1 >= list.length || list[index + 1].lineIndex > line));
      const next = list[index];
      if (next.lineIndex === line || !next.collapsed) return index;
      if (next.collapsed === true) {
        next.collapsed = [];
        this.build(next.collapsed, next.lineIndex, next.value, next.indent, next.parentKey, next.lastChild, true);
      }
      const pos = reveal_(next.collapsed, line);
      list.splice(index, 1, ...next.collapsed);
      return index + pos;
    };
    return reveal_(this.lines, line);
  }
}

class VirtualJson extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    document.addEventListener("copy", this.onCopy);
    document.addEventListener("selectionchange", this.onSelect);
  }
  componentWillUnmount() {
    document.removeEventListener("copy", this.onCopy);
    document.removeEventListener("selectionchange", this.onSelect);
  }

  onCopy = () => {
    if (!this._node || !this.renderer) return;
    const selection = window.getSelection();
    const tempNodes = [];
    let confirmed = null, expandLength = 0;
    const tryExpand = length => {
      expandLength += length;
      if (expandLength > 1000000 && confirmed == null) {
        confirmed = window.confirm("Selection contains a very long JSON fragment. Continue expanding?");
      }
      return confirmed !== false;
    };
    this._node.querySelectorAll(".collapsed").forEach(node => {
      if (confirmed === false) return;
      if (selection.containsNode(node, false)) {
        const lineNode = node.parentNode.querySelector(".line");
        if (!lineNode) return;
        const lineIndex = parseInt(lineNode.getAttribute("data-line-number"), 10) - 1;
        const line = this.renderer.lines.find(line => line.lineIndex === lineIndex);
        if (!line) return;
        let text = JSON.stringify(line.value, undefined, this.renderer.indent);
        if (!tryExpand(text.length)) {
          return;
        }
        const indent = Array(line.indent + 1).join(" ");
        text = text.substr(1, text.length - 2).split("\n").map((line, index) => index ? indent + line : line).join("\n");

        const tempNode = document.createElement("span");
        node.appendChild(tempNode);
        tempNode.innerText = text;
        tempNodes.push(tempNode);
      }
    });
    const ts = this.selection;
    const anchorPos = this.nodeToPos2(selection.anchorNode, selection.anchorOffset);
    const focusPos = this.nodeToPos2(selection.focusNode, selection.focusOffset);
    if (ts.anchorPos && ts.focusPos && anchorPos && focusPos) {
      const tsBegin = (ts.anchorPos.line < ts.focusPos.line ? ts.anchorPos : ts.focusPos);
      const tsEnd = (ts.anchorPos.line < ts.focusPos.line ? ts.focusPos : ts.anchorPos);
      const csBeginNode = (anchorPos.line < focusPos.line ? selection.anchorNode : selection.focusNode);
      const csBegin = (anchorPos.line < focusPos.line ? anchorPos : focusPos);
      const csEndNode = (anchorPos.line < focusPos.line ? selection.focusNode : selection.anchorNode);
      const csEnd = (anchorPos.line < focusPos.line ? focusPos : anchorPos);
      const raw = this.renderer.raw;
      if (tsBegin.line < csBegin.line && csBeginNode.nodeType === 1) {
        const lines = [];
        for (let i = tsBegin.line; i <= csBegin.line; ++i) {
          let line = raw[i];
          if (!line) continue;
          if (i === tsBegin.line) line = line.substr(tsBegin.offset);
          else if (i === csBegin.line) line = line.substr(0, csBegin.offset);
          lines.push(line);
        }
        const prepend = lines.join("\n");
        if (prepend.length && tryExpand(prepend.length)) {
          const tempNode = document.createElement("span");
          tempNode.style.position = "absolute";
          tempNode.style.left = "-10000px";
          tempNode.style.top = "-10000px";
          tempNode.style.fontSize = "0";
          tempNode.style.whiteSpace = "pre";
          tempNode.innerText = prepend;
          tempNodes.push(tempNode);
          csBeginNode.appendChild(tempNode);
        }
      }
      if (tsEnd.line > csEnd.line && csEndNode.nodeType === 1) {
        const lines = [];
        for (let i = csEnd.line + 1; i <= tsEnd.line; ++i) {
          let line = raw[i];
          if (!line) continue;
          if (i === csEnd.line) line = line.substr(csEnd.offset);
          else if (i === tsEnd.line) line = line.substr(0, tsEnd.offset);
          lines.push(line);
        }
        const append = lines.join("\n");
        if (append.length && tryExpand(append.length)) {
          const tempNode = document.createElement("span");
          tempNode.style.position = "absolute";
          tempNode.style.left = "-10000px";
          tempNode.style.top = "-10000px";
          tempNode.style.fontSize = "0";
          tempNode.style.whiteSpace = "pre";
          tempNode.innerText = append;
          tempNodes.push(tempNode);
          csEndNode.parentElement.insertBefore(tempNode, csEndNode);
        }
      }
    }
    if (confirmed === false) {
      tempNodes.forEach(node => node.parentNode.removeChild(node));
      tempNodes.length = 0;
    }
    if (tempNodes.length) {
      window.setTimeout(() => {
        tempNodes.forEach(node => node.parentNode.removeChild(node));
      }, 100);
    }
  }

  nodeToPos2(node, offset) {
    return this.nodeToPos({node, offset});
  }
  nodeToPos(data) {
    if (!data || !this._node) return;
    const {node, offset} = data;
    if (!this._node.contains(node)) return;
    if (node === this._firstLine) {
      const lines = this._node.querySelectorAll(".line");
      if (!lines.length) return;
      const firstLine = parseInt(lines[0].getAttribute("data-line-number"), 10) - 1;
      return {line: firstLine, offset: 0};
    }
    if (node === this._lastLine) {
      const lines = this._node.querySelectorAll(".line");
      if (!lines.length) return;
      const lastLine = parseInt(lines[lines.length - 1].getAttribute("data-line-number"), 10) - 1;
      return {line: lastLine, offset: lines[lines.length - 1].parentElement.textContent.length - 1};
    }
    let line = node;
    while (line && line !== this._node && (!line.classList || !line.classList.contains("JsonRow"))) {
      line = line.parentElement || line.parentNode;
    }
    if (!line || !line.classList || !line.classList.contains("JsonRow")) return;
    const lineNode = line.querySelector(".line");
    if (!lineNode) return;
    const lineIndex = parseInt(lineNode.getAttribute("data-line-number"), 10);
    return {line: lineIndex - 1, offset: getNodeOffset(line, node, offset)};
  }
  posToNode2(line, offset) {
    return this.posToNode({line, offset});
  }
  posToNode(data) {
    if (!data || !this._node) return;
    const {line, offset} = data;
    let lineNode = this._node.querySelector(`.line[data-line-number="${line + 1}"]`);
    if (!lineNode) {
      const lines = this._node.querySelectorAll(".line");
      if (!lines.length) return;
      const firstLine = parseInt(lines[0].getAttribute("data-line-number"), 10) - 1;
      if (line < firstLine && this._firstLine) {
        return {node: this._firstLine, offset: 0};
      }
      const lastLine = parseInt(lines[lines.length - 1].getAttribute("data-line-number"), 10) - 1;
      if (line > lastLine && this._lastLine) {
        return {node: this._lastLine, offset: 0};
      }
      return;
    }

    lineNode = lineNode.parentElement;
    return findNodeOffset(lineNode, offset);
  }

  onSelect = () => {
    if (this.suppressSelect || !this.selection || !this._node) return;
    const selection = window.getSelection();
    const ts = this.selection;

    const badNode = node => {
      let line = node;
      while (line && line !== this._node && line !== this._firstLine &&
          line !== this._lastLine && (!line.classList || !line.classList.contains("JsonRow"))) {
        line = line.parentElement || line.parentNode;
      }
      if (line === this._firstLine || line === this._lastLine) return false;
      return !line.classList || !line.classList.contains("JsonRow");
    };

    if (!selection.anchorNode || !this._node.contains(selection.anchorNode)) {
      ts.anchorPos = null;
    } else if (!badNode(selection.anchorNode)) {
      const p2n = this.posToNode(ts.anchorPos);
      const tsPos = this.nodeToPos(p2n);
      const csPos = this.nodeToPos2(selection.anchorNode, selection.anchorOffset);
      if (tsPos && csPos && tsPos.line === csPos.line && tsPos.offset === csPos.offset) {
        selection.setBaseAndExtent(p2n.node, p2n.offset, selection.focusNode, selection.focusOffset);
      } else {
        ts.anchorPos = csPos;
        ts.searchPos = csPos;
      }
    }

    if (!selection.focusNode || !this._node.contains(selection.focusNode)) {
      ts.focusPos = null;
    } else if (!badNode(selection.focusNode)) {
      const tsPos = this.nodeToPos(this.posToNode(ts.focusPos));
      const csPos = this.nodeToPos2(selection.focusNode, selection.focusOffset);
      if (tsPos && csPos && tsPos.line === csPos.line && tsPos.offset === csPos.offset) {
        // do nothing
      } else {
        ts.focusPos = csPos;
      }
    }
  }
  selectRange(fromPos, toPos) {
    const selection = window.getSelection();
    const from = this.posToNode(fromPos);
    const to = this.posToNode(toPos);
    selection.setBaseAndExtent(
      from ? from.node : selection.anchorNode,
      from ? from.offset : selection.anchorOffset,
      to ? to.node : selection.focusNode,
      to ? to.offset : selection.focusOffset
    );
    this.selection.anchorPos = fromPos;
    this.selection.searchPos = fromPos;
    this.selection.focusPos = toPos;
  }
  onScroll = () => {
    const ts = this.selection;
    if (!ts || !ts.anchorPos || !ts.focusPos) return;
    this.suppressSelect = true;
    this.selectRange(ts.anchorPos, ts.focusPos);
    if (this.unsuppress) clearTimeout(this.unsuppress);
    this.unsuppress = setTimeout(() => {
      this.suppressSelect = false;
      delete this.unsuppress;
    }, 100);
  }

  cellRangeRenderer = (props) => {
    const children = defaultCellRangeRenderer(props);
    children.unshift(<div key="first-line" className="fake-line" ref={node => this._firstLine = node}><span/></div>);
    children.push(<div key="last-line" className="fake-line" ref={node => this._lastLine = node}><span/></div>);
    return children;
  }

  search(text, direction) {
    if (!this.renderer || !this._list) return "";
    let nextPos = null, found = null, result = "";
    if (text.trim()) {
      let allMatches;
      if (text === this.renderer.cacheSearch) {
        text = this.renderer.cacheMatches;
      } else {
        allMatches = [];
        const textLower = text.toLowerCase();
        this.renderer.raw.forEach((line, index) => {
          let offset = 0, next;
          const lineLower = line.toLowerCase();
          while ((next = lineLower.indexOf(textLower, offset)) !== -1) {
            allMatches.push({line: index, offset: next});
            offset = next + textLower.length;
          }
        });
        this.renderer.cacheMatches = allMatches;
      }
      let curMatch = -1;
      if (direction !== -1) {
        const origin = (direction === 1 && this.state.match ?
          {line: this.state.match.line, offset: this.state.match.offset + 1} :
          this.selection.searchPos || {line: 0, offset: 0}
        );
        curMatch = allMatches.findIndex(m => m.line > origin.line || (m.line === origin.line && m.offset >= origin.offset));
        if (curMatch < 0 && allMatches.length) curMatch = 0;
      } else {
        const origin = (this.state.match ? {line: this.state.match.line, offset: this.state.match.offset - 1} :
          this.selection.searchPos || {line: 0, offset: 0}
        );
        allMatches.forEach((m, index) => {
          if (m.line > origin.line || (m.line === origin.line && m.offset > origin.offset)) return;
          curMatch = index;
        });
        if (curMatch < 0 && allMatches.length) curMatch = allMatches.length - 1;
      }
      nextPos = allMatches[curMatch];
      found = (nextPos && this.renderer.reveal(nextPos.line));
      result = `${curMatch + 1}/${allMatches.length}`;
    }
    if (this._list) this._list.forceUpdateGrid();
    this.setState({search: text, match: nextPos}, () => {
      if (found && this._list) this._list.scrollToRow(found);
      //if (this._node.contains(document.activeElement)) {
      //  this.selectRange(nextPos, {line: nextPos.line, offset: nextPos.offset + text.length});
      //}
    });
    return result;
  }

  rowRenderer = ({index, ...options}) => {
    return this.renderer.lines[index].render(options);
  }
  render() {
    const { value, className, expand } = this.props;
    if (!this.renderer || this.renderer.value !== value || this.renderer.expandFunc !== expand) {
      this.renderer = new JsonRenderer(value, expand, this);
      this.selection = {};
    }
    return (
      <div className={className} ref={node => this._node = node}>
        <AutoSizer>
          {({width, height}) => 
            <List className="JsonLines"
                  ref={node => this._list = node}
                  width={width}
                  height={height}
                  rowCount={this.renderer.lines.length}
                  onScroll={this.onScroll}
                  cellRangeRenderer={this.cellRangeRenderer}
                  rowHeight={17}
                  rowRenderer={this.rowRenderer}/>
          }
        </AutoSizer>
      </div>
    );
  }
}

class JsonViewer extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    url: PropTypes.string,
    size: PropTypes.shape({
      compressed: PropTypes.number.isRequired,
      uncompressed: PropTypes.number.isRequired,
    }),
    value: PropTypes.any.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      expand: obj => {
        if (isPlainObject(obj)) return Object.getOwnPropertyNames(obj) < 16;
        if (Array.isArray(obj)) return obj.length < 16;
        return true;
      },
      searchTag: "",
      searchText: "",
    };
  }

  expand = () => {
    this.setState({expand: () => true});
  }
  collapse = () => {
    this.setState({expand: () => false});
  }

  search(text, dir) {
    this.setState({
      searchText: text,
      searchTag: this._json ? this._json.search(text, dir) : "",
    });
  }

  findPrev = () => {
    this.search(this.state.searchText, -1);
  }
  findNext = () => {
    this.search(this.state.searchText, 1);
  }
  onSearchChange = (e) => {
    this.search(e.target.value, 0);
  }
  onSearchKeyDown = (e) => {
    switch (e.which) {
    case keycode.codes.enter:
      this.search(this.state.searchText, 1);
      e.preventDefault();
      break;
    case keycode.codes.esc:
      this.search("", 0);
      e.preventDefault();
      break;
    }
  }
  onKeyDown = (e) => {
    const { searchText } = this.state;
    switch (e.which) {
    case keycode.codes.f3:
      if (e.shiftKey) {
        this.search(searchText, -1);
      } else {
        this.search(searchText, 1);
      }
      e.preventDefault();
      break;
    case keycode.codes.f:
      if (e.ctrlKey && this._search) {
        this._search.focus();
        this._search.select();
        e.preventDefault();
      }
      break;
    }
  }

  render() {
    const { name, url, size, value, className, ...props } = this.props;
    const { expand, searchTag, searchText } = this.state;
    let download = null;
    if (url) {
      download = <NavItem eventKey="source" href={url + "?dl"}>Download <Glyphicon glyph="download-alt"/></NavItem>;
      if (size) {
        const sizeTip = formatSize(size.uncompressed) + " (" + formatSize(size.compressed) + " compressed)";
        download = (
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="download-tip">{sizeTip}</Tooltip>}>
            {download}    
          </OverlayTrigger>
        );
      }
    }
    const results = (searchTag.length > 0 && searchTag !== "0/0");
    return (
      <div className={classNames("JsonViewer", className)} onKeyDown={this.onKeyDown} {...props}>
        <Navbar fluid className="JsonHeader">
          {name && (
            <Navbar.Header>
              <Navbar.Brand>
                {name}
              </Navbar.Brand>
            </Navbar.Header>
          )}
          <Nav>
            {download}
            <NavItem eventKey="expand" onClick={this.expand}>Expand All</NavItem>
            <NavItem eventKey="collapse" onClick={this.collapse}>Collapse All</NavItem>
          </Nav>
          <Navbar.Form pullLeft>
            <FormGroup>
              <div className="form-control">
                <input type="text"
                       placeholder="Search"
                       ref={node => this._search = node}
                       value={searchText}
                       onChange={this.onSearchChange}
                       onKeyDown={this.onSearchKeyDown}/>
                {searchTag.length > 0 && <span className="search-tag">{searchTag}</span>}
                <button disabled={!results} onClick={this.findPrev} title="Previous"><Glyphicon glyph="chevron-up"/></button>
                <button disabled={!results} onClick={this.findNext} title="Next"><Glyphicon glyph="chevron-down"/></button>
              </div>
            </FormGroup>
          </Navbar.Form>
        </Navbar>
        <VirtualJson value={value} expand={expand} ref={node => this._json = node} className="JsonSource"/>
      </div>
    );
  }
}

export { JsonViewer };