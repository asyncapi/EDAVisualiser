import React, { useEffect } from 'react';
import {
  FlowElement,
  Node,
  useStoreActions,
  useStoreState,
  useZoomPanHelper,
} from 'react-flow-renderer';
import { LayoutProps } from '../../types';

export interface CircleLayoutOptions {}
const defaultOptions: CircleLayoutOptions = {};
function degreesToRadians(degrees: number) {
  const pi = Math.PI;
  return degrees * (pi / 180);
}
function calculateLayout(
  elements: Node[],
  passedOptions: Partial<CircleLayoutOptions> = defaultOptions,
): FlowElement[] {
  
  const eachDegree = 360 / elements.length;
  let nextDegree = 0;
  const r = elements.length * 100;

  for (const element of elements) {
    const x = r * Math.cos(degreesToRadians(nextDegree)) + 0;
    const y = r * Math.sin(degreesToRadians(nextDegree)) + 0;
    nextDegree += eachDegree;
    element.__rf.position = {
      x,
      y,
    };
  }

  return elements;
}

export const CircleLayout: React.FunctionComponent<LayoutProps> = ({
  elementsToRender,
}) => {
  const nodeStates = useStoreState(store => store.nodes);
  const nodeEdges = useStoreState(store => store.edges);
  const setElements = useStoreActions(actions => actions.setElements);
  const { fitView } = useZoomPanHelper();
  const nodesAndEdges = [...nodeStates, ...nodeEdges];

  const rerender = () => {
    const calculatedNodes = calculateLayout(nodeStates);
    setElements([...calculatedNodes, ...nodeEdges]);
    fitView();
  };

  useEffect(() => {
    if (elementsToRender.length === nodesAndEdges.length) {
      // stop overlap no nodes when re-render, recalculate where they should go
      const nodesWithOrginalPosition = nodeStates.filter(
        node => node.__rf.position.x === 0 && node.__rf.position.y === 0,
      );
      if (nodesWithOrginalPosition.length > 1) {
        setTimeout(() => {
          rerender();
        }, 1);
      }
    }
  }, [nodeStates]);

  return null;
};
