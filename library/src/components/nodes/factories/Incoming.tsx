import React from 'react';
import { IncomingNodeData } from '../../../types';

type InternalIncomingProps = {
  internal?: {
    addElementCallback?: any;
  };
};

type IncomingProps = IncomingNodeData & InternalIncomingProps;
export const Incoming: React.FunctionComponent<IncomingProps> = props => {
  const nodeData = { ...props };
  delete nodeData.children;
  delete nodeData.internal;
  const applicationNode = {
    id: nodeData.id,
    type: 'incomingNode',
    data: { ...nodeData, nodeWidth: 650, nodeHeight: 380 },
    position: { x: 0, y: 0 },
  };

  props.internal?.addElementCallback(applicationNode);
  return null;
};
