import React from 'react';
import { ApplicationNodeData, InternalProps } from '../../types';

type ApplicationProps = ApplicationNodeData & InternalProps;

/**
 * The Application component is a single instance of grouped outgoing and incoming channels.
 *
 * What you define as an instance can be application, grouped or single server less function, etc.
 */
export const Application: React.FunctionComponent<ApplicationProps> = props => {
  const nodeData = {
    ...props,
  };
  delete nodeData.children;
  delete nodeData.internal;
  const applicationNodeData: ApplicationNodeData = nodeData;

  props.internal?.addApplicationCallback(applicationNodeData);

  const childrenWithProps = React.Children.map(props.children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        forApplication: applicationNodeData.id,
        internal: props.internal,
      });
    }
    return child;
  });

  return <div key={applicationNodeData.id}>{childrenWithProps}</div>;
};
