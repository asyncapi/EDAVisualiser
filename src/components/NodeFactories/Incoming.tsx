import React from 'react';
import { IncomingNodeData } from "../../types";

type InternalIncomingProps = {
  internal?: {
    addElementCallback?: any
  }
}

type IncomingProps = IncomingNodeData & InternalIncomingProps
export const Incoming: React.FunctionComponent<IncomingProps> = (props) => {
  const tempNode = {...props};
  delete tempNode.children;
  delete tempNode.internal;
  const nodeData: IncomingNodeData = tempNode;
  const applicationNode = {
    id: nodeData.id,
    type: 'incomingNode',
    data: nodeData
  };

  props.internal?.addElementCallback(applicationNode);
  return null;
};