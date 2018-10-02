import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Panel.css';

const choose = (...args) => args.find(x => x != null);

class Resizer extends Component {
  removeListeners() {
    document.removeEventListener("mousemove", this.onMouseMove, true);
    document.removeEventListener("mouseup", this.onMouseUp, true);
  }
  componentWillUnmount() {
    this.removeListeners();
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  getPos(e) {
    return this.props.row ? e.clientY : e.clientX;
  }

  onMouseDown = (e) => {
    this.setState({dragPos: this.getPos(e)});
    document.addEventListener("mousemove", this.onMouseMove, true);
    document.addEventListener("mouseup", this.onMouseUp, true);
    e.preventDefault();
    e.stopPropagation();
  }
  onMouseMove = (e) => {
    const { dragPos } = this.state;
    if ((e.buttons & 1) && dragPos != null) {
      const pos = this.getPos(e);
      this.setState({dragPos: dragPos + this.props.onResize(pos - dragPos)});
      e.preventDefault();
      e.stopPropagation();
    } else {
      this.onMouseUp(e);
    }
  }
  onMouseUp = (e) => {
    this.setState({dragPos: null});
    this.removeListeners();
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const { dragPos } = this.state;
    return <div className={classNames("Resizer", {resizing: dragPos != null})} onMouseDown={this.onMouseDown}/>;
  }
}

class SolveSizeSize {
  constructor(context, from, to) {
    this.context = context;
    this.from = from;
    this.to = to;
  }

  solve(delta) {
    const {context: {data}, from, to} = this;
    let {size: lSize, minSize: lMinSize, maxSize: lMaxSize, adjust: lAdjust} = data[from];
    let {size: rSize, minSize: rMinSize, maxSize: rMaxSize, adjust: rAdjust} = data[to];
    lAdjust = choose(lAdjust, 0);
    rAdjust = choose(rAdjust, 0);
    lSize += lAdjust;
    rSize += rAdjust;

    delta = Math.min(delta, lSize - lMinSize);
    if (lMaxSize != null) delta = Math.max(delta, lSize - lMaxSize);
    delta = Math.max(delta, rMinSize - rSize);
    if (rMaxSize != null) delta = Math.min(delta, rMaxSize - rSize);

    if (delta) {
      data[from].adjust = lAdjust - delta;
      data[to].adjust = rAdjust + delta;
    }

    return delta;
  }
}

class SolveSizeFlex {
  constructor(context, index, flex) {
    this.context = context;
    this.index = index;
    this.flex = flex;
  }

  // from index to flex
  solve(delta) {
    const odelta = delta;
    const {context: {data, flexSize}, index, flex} = this;
    let {size: lSize, minSize: lMinSize, maxSize: lMaxSize, adjust: lAdjust} = data[index];
    lAdjust = choose(lAdjust, 0);
    lSize += lAdjust;
    delta = Math.min(delta, lSize - lMinSize);
    if (lMaxSize != null) delta = Math.max(delta, lSize - lMaxSize);
    delta = Math.max(delta, -flexSize);
    let fiPlus = 0, fikiMinus = 0;
    data.forEach((props, index) => {
      if (props.size != null) return;
      const fi = props.flex, ki = choose(props.coeff, 1);
      if (flex.includes(index)) {
        fiPlus += fi;
      } else {
        fikiMinus += fi * ki;
      }
    });
    if (delta < 0) {
      const minKi = Math.min(...flex.map(i => choose(data[i].coeff, 1)));
      const maxLambda = 1 + minKi * fiPlus / fikiMinus;
      delta = Math.max(delta, flexSize * (1 / maxLambda - 1));
    }
    if (delta * odelta <= 0) return 0;

    data[index].adjust = lAdjust - delta;
    if (flexSize + delta >= 1) {
      const lambda = flexSize / (flexSize + delta);
      const h = fikiMinus * (1 - lambda) / fiPlus;
      data.forEach((props, index) => {
        if (props.size != null) return;
        const ki = choose(props.coeff, 1);
        if (flex.includes(index)) {
          props.coeff = Math.max(ki + h, 0);
        } else {
          props.coeff = ki * lambda;
        }
      });
    }
    this.context.flexSize = flexSize + delta;
    return delta;
  }
}

class SolveFlexSize {
  constructor(context, flex, index) {
    this.solver = new SolveSizeFlex(context, index, flex);
  }
  solve(delta) {
    return -this.solver.solve(-delta);
  }
}

class SolveFlexFlex {
  constructor(context, from, to) {
    this.context = context;
    this.from = from;
    this.to = to;
  }

