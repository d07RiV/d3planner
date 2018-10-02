import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorView = ({type, ...props}) => {
  let error = "Unknown error.";
  Object.keys(props).some(id => {
    if (props[id] && props[id].error) {
      error = props[id].error;
      return true;
    }
    return false;
  });
  return (
    <div className="app-body">
      <Alert bsStyle={type || "danger"}>
        <strong>Error:</strong> {error}
      </Alert>
    </div>
  );
};

export { ErrorView };
export default ErrorView;
