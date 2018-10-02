import classNames from 'classnames';
import keycode from 'keycode';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import { FormControl } from 'react-bootstrap';
import { bsClass, getClassSet, prefix, splitBsPropsAndOmit }
  from 'react-bootstrap/lib/utils/bootstrapUtils';
import createChainedFunction from 'react-bootstrap/lib/utils/createChainedFunction';
import ValidComponentChildren from 'react-bootstrap/lib/utils/ValidComponentChildren';

const propTypes = {
  open: PropTypes.bool,
  pullRight: PropTypes.bool,
  onClose: PropTypes.func,
  labelledBy: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
  onSelect: PropTypes.func,
  search: PropTypes.string,
  onSearch: PropTypes.func,
  rootCloseEvent: PropTypes.oneOf(['click', 'mousedown']),
};

const defaultProps = {
  bsRole: 'menu',
  pullRight: false,
};

class SearchDropdownMenu_ extends React.Component {
  constructor(props) {
    super(props);

    this.handleRootClose = this.handleRootClose.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.state = {search: ""};
  }

  getFocusableMenuItems() {
    const node = ReactDOM.findDOMNode(this);
    if (!node) {
      return [];
    }

    return Array.from(node.querySelectorAll('[tabIndex="-1"]'));
  }

  getItemsAndActiveIndex() {
    const items = this.getFocusableMenuItems();
    const activeIndex = items.indexOf(document.activeElement);

    return { items, activeIndex };
  }

  focusNext() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();
    if (items.length === 0) {
      return;
    }

    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    items[nextIndex].focus();
  }

  focusPrevious() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();
    if (items.length === 0) {
      return;
    }

    const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    items[prevIndex].focus();
  }

  handleKeyDown(event) {
    switch (event.keyCode) {
    case keycode.codes.down:
      this.focusNext();
      event.preventDefault();
      break;
    case keycode.codes.up:
      this.focusPrevious();
      event.preventDefault();
      break;
    case keycode.codes.esc:
    case keycode.codes.tab:
      this.props.onClose(event, { source: 'keydown' });
      break;
    default:
    }
  }

  handleRootClose(event) {
    this.props.onClose(event, { source: 'rootClose' });
  }

  onSearchChange = (e) => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch(e.target.value);
    }
  }

  render() {
    const {
      open,
      pullRight,
      labelledBy,
      onSelect,
      className,
      rootCloseEvent,
      children,
      search,
      onSearch,
      ...props
    } = this.props;

    const [bsProps, elementProps] = splitBsPropsAndOmit(props, ['onClose']);

    const classes = {
      ...getClassSet(bsProps),
      [prefix(bsProps, 'right')]: pullRight,
    };

    return (
      <RootCloseWrapper
        disabled={!open}
        onRootClose={this.handleRootClose}
        event={rootCloseEvent}
      >
        <div
          {...elementProps}
          role="menu"
          className={classNames(className, classes, "dropdown-search")}
          aria-labelledby={labelledBy}
        >
          <FormControl
            ref={(c) => { this.input = c; }}
            tabIndex={-1}
            type="text"
            placeholder="Search..."
            onKeyDown={this.handleKeyDown}
            onChange={this.onSearchChange}
            value={search}
          />
          <ul>
            {ValidComponentChildren.map(children, child => (
              React.cloneElement(child, {
                onKeyDown: createChainedFunction(
                  child.props.onKeyDown, this.handleKeyDown,
                ),
                onSelect: createChainedFunction(
                  child.props.onSelect, onSelect,
                ),
              })
            ))}
          </ul>
        </div>
      </RootCloseWrapper>
    );
  }
}

SearchDropdownMenu_.propTypes = propTypes;
SearchDropdownMenu_.defaultProps = defaultProps;

const SearchDropdownMenu = bsClass('dropdown-menu', SearchDropdownMenu_);

export { SearchDropdownMenu };
export default SearchDropdownMenu;
