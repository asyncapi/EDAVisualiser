import React, { useEffect, useState } from 'react';
import ReactFlow, {
  ArrowHeadType,
  Background,
  BackgroundVariant,
  EdgeTypesType,
  FlowElement,
} from 'react-flow-renderer';
import { ColumnLayout } from '../../components/layouts';
import nodeTypes from '../../components/react-flow-renderer-nodes';
import FloatingConnectionLine from '../../components/react-flow-renderer-nodes/FloatingConnectionLine';
import FloatingEdge from '../../components/react-flow-renderer-nodes/FloatingEdge';
import {
  ApplicationNodeData,
  IncomingNodeData,
  LayoutProps,
  OutgoingNodeData,
} from '../../types';

interface SystemViewProps {
  layout: (elements: FlowElement[]) => React.FunctionComponent<LayoutProps>;
}

const edgeTypes: EdgeTypesType = {
  floating: FloatingEdge,
};

export const SystemView: React.FunctionComponent<SystemViewProps> = ({
  children,
  layout = elementsToLayout => {
    return <ColumnLayout elementsToRender={elementsToLayout} />;
  },
}) => {
  const [loaded, setLoaded] = useState(false);
  const [elements, setElements] = useState<FlowElement[]>([]);
  const tempElements: FlowElement[] = [];

  const outgoingConnections: { [key: string]: string[] } = {};
  const incomingConnections: { [key: string]: string[] } = {};
  const addApplicationCallback = (node: ApplicationNodeData) => {
    const applicationReactFlowRendererNode = {
      id: node.id,
      type: 'applicationNode',
      data: { ...node, hideHandlers: true, nodeWidth: 700, nodeHeight: 300 },
      position: { x: 0, y: 0 },
    };
    tempElements.push(applicationReactFlowRendererNode);
  };
  const addOutgoingCallback = (node: OutgoingNodeData) => {
    const appId = node.forApplication || '';
    const uniqueConnectionId = node.channel;
    !outgoingConnections[appId] && (outgoingConnections[appId] = []);
    outgoingConnections[appId].push(uniqueConnectionId);
  };
  const addIncomingCallback = (node: IncomingNodeData) => {
    const appId = node.forApplication || '';
    const uniqueConnectionId = node.channel;
    !incomingConnections[uniqueConnectionId] &&
      (incomingConnections[uniqueConnectionId] = []);
    incomingConnections[uniqueConnectionId].push(appId);
  };
  // for each application, list all applications it connects to based on channel

  useEffect(() => {
    for (const [appId, uniqueChannels] of Object.entries(outgoingConnections)) {
      for (const uniqueChannel of uniqueChannels) {
        if (incomingConnections[uniqueChannel]) {
          for (const incomingApp of incomingConnections[uniqueChannel]) {
            const edge = {
              id: `${appId}-to-${incomingApp}`,
              type: 'floating',
              style: { stroke: 'orange', strokeWidth: 4 },
              source: appId,
              target: incomingApp,
              arrowHeadType: ArrowHeadType.Arrow,
            };
            tempElements.push(edge);
          }
        }
      }
    }
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
          addApplicationCallback,
          addIncomingCallback,
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
        edgeTypes={edgeTypes}
        connectionLineComponent={FloatingConnectionLine}
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
