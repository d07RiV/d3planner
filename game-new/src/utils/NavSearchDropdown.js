import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import splitComponentProps from 'react-bootstrap/lib/utils/splitComponentProps';
import ValidComponentChildren from 'react-bootstrap/lib/utils/ValidComponentChildren';

import { SearchDropdownMenu } from './SearchDropdownMenu';

const propTypes = {
  ...Dropdown.propTypes,

  // Toggle props.
  title: PropTypes.node.isRequired,
  noCaret: PropTypes.bool,
  active: PropTypes.bool,

  search: PropTypes.string,
  onSearch: PropTypes.func,

  // Override generated docs from <Dropdown>.
  /**
   * @private
   */
  children: PropTypes.node,
};

class NavSearchDropdown extends React.Component {
  isActive({ props }, activeKey, activeHref) {
    if (
      props.active ||
      activeKey != null && props.eventKey === activeKey ||
      activeHref && props.href === activeHref
    ) {
      return true;
    }

    if (ValidComponentChildren.some(props.children, (child) => (
      this.isActive(child, activeKey, activeHref)
    ))) {
      return true;
    }

    return props.active;
  }

  render() {
    const {
      title,
      activeKey,
      activeHref,
      className,
      style,
      children,
      search,
      onSearch,
      ...props
    } = this.props;

    const active = this.isActive(this, activeKey, activeHref);
    delete props.active; // Accessed via this.isActive().
    delete props.eventKey; // Accessed via this.isActive().

    const [dropdownProps, toggleProps] =
      splitComponentProps(props, Dropdown.ControlledComponent);

    // Unlike for the other dropdowns, styling needs to go to the `<Dropdown>`
    // rather than the `<Dropdown.Toggle>`.

    return (
      <Dropdown
        {...dropdownProps}
        componentClass="li"
        className={classNames(className, { active })}
        style={style}
      >
        <Dropdown.Toggle {...toggleProps} useAnchor>
          {title}
        </Dropdown.Toggle>

        <SearchDropdownMenu search={search} onSearch={onSearch}>
          {ValidComponentChildren.map(children, child => (
            React.cloneElement(child, {
              active: this.isActive(child, activeKey, activeHref),
            })
          ))}
        </SearchDropdownMenu>
      </Dropdown>
    );
  }
}

NavSearchDropdown.propTypes = propTypes;

export { NavSearchDropdown };
export default NavSearchDropdown;