  solve(delta) {
    const odelta = delta;
    const {context: {data, flexSize}, from: L, to: R} = this;
    let fiki = 0, fiL = 0, fiR = 0;
    data.forEach((props, index) => {
      if (props.size != null) return;
      const fi = props.flex, ki = choose(props.coeff, 1);
      fiki += fi * ki;
      if (L.includes(index)) {
        fiL += fi;
      } else if (R.includes(index)) {
        fiR += fi;
      }
    });

    const minL = Math.min(...L.map(i => choose(data[i].coeff, 1)));
    const minR = Math.min(...R.map(i => choose(data[i].coeff, 1)));
    delta = Math.max(delta, -minR * flexSize * fiR / fiki);
    delta = Math.min(delta, minL * flexSize * fiL / fiki);

    if (odelta * delta <= 0) return 0;

    const hR = delta * fiki / flexSize / fiR;
    const hL = -delta * fiki / flexSize / fiL;
    data.forEach((props, index) => {
      if (props.size != null) return;
      const ki = choose(props.coeff, 1);
      if (L.includes(index)) {
        props.coeff = Math.max(ki + hL, 0);
      } else if (R.includes(index)) {
        props.coeff = Math.max(ki + hR, 0);
      }
    });

    return delta;
  }
}

const Solvers = {
  "size": {
    "size": SolveSizeSize,
    "flex": SolveSizeFlex,
  },
  "flex": {
    "size": SolveFlexSize,
    "flex": SolveFlexFlex,
  },
};

export default class Panel extends Component {
  static propTypes = {
    rows: PropTypes.bool,
    cols: PropTypes.bool,

    size: PropTypes.number,
    minSize: PropTypes.number,
    maxSize: PropTypes.number,
    flex: PropTypes.number,
    resizable: PropTypes.bool,
    panelRef: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {childSizes: []};
  }

