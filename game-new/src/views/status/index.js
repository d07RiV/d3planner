import React from 'react';
import { Navbar, OverlayTrigger, Popover } from 'react-bootstrap';

import { withAsync } from 'utils';

import './status.css';

const GoodStatus = ({versions}) => {
  const build = Math.max(...Object.keys(versions.versions).map(v => parseInt(v, 10)));
  let name = versions.versions[build];
  if (versions.live == build) {
    name += " (Live)";
  } else if (versions.ptr == build) {
    name += " (PTR)";
  }
  return (
    <OverlayTrigger placement="bottom" containerPadding={12} overlay={<Popover id="status-tip">Current game version is {name}.</Popover>}>
      <Navbar.Text pullRight>
        Up to date <span className="status-success"/>
      </Navbar.Text>
    </OverlayTrigger>
  );
};

const ParsingStatus = ({versions, onRefresh}) => {
  const build = Math.max(versions.live || 0, versions.ptr || 0);
  let name = build;
  if (versions.live == build) {
    name += " (Live)";
  } else if (versions.ptr == build) {
    name += " (PTR)";
  }
  return (
    <OverlayTrigger placement="bottom" containerPadding={12} overlay={<Popover id="status-tip">
      New game version detected: {name}.<br/>Click here to refresh the version list in about a minute.</Popover>}>
      <Navbar.Text pullRight onClick={onRefresh} className="status-clickable">
        Updating <span className="status-updating"/>
      </Navbar.Text>
    </OverlayTrigger>
  );
};

const ErrorStatus = ({versions, message}) => {
  const build = Math.max(versions.live || 0, versions.ptr || 0);
  let name = build;
  if (versions.live == build) {
    name += " (Live)";
  } else if (versions.ptr == build) {
    name += " (PTR)";
  }
  return (
    <OverlayTrigger placement="bottom" containerPadding={12} overlay={<Popover id="status-tip">
      Latest game version is {name}, but there were errors while trying to parse it:<br/>{message}</Popover>}>
      <Navbar.Text pullRight>
        Outdated <span className="status-error"/>
      </Navbar.Text>
    </OverlayTrigger>
  );
};

const StatusMenu = withAsync({
  versions: ({versions}) => versions,
}, ({versions, onRefresh}) => (
  versions.parse_error ? <ErrorStatus versions={versions} message={versions.parse_error}/> :
  (versions.parsing ? <ParsingStatus versions={versions} onRefresh={onRefresh}/> : <GoodStatus versions={versions}/>)
));

export { StatusMenu };
