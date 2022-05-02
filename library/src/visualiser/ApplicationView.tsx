import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  FlowElement,
} from 'react-flow-renderer';
import nodeTypes from '../components/Nodes';

interface ApplicationViewProps {}

export const ApplicationView: React.FunctionComponent<ApplicationViewProps> = ({
  children,
}) => {
  const [elements, setElements] = useState<FlowElement[]>([]);
  const tempElements: FlowElement[] = [];
  const addElementCallback = (element: FlowElement) => {
    tempElements.push(element);
  };

  useEffect(() => {
    setElements(tempElements);
  }, []);

  const childrenWithProps = React.Children.map(children, (child: any) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      const props: any = { internal: { addElementCallback } };
      return React.cloneElement(child, props);
    }
    return child;
  });

  return (
    <section
      className="bg-gray-800 edavisualiser-root"
      style={{ width: '100%', height: '100%' }}
    >
      {childrenWithProps}
      <ReactFlow nodeTypes={nodeTypes} elements={elements} minZoom={0.1}>
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
    </section>
  );
};
