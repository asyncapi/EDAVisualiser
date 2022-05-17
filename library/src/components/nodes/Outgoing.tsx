import React from 'react';
import { InternalProps, OutgoingNodeData } from '../../types';

type OutgoingProps = OutgoingNodeData & InternalProps;
export const Outgoing: React.FunctionComponent<OutgoingProps> = props => {
  const nodeData = { ...props };
  delete nodeData.children;
  delete nodeData.internal;
  const outgoingNodeData: OutgoingNodeData = nodeData;
  props.internal?.addOutgoingCallback(outgoingNodeData);
  return null;
};
