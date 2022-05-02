import React, { useEffect } from 'react';
import {
  FlowElement,
  Node,
  useStoreActions,
  useStoreState,
  useZoomPanHelper,
} from 'react-flow-renderer';
import { LayoutProps } from '../../types';

export interface ColumnLayoutOptions {
  verticalPadding: number;
  columnPadding: number;
}
const defaultOptions: ColumnLayoutOptions = {
  verticalPadding: 40,
  columnPadding: 100,
};
function calculateLayout(
  elements: Node[],
  passedOptions: Partial<ColumnLayoutOptions> = defaultOptions,
  onGroupGive: (element: FlowElement) => number = element => {
    switch (element.type) {
      case 'incomingNode':
        return 0;
      case 'applicationNode':
        return 1;
      case 'outgoingNode':
        return 2;
    }
    return 0;
  },
): FlowElement[] {
  const options = { ...defaultOptions, ...passedOptions };
  const columns: { [key: number]: Node[] } = {};
  for (const element of elements) {
    const column = onGroupGive(element);
    if (columns[column] === undefined) {
      columns[column] = [element];
    } else {
      columns[column] = [...columns[column], element];
    }
  }

  let activeXPosition = 0;
  for (const [columnId, columnElements] of Object.entries(columns)) {
    let activeYPosition = 0;
    const columnMaxWidth = Math.max.apply(
      Math,
      columnElements.map((o: Node) => {
        return o.data.nodeWidth;
      }),
    );
    for (const element of columnElements) {
      element.__rf.position = {
        x: activeXPosition,
        y: activeYPosition,
      };
      activeYPosition += options.verticalPadding + element.data.nodeHeight;
    }
    activeXPosition += options.columnPadding + columnMaxWidth;
  }

  return elements;
}

export const ColumnLayout: React.FunctionComponent<LayoutProps> = ({
  elementsToRender,
}) => {
  const nodeStates = useStoreState(store => store.nodes);
  const nodeEdges = useStoreState(store => store.edges);
  const setElements = useStoreActions(actions => actions.setElements);
  const { fitView } = useZoomPanHelper();
  const nodesAndEdges = [...nodeStates, ...nodeEdges];

  const rerender = () => {
    const calculatedNodes = calculateLayout(nodeStates, {
      verticalPadding: 40,
    });
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
