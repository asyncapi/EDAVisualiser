import { getUniqueConnectionId } from './relation-finder';
import { FlowElement, ArrowHeadType } from 'react-flow-renderer';
import {
  ApplicationViewData,
  ApplicationFocusViewData,
  ApplicationNodeData,
  IncomingNodeData,
  OutgoingNodeData,
  MessageData,
  SystemViewData,
  EdgeType,
} from '../../types';
import { getDocument } from '../../helpers/AsyncAPIParserHelper';
import { AsyncAPIDocumentInterface } from '@asyncapi/parser';
import {
  createApplicationNode,
  createAsyncAPIApplication,
  createExternalApplicationNode,
  createExternalIncomingNode,
  createExternalOutgoingNode,
  createIncomingNode,
  createOutgoingNode,
} from './node-factory';

export async function collectApplicationNodes(
  {
    asyncapi,
    application,
    incomingOperations,
    outgoingOperations,
  }: ApplicationViewData,
  edgeType: EdgeType = 'smoothstep',
): Promise<Array<FlowElement>> {
  const nodes: Array<FlowElement> = [];

  if (asyncapi) {
    const document = await getDocument(asyncapi);
    nodes.push(...collectAsyncAPINodes(document, { edgeType }));
  } else if (application) {
    nodes.push(...createApplicationNode(application));
  }

  if (incomingOperations) {
    incomingOperations.forEach(op => {
      nodes.push(...createIncomingNode(op, edgeType));
    });
  }
  if (outgoingOperations) {
    outgoingOperations.forEach(op => {
      nodes.push(...createOutgoingNode(op, edgeType));
    });
  }

  return nodes;
}

export async function collectApplicationFocusNodes(
  {
    asyncapi,
    application,
    external,
    incomingOperations,
    outgoingOperations,
  }: ApplicationFocusViewData,
  edgeType: EdgeType = 'smoothstep',
): Promise<Array<FlowElement>> {
  const nodes: Array<FlowElement> = [];
  const leadApplicationIncomingChannels: string[] = [];
  const leadApplicationOutgoingChannels: string[] = [];

  if (asyncapi) {
    const document = await getDocument(asyncapi);
    const createIncomingNodeFn = (data: IncomingNodeData) => {
      leadApplicationIncomingChannels.push(data.id);
      return createIncomingNode(data, edgeType);
    };
    const createOutgoingNodeFn = (data: OutgoingNodeData) => {
      leadApplicationOutgoingChannels.push(data.id);
      return createOutgoingNode(data, edgeType);
    };

    nodes.push(
      ...collectAsyncAPINodes(document, {
        createApplicationNodeFn: createApplicationNode,
        createIncomingNodeFn,
        createOutgoingNodeFn,
        edgeType,
      }),
    );
  } else if (application) {
    nodes.push(...createApplicationNode(application));
  }

  if (incomingOperations) {
    incomingOperations.forEach(op => {
      nodes.push(...createIncomingNode(op, edgeType));
      leadApplicationIncomingChannels.push(op.id);
    });
  }
  if (outgoingOperations) {
    outgoingOperations.forEach(op => {
      nodes.push(...createOutgoingNode(op, edgeType));
      leadApplicationOutgoingChannels.push(op.id);
    });
  }

  if (external) {
    const leadApplicationId = nodes[0].id;
    const createIncomingNodeFn = (data: IncomingNodeData) => {
      const source = `outgoing_${leadApplicationId}${data.channel}`;
      if (leadApplicationOutgoingChannels.includes(source)) {
        return createExternalIncomingNode(data, source);
      }
      return [];
    };
    const createOutgoingNodeFn = (data: OutgoingNodeData) => {
      const target = `incoming_${leadApplicationId}${data.channel}`;
      if (leadApplicationIncomingChannels.includes(target)) {
        return createExternalOutgoingNode(data, target);
      }
      return [];
    };

    external.forEach(async externalApp => {
      if (externalApp.asyncapi) {
        const document = await getDocument(externalApp.asyncapi);
        nodes.push(
          ...collectAsyncAPINodes(document, {
            createApplicationNodeFn: createExternalApplicationNode,
            createIncomingNodeFn,
            createOutgoingNodeFn,
            edgeType,
          }),
        );
      } else if (externalApp.application) {
        nodes.push(...createExternalApplicationNode(externalApp.application));
      }

      if (externalApp.incomingOperations) {
        externalApp.incomingOperations.forEach(createIncomingNodeFn);
      }
      if (externalApp.outgoingOperations) {
        externalApp.outgoingOperations.forEach(createOutgoingNodeFn);
      }
    });
  }

  return nodes;
}

