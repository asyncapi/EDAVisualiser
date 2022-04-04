import React from 'react';
import { ApplicationNodeData } from "../../types";
import { Outgoing } from './Outgoing';

type InternalApplicationProps = {
  internal?: {
    addElementCallback?: any
  }
}

type ApplicationProps = ApplicationNodeData & InternalApplicationProps
export const Application: React.FunctionComponent<ApplicationProps> = (props) => {
  const nodeData = {...props};
  delete nodeData.children;
  delete nodeData.internal;
  const applicationNode = {
    id: nodeData.id,
    type: 'applicationNode',
    data: nodeData
  };
  props.internal?.addElementCallback(applicationNode);

  const childrenWithProps = React.Children.map(props.children, child => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {

      let connectorNode;
      if (Outgoing.isPrototypeOf(child.type)) {
        connectorNode = {
          id: `outgoing-${props.id}-${child.props.id}`,
          type: 'smoothstep',
          style: { stroke: 'orange', strokeWidth: 4 },
          source: props.id,
          target: child.props.id
        };
      } else {
        connectorNode = {
          id: `incoming-${props.id}-${child.props.id}`,
          type: 'smoothstep',
          style: { stroke: '#7ee3be', strokeWidth: 4 },
          target: props.id,
          source: child.props.id
        };
      }
      props.internal?.addElementCallback(connectorNode);
      return React.cloneElement(child, { internal: {addElementCallback: props.internal?.addElementCallback} });
    }
    return child;
  });
  
  return <div>{childrenWithProps}</div>
};