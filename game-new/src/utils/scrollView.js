import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';
import { scrollIntoView } from './scrollIntoView';

function scrollView(Component, params) {
  const $history = "$history";
  const $hash = "$hash";

  class ScrollView extends React.Component {
    static displayName = `ScrollView(${Component.displayName || Component.name || "Component"})`

    onScroll = () => {
      if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        const history = this.props[$history];
        if (this.node) history.replace(history.location.pathname + history.location.hash, {scrollTop: this.node.scrollTop});
      }, 500);
    }

    nodeRef(node) {
      node = ReactDOM.findDOMNode(node);
      if (node === this.node) return;
      if (this.node) this.node.removeEventListener("scroll", this.onScroll);
      this.node = node;
      if (node) node.addEventListener("scroll", this.onScroll);
    }
    nodeRefRef = node => {
      if (this.props.nodeRef) this.props.nodeRef(node);
      if (this.betterRef) return;
      this.nodeRef(node);
    }
    nodeRefParam = node => {
      if (!node) this.betterRef = false;
      this.nodeRef(node);
      if (node) this.betterRef = true;
    }

    onHashChanged(highlight, props) {
      const { [$hash]: hash, onHashLink } = (props || this.props);
      if (!hash) return false;
      const element = document.getElementById(hash.substr(1));
      if (!element) return false;
      scrollIntoView(element);
      if (highlight && onHashLink) onHashLink(element);
      return true;
    }
    onParamsChanged() {
      const state = this.props[$history].location.state;
      if (this.node && state && state.scrollTop != null) {
        this.node.scrollTop = state.scrollTop;
      } else if (!this.onHashChanged(true) && this.node) {
        this.node.scrollTop = 0;
      }
    }

    componentDidMount() {
      this.onParamsChanged();
    }

    shouldComponentUpdate(nextProps) {
      if (Object.keys(nextProps).some(key => (
        key !== $hash && key !== $history && key !== "viewRef" && nextProps[key] !== this.props[key]
      ))) {
        return true;
      }
      if (nextProps[$hash] !== this.props[$hash]) {
        this.onHashChanged(false, nextProps);
      }
      return false;
    }

    componentDidUpdate(prevProps) {
      if (params && params.some(key => this.props[key] !== prevProps[key])) {
        this.onParamsChanged();
      } else if (this.props[$hash] !== prevProps[$hash]) {
        this.onHashChanged(false);
      }
    }
  
    render() {
      const {[$history]: history, [$hash]: hash, nodeRef, onHashLink, ...props} = this.props;
      return <Component ref={this.nodeRefRef} nodeRef={this.nodeRefParam} {...props}/>;
    }
  };

  return props => <Route render={({location: {hash}, history}) => <ScrollView {...props} {...{[$hash]: hash, [$history]: history}}/>}/>;
}

export { scrollView };
export default scrollView;
