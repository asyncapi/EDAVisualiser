import React from 'react';
import { OutgoingNodeData } from "../../types";

type InternalOutgoingProps = {
  internal?: {
    addElementCallback: any
  }
}

type OutgoingProps = OutgoingNodeData & InternalOutgoingProps
export const Outgoing: React.FunctionComponent<OutgoingProps> = (props) => {
  const nodeData = {...props};
  delete nodeData.children;
  delete nodeData.internal;
  const outgoingNode = {
    id: nodeData.id,
    type: 'outgoingNode',
    data: nodeData
  };
  props.internal?.addElementCallback(outgoingNode);
  
  return null
};