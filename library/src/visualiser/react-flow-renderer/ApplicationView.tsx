import React, { useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  FlowElement,
} from 'react-flow-renderer';
import { ColumnLayout } from '../../components/layouts';
import { collectApplicationNodes } from '../helpers/collect-nodes';
import nodeTypes from '../../components/react-flow-renderer-nodes';

import { ApplicationViewData, LayoutProps } from '../../types';

export interface ApplicationViewProps extends ApplicationViewData {
  layout?: (
    elements: FlowElement[],
  ) => React.JSXElementConstructor<LayoutProps>;
  sideMenu?: () => React.JSXElementConstructor<any>;
}

export const ApplicationView: React.FunctionComponent<ApplicationViewProps> = ({
  asyncapi,
  application,
  incomingOperations,
  outgoingOperations,
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
  const elements = collectApplicationNodes({
    asyncapi,
    application,
    incomingOperations,
    outgoingOperations,
  });

  const handleLoaded = (reactFlowInstance: any) => {
    setLoaded(true);
    reactFlowInstance.fitView();
  };

  const layoutElement = layout(elements);
  return (
    <section
      className="bg-gray-800 edavisualiser-root"
      style={{ width: '100%', height: '100%' }}
    >
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
      {sideMenu()}
    </section>
  );
};