  onResize = (index, delta) => {
    const { children, cols } = this.props;
    const { childSizes } = this.state;
    if (!this._node) return 0;
    const data = [];
    const style = window.getComputedStyle(this._node);
    let flexSize;
    if (cols) {
      flexSize = this._node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    } else {
      flexSize = this._node.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    }
    React.Children.forEach(children, (child, index) => {
      if (!React.isValidElement(child)) return;
      console.log(index, childSizes[index]);
      const props = {...child.props};
      props.adjust = childSizes[index] && childSizes[index].size;
      props.coeff = childSizes[index] && childSizes[index].flex;
      props.minSize = choose(props.minSize, 0);
      if (props.size == null) {
        props.flex = choose(props.flex, 1);
        flexSize -= props.minSize;
      } else {
        flexSize -= props.size + choose(props.adjust, 0);
      }
      data[index] = props;
    });
    const context = {data, flexSize};

    let moved = 0;
    while (delta) {
      const flexBefore = [], flexAfter = [];
      let sizeBefore = null, sizeAfter = null;
      data.forEach((props, ci) => {
        if (!props) return;
        const {size, minSize, maxSize, resizable, adjust, coeff} = props;
        if (size != null) {
          if (resizable) {
            const curSize = size + choose(adjust, 0);
            if (ci < index) {
              if (delta < 0 && curSize > minSize) sizeBefore = ci;
              if (delta > 0 && (maxSize == null || curSize < maxSize)) sizeBefore = ci;
            } else if (sizeAfter == null) {
              if (delta > 0 && curSize > minSize) sizeAfter = ci;
              if (delta < 0 && (maxSize == null || curSize < maxSize)) sizeAfter = ci;
            }
          }
        } else {
          const ccoeff = choose(coeff, 1);
          if (ci < index) {
            if (delta > 0 || ccoeff > 0) flexBefore.push(ci);
          } else {
            if (delta < 0 || ccoeff > 0) flexAfter.push(ci);
          }
        }
      });
      flexBefore.reverse();

      const beforeRes = flexBefore.findIndex((i, pos) => pos > 0 && flexBefore[pos - 1] !== i + 1);
      if (beforeRes >= 0) flexBefore.length = beforeRes;
      const afterRes = flexAfter.findIndex((i, pos) => pos > 0 && flexAfter[pos - 1] !== i - 1);
      if (afterRes >= 0) flexAfter.length = afterRes;

      if (flexSize < 1) {
        if (delta < 0) flexBefore.length = 0;
        else flexAfter.length = 0;
      }

      if (sizeBefore == null && !flexBefore.length) break;
      if (sizeAfter == null && !flexAfter.length) break;

      const typeBefore = (choose(sizeBefore, -1) > choose(flexBefore[0], -1) ? "size" : "flex");
      const typeAfter = (choose(sizeAfter, data.length) < choose(flexAfter[0], data.length) ? "size" : "flex");

      const solver = new Solvers[typeBefore][typeAfter](context,
        typeBefore === "size" ? sizeBefore : flexBefore, typeAfter === "size" ? sizeAfter : flexAfter);
      const result = -solver.solve(-delta);
      if (result === 0) break;
      moved += result;
      delta -= result;
    }
    this.setState({childSizes: data.map(props => {
      if (!props) return null;
      return {size: props.adjust, flex: props.coeff};
    })});
    return moved;
  }

  renderChildren() {
    const { rows, cols, children } = this.props;
    const { childSizes } = this.state;
    let firstResizable = null, lastResizable = null;
    React.Children.forEach(children, (child, index) => {
      if (!React.isValidElement(child)) return;
      let { size, resizable } = child.props;
      if (size == null || resizable) {
        if (firstResizable == null) firstResizable = index;
        lastResizable = index;
      }
    });
    let prevResizable = false;
    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      let { size, minSize, flex, resizable } = child.props;
      if (childSizes[index]) {
        const {size: childSize, flex: childFlex} = childSizes[index];
        if (size != null) {
          if (resizable) size += choose(childSize, 0);
        } else {
          flex = choose(flex, 1) * choose(childFlex, 1);
        }
      }
      const style = {flexShrink: 1};
      if (size != null) {
        style.flexBasis = size;
        style.flexGrow = 0;
      } else {
        style.flexBasis = choose(minSize, 0);
        style.flexGrow = choose(flex, 1);
      }
      let result = React.cloneElement(child, {flexStyle: style});
      if (resizable || prevResizable) {
        if (firstResizable < index && lastResizable >= index) {
          result = [<Resizer row={rows} col={cols} onResize={delta => this.onResize(index, delta)}/>, result];
        }
      }
      prevResizable = resizable;
      return result;
    });
  }

  render() {
    const { className, children, rows, cols, size, minSize, maxSize, flex, resizable, flexStyle, panelRef, ...props } = this.props;

    const panel = (
      <div ref={node => this._node = node} className={classNames("Panel", {rows, cols}, className)} {...props} ref={panelRef}>
        {rows || cols ? this.renderChildren() : children}
      </div>
    );
    if (flexStyle) {
      return <div style={{...flexStyle, position: "relative"}}>{panel}</div>;
    }
    return panel;
  }
}
