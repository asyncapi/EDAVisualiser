import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  FlowElement,
} from 'react-flow-renderer';
import { ColumnLayout } from '../../components/layouts';
import nodeTypes from '../../components/react-flow-renderer-nodes';
import {
  ApplicationNodeData,
  IncomingNodeData,
  LayoutProps,
  OutgoingNodeData,
} from '../../types';

interface ApplicationViewProps {
  layout: (elements: FlowElement[]) => React.FunctionComponent<LayoutProps>;
}

export const ApplicationView: React.FunctionComponent<ApplicationViewProps> = ({
  children,
  layout = elementsToLayout => {
    return <ColumnLayout elementsToRender={elementsToLayout} />;
  },
}) => {
  const [loaded, setLoaded] = useState(false);
  const [elements, setElements] = useState<FlowElement[]>([]);
  const tempElements: FlowElement[] = [];
  let lastApplicationId: string;
  const addApplicationCallback = (node: ApplicationNodeData) => {
    const applicationReactFlowRendererNode = {
      id: node.id,
      type: 'applicationNode',
      data: { ...node, nodeWidth: 700, nodeHeight: 300 },
      position: { x: 0, y: 0 },
    };
    lastApplicationId = node.id;
    tempElements.push(applicationReactFlowRendererNode);
  };
  const addIncomingCallback = (node: IncomingNodeData) => {
    const incomingReactFlowRendererNode = {
      id: node.id,
      type: 'incomingNode',
      data: { ...node, nodeWidth: 650, nodeHeight: 380 },
      position: { x: 0, y: 0 },
    };
    const connectionEdge = {
      id: `incoming-${lastApplicationId}-${node.id}`,
      type: 'smoothstep',
      style: { stroke: '#7ee3be', strokeWidth: 4 },
      target: lastApplicationId,
      source: node.id,
    };
    tempElements.push(incomingReactFlowRendererNode, connectionEdge);
  };
  const addOutgoingCallback = (node: OutgoingNodeData) => {
    const outgoingNode = {
      id: node.id,
      type: 'outgoingNode',
      data: { ...node, nodeWidth: 650, nodeHeight: 380 },
      position: { x: 0, y: 0 },
    };
    const connectionEdge = {
      id: `outgoing-${lastApplicationId}-${node.id}`,
      type: 'smoothstep',
      style: { stroke: 'orange', strokeWidth: 4 },
      source: lastApplicationId,
      target: node.id,
    };
    tempElements.push(outgoingNode, connectionEdge);
  };

  useEffect(() => {
    setElements(tempElements);
  }, []);

  const handleLoaded = (reactFlowInstance: any) => {
    setLoaded(true);
    reactFlowInstance.fitView();
  };

  const childrenWithProps = React.Children.map(children, (child: any) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      const props: any = {
        internal: {
          addIncomingCallback,
          addApplicationCallback,
          addOutgoingCallback,
        },
      };
      return React.cloneElement(child, props);
    }
    return child;
  });
  const layoutElement = layout(elements);
  return (
    <section
      className="bg-gray-800 edavisualiser-root"
      style={{ width: '100%', height: '100%' }}
    >
      {childrenWithProps}
      <ReactFlow
        nodeTypes={nodeTypes}
        elements={elements}
        minZoom={0.1}
        onLoad={handleLoaded}
      >
        <Background
          color="#d1d1d3"
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          className="bg-gray-200"
        />
        {loaded && layoutElement}
      </ReactFlow>
      <div className="m-4 px-2 text-lg absolute text-gray-800 top-0 left-0 bg-white space-x-2 py-2 border border-gray-100 inline-block">
        <span className="font-bold">Event Visualiser</span>
        <span className="text-gray-200">|</span>
        <span className="font-light capitalize">Test</span>
      </div>
    </section>
  );
};
