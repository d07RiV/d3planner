import React from 'react';
import { Panel } from 'react-bootstrap';

import { withAsync, Cache, ErrorView } from 'utils';

const HomeComponent = ({versions}) => {
  const vertext = (
    <React.Fragment>
      {versions.live != null &&
        <p>
          Current Live game version: {versions.versions[versions.live] || versions.live}
        </p>
      }
      {versions.ptr != null &&
        <p>
          Current PTR game version: {versions.versions[versions.ptr] || versions.live}
        </p>
      }
    </React.Fragment>
  );
  return (
    <div className="app-body p-margin">
      {versions.parse_error ? (
        <Panel bsStyle="danger">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Failed to parse latest version</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <p>
              New game version has been detected, but there were errors while trying to parse it.
            </p>
            {vertext}
          </Panel.Body>
        </Panel>
      ) : (versions.parsing ? (
        <Panel bsStyle="warning">
          <Panel.Heading>
            <Panel.Title componentClass="h3">New build detected</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <p>
              A new version of the game has been detected on the CDN, and is currently being parsed. Check back in about a minute (or click the icon in top right to update).
            </p>
            {vertext}
          </Panel.Body>
        </Panel>
      ) : (
        <Panel bsStyle="success">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Everything up to date</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <p>
              When a new version is detected on the CDN, it will be automatically parsed within a few minutes.
            </p>
            {vertext}
          </Panel.Body>
        </Panel>
      ))}
    </div>
  );
};

const HomeScreen = withAsync({
  versions: (props, {cache}) => cache.fetch(`/api/versions`, {global: true})
}, HomeComponent, undefined, ErrorView);
HomeScreen.contextTypes = Cache.context;

export { HomeScreen };
