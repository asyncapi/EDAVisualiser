import React, { useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  FlowElement,
} from 'react-flow-renderer';
import nodeTypes from '../components/Nodes';

type SystemViewProps = {};

export const SystemView: React.FunctionComponent<SystemViewProps> = ({
  children,
}) => {
  const [elements, setElements] = useState<FlowElement[]>([]);

  const addElementCallback = (element: FlowElement) => {
    setElements([...elements, element]);
  };

  const childrenWithProps = React.Children.map(children, child => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { internal: { addElementCallback } });
    }
    return child;
  });

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <div className="overflow-auto">
        <div className="h-screen bg-gray-800 relative">
          <ReactFlow nodeTypes={nodeTypes} elements={elements} minZoom={0.1}>
            {childrenWithProps}
            <Background
              color="#d1d1d3"
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              className="bg-gray-200"
            />
          </ReactFlow>
          <div className="m-4 px-2 text-lg absolute text-gray-800 top-0 left-0 bg-white space-x-2 py-2 border border-gray-100 inline-block">
            <span className="font-bold">Event Visualiser</span>
            <span className="text-gray-200">|</span>
            <span className="font-light capitalize">Test</span>
          </div>
        </div>
      </div>
    </div>
  );
};
