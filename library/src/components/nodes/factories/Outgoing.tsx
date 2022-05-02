import React from 'react';
import { OutgoingNodeData } from '../../../types';

type InternalOutgoingProps = {
  internal?: {
    addElementCallback: any;
  };
};

type OutgoingProps = OutgoingNodeData & InternalOutgoingProps;
export const Outgoing: React.FunctionComponent<OutgoingProps> = props => {
  const nodeData = { ...props };
  delete nodeData.children;
  delete nodeData.internal;
  const outgoingNode = {
    id: nodeData.id,
    type: 'outgoingNode',
    data: { ...nodeData, nodeWidth: 650, nodeHeight: 380 },
    position: { x: 0, y: 0 },
  };
  props.internal?.addElementCallback(outgoingNode);
  return null;
};
