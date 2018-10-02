import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

class ActiveContainer extends React.Component {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static propTypes = {
    children: PropTypes.element.isRequired,
    path: PropTypes.string.isRequired,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    style: PropTypes.object,
    activeStyle: PropTypes.object,
    isActive: PropTypes.func,
  };

  static defaultProps = {
    exact: false,
    strict: false,
    activeClassName: 'active',
  };

  render() {
    const {
      children,
      path,
      exact,
      strict,
      activeClassName,
      className,
      activeStyle,
      style,
      isActive: getIsActive,
      ...props,
    } = this.props;

    const child = React.Children.only(children);

    return (
      <Route
        path={path}
        exact={exact}
        strict={strict}
        children={({ location, match }) => {
          const isActive = !!(getIsActive ? getIsActive(match, location) : match);

          return React.cloneElement(
            child,
            {
              ...props,
              className: [className, child.props.className, isActive ? activeClassName : null]
                .join(' ').trim(),
              style: isActive ? { ...style, ...activeStyle } : style,
            }
          );
        }}
      />
    );
  }
}

export { ActiveContainer };
export default ActiveContainer;