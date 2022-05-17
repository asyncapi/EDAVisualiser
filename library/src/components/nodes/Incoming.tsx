import React from 'react';
import { IncomingNodeData, InternalProps } from '../../types';

type IncomingProps = IncomingNodeData & InternalProps;
export const Incoming: React.FunctionComponent<IncomingProps> = props => {
  const nodeData = { ...props };
  delete nodeData.children;
  delete nodeData.internal;
  const incomingNodeData: IncomingNodeData = nodeData;

  props.internal?.addIncomingCallback(incomingNodeData);
  return null;
};