export async function collectSystemNodes(
  { applications = [] }: SystemViewData,
  edgeType: EdgeType = 'floating',
): Promise<Array<FlowElement>> {
  const nodes: Array<FlowElement> = [];
  const outgoingConnections: { [key: string]: string[] } = {};
  const incomingConnections: { [key: string]: string[] } = {};

  const createApplicationNodeFn = (data: ApplicationNodeData) => {
    nodes.push(...createApplicationNode(data));
    return [];
  };
  const createOutgoingNodeFn = (data: OutgoingNodeData) => {
    const appId = data.forApplication ?? '';
    const uniqueConnectionId = getUniqueConnectionId(data);
    !outgoingConnections[appId] && (outgoingConnections[appId] = []);
    outgoingConnections[appId].push(uniqueConnectionId);
    return [];
  };
  const createIncomingNodeFn = (data: IncomingNodeData) => {
    const appId = data.forApplication ?? '';
    const uniqueConnectionId = getUniqueConnectionId(data);
    !incomingConnections[uniqueConnectionId] &&
      (incomingConnections[uniqueConnectionId] = []);
    incomingConnections[uniqueConnectionId].push(appId);
    return [];
  };

  for (const app of applications) {
    if (app.asyncapi) {
      const document = await getDocument(app.asyncapi);
      collectAsyncAPINodes(document, {
        createApplicationNodeFn,
        createOutgoingNodeFn,
        createIncomingNodeFn,
        edgeType,
      });
    } else if (app.application) {
      nodes.push(...createApplicationNode(app.application));
    }

    if (app.incomingOperations) {
      app.incomingOperations.forEach(createOutgoingNodeFn);
    }
    if (app.outgoingOperations) {
      app.outgoingOperations.forEach(createIncomingNodeFn);
    }
  }

  for (const [appId, uniqueChannels] of Object.entries(outgoingConnections)) {
    for (const uniqueChannel of uniqueChannels) {
      if (incomingConnections[uniqueChannel]) {
        for (const incomingApp of incomingConnections[uniqueChannel]) {
          const edge = {
            id: `${appId}-to-${incomingApp}`,
            ...(edgeType !== 'animated'
              ? { type: edgeType, animated: false }
              : { animated: true }),
            style: { stroke: 'orange', strokeWidth: 4 },
            source: appId,
            target: incomingApp,
            arrowHeadType: ArrowHeadType.Arrow,
          };
          nodes.push(edge);
        }
      }
    }
  }
  return nodes;
}

function collectAsyncAPINodes(
  document: AsyncAPIDocumentInterface,
  {
    createApplicationNodeFn = createApplicationNode,
    createIncomingNodeFn = createIncomingNode,
    createOutgoingNodeFn = createOutgoingNode,
    edgeType = 'floating',
    topExtended,
  }: {
    createApplicationNodeFn?: typeof createApplicationNode;
    createIncomingNodeFn?: typeof createIncomingNode;
    createOutgoingNodeFn?: typeof createOutgoingNode;
    edgeType?: EdgeType;
    topExtended?: JSX.Element;
  },
): Array<FlowElement> {
  const nodes: Array<FlowElement> = [];
  const documentTitle = document.info().title();

  for (const channel of document.channels().all()) {
    const channelId = channel.id();
    let uniqueChannelId = `${documentTitle}_${channelId}`;

    for (const operation of channel.operations().all()) {
      const operationId = operation.id();
      if (operation.isReceive()) {
        uniqueChannelId = `incoming_${uniqueChannelId}_${operationId}`;
        const messages: MessageData[] = channel
          .messages()
          .all()
          .map(message => {
            return { title: message.name() ?? 'Unknown' };
          });
        nodes.push(
          ...createIncomingNodeFn(
            {
              id: uniqueChannelId,
              channel: channel.address() ?? '',
              description: channel.description() ?? 'No description',
              messages,
              forApplication: documentTitle,
            },
            edgeType,
          ),
        );
      } else if (operation.isSend()) {
        uniqueChannelId = `outgoing_${uniqueChannelId}_${operationId}`;
        const messages: MessageData[] = channel
          .messages()
          .all()
          .map(message => {
            return { title: message.name() ?? 'Unknown' };
          });

        nodes.push(
          ...createOutgoingNodeFn(
            {
              id: uniqueChannelId,
              channel: channel.address() ?? '',
              description: channel.description() ?? 'No description',
              messages,
              forApplication: documentTitle,
            },
            edgeType,
          ),
        );
      }
    }
  }

  nodes.unshift(
    ...createAsyncAPIApplication({
      document,
      topExtended,
      createApplicationNodeFn,
    }),
  );
  return nodes;
}
