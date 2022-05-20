import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  EdgeTypesType,
  FlowElement,
} from 'react-flow-renderer';
import { ColumnLayout } from '../../components/layouts';
import nodeTypes from '../../components/react-flow-renderer-nodes';
import FloatingEdge from '../../components/react-flow-renderer-nodes/FloatingEdge';
import {
  ApplicationNodeData,
  IncomingNodeData,
  LayoutProps,
  OutgoingNodeData,
} from '../../types';

const edgeTypes: EdgeTypesType = {
  floating: FloatingEdge,
};

interface ApplicationFocusViewProps {
  layout?: (elements: FlowElement[]) => React.FunctionComponent<LayoutProps>;
  sideMenu?: () => React.FunctionComponent<any>;
}

export const ApplicationFocusView: React.FunctionComponent<ApplicationFocusViewProps> = ({
  children,
  layout = elementsToLayout => {
    return <ColumnLayout elementsToRender={elementsToLayout} />;
  },
  sideMenu = () => {
    return (
      <div className="m-4 px-2 text-lg absolute text-gray-800 top-0 left-0 bg-white space-x-2 py-2 border border-gray-100 inline-block">
        <span className="font-bold">Event Visualiser</span>
        <span className="text-gray-200">|</span>
        <span className="font-light capitalize">Test</span>
      </div>
    );
  },
}) => {
  const [loaded, setLoaded] = useState(false);
  const [elements, setElements] = useState<FlowElement[]>([]);
  const tempElements: FlowElement[] = [];
  let leadApplication: ApplicationNodeData;
  const addApplicationCallback = (node: ApplicationNodeData) => {
    if (leadApplication === undefined) {
      leadApplication = node;
      const applicationReactFlowRendererNode = {
        id: node.id,
        type: 'applicationNode',
        data: { ...node, nodeWidth: 700, nodeHeight: 300 },
        position: { x: 0, y: 0 },
      };
      tempElements.push(applicationReactFlowRendererNode);
    } else {
      const externalOutgoing = {
        id: `outgoing_external_${node.id}`,
        type: 'externalApplicationNode',
        data: { ...node, nodeWidth: 700, nodeHeight: 300, side: 'outgoing' },
        position: { x: 0, y: 0 },
      };
      const externalIncoming = {
        id: `incoming_external_${node.id}`,
        type: 'externalApplicationNode',
        data: { ...node, nodeWidth: 700, nodeHeight: 300, side: 'incoming' },
        position: { x: 0, y: 0 },
      };
      tempElements.push(externalOutgoing, externalIncoming);
    }
  };
  const leadApplicationIncomingChannels: string[] = [];
  const leadApplicationOutgoingChannels: string[] = [];
  const addIncomingCallback = (node: IncomingNodeData) => {
    const appId = node.forApplication || '';
    if (leadApplication.id === appId) {
      const incomingReactFlowRendererNode = {
        id: node.id,
        type: 'incomingNode',
        data: { ...node, nodeWidth: 650, nodeHeight: 380 },
        position: { x: 0, y: 0 },
      };
      const connectionEdge = {
        id: `incoming-${appId}-${node.id}`,
        type: 'smoothstep',
        style: { stroke: '#7ee3be', strokeWidth: 4 },
        target: appId,
        source: node.id,
      };
      leadApplicationIncomingChannels.push(node.id);
      tempElements.push(incomingReactFlowRendererNode, connectionEdge);
    } else {
      const source = `${leadApplication.id}${node.channel}`;
      if (leadApplicationOutgoingChannels.includes(source)) {
        const connectionEdge = {
          id: `incoming-${appId}-${node.id}`,
          type: 'default',
          style: { stroke: '#7ee3be', strokeWidth: 4 },
          target: `incoming_external_${appId}`,
          source,
        };
        tempElements.push(connectionEdge);
      }
    }
  };
  const addOutgoingCallback = (node: OutgoingNodeData) => {
    const appId = node.forApplication || '';
    if (leadApplication.id === appId) {
      const outgoingNode = {
        id: node.id,
        type: 'outgoingNode',
        data: { ...node, nodeWidth: 650, nodeHeight: 380 },
        position: { x: 0, y: 0 },
      };
      const connectionEdge = {
        id: `outgoing-${appId}-${node.id}`,
        type: 'smoothstep',
        style: { stroke: 'orange', strokeWidth: 4 },
        source: appId,
        target: node.id,
      };
      leadApplicationOutgoingChannels.push(node.id);
      tempElements.push(outgoingNode, connectionEdge);
    } else {
      const target = `${leadApplication.id}${node.channel}`;
      if (leadApplicationIncomingChannels.includes(target)) {
        const connectionEdge = {
          id: `outgoing-${appId}-${node.id}`,
          type: 'default',
          style: { stroke: 'orange', strokeWidth: 4 },
          source: `outgoing_external_${appId}`,
          target,
        };
        tempElements.push(connectionEdge);
      }
    }
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
        edgeTypes={edgeTypes}
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
      {sideMenu}
    </section>
  );
};
