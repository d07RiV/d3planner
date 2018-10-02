import React from 'react';
import classNames from 'classnames';

class Icon extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {visible: false};
  }
  onLoad = () => {
    this.setState({visible: true});
  }
  componentWillReceiveProps(newProps) {
    if (newProps.src !== this.props.src) {
      this.setState({visible: false});
    }
  }
  render() {
    const { className, ...props } = this.props;
    return <img {...props} className={classNames(className, {"image-loading": !this.state.visible})} onLoad={this.onLoad}/>;
  }
}

export { Icon };
export default Icon;
