import React from 'react';
import { ApplicationNodeData } from '../../../types';
import { Incoming } from './Incoming';
import { Outgoing } from './Outgoing';

type InternalApplicationProps = {
  internal?: {
    addElementCallback?: any;
  };
};

type ApplicationProps = ApplicationNodeData & InternalApplicationProps;

/**
 * The Application component is a single instance of grouped outgoing and incoming channels.
 *
 * What you define as an instance can be application, grouped or single server less function, etc.
 */
export const Application: React.FunctionComponent<ApplicationProps> = props => {
  const nodeData = { ...props };
  delete nodeData.children;
  delete nodeData.internal;
  const applicationNode = {
    id: nodeData.id,
    type: 'applicationNode',
    data: { ...nodeData, nodeWidth: 700, nodeHeight: 300 },
    position: { x: 0, y: 0 },
  };

  props.internal?.addElementCallback(applicationNode);

  const childrenWithProps = React.Children.map(props.children, child => {
    if (React.isValidElement(child)) {
      let connectorNode: any;
      if (child.type === Outgoing) {
        connectorNode = {
          id: `outgoing-${props.id}-${child.props.id}`,
          type: 'smoothstep',
          style: { stroke: 'orange', strokeWidth: 4 },
          source: props.id,
          target: child.props.id,
        };
      } else if (child.type === Incoming) {
        connectorNode = {
          id: `incoming-${props.id}-${child.props.id}`,
          type: 'smoothstep',
          style: { stroke: '#7ee3be', strokeWidth: 4 },
          target: props.id,
          source: child.props.id,
        };
      }
      props.internal?.addElementCallback(connectorNode);
      return React.cloneElement(child, {
        internal: { addElementCallback: props.internal?.addElementCallback },
      });
    }
    return child;
  });

  return <div key={nodeData.id}>{childrenWithProps}</div>;
};
