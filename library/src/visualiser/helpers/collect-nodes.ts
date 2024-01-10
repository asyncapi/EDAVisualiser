import { getUniqueConnectionId } from './relation-finder';
import { Node, Edge, FlowElement, ArrowHeadType } from 'react-flow-renderer';
import {
  ApplicationViewData,
  ApplicationFocusViewData,
  ApplicationNodeData,
  AsyncapiApplicationData,
  IncomingNodeData,
  OutgoingNodeData,
  ApplicationServerData,
  MessageData,
  SystemViewData,
  EdgeType,
} from '../../types';

export function collectApplicationNodes(
  {
    asyncapi,
    application,
    incomingOperations,
    outgoingOperations,
  }: ApplicationViewData,
  edgeType: EdgeType = 'smoothstep',
): Array<FlowElement> {
  const nodes: Array<FlowElement> = [];

  if (asyncapi) {
    nodes.push(...collectAsyncAPINodes(asyncapi, { edgeType }));
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

export function collectApplicationFocusNodes(
  {
    asyncapi,
    application,
    external,
    incomingOperations,
    outgoingOperations,
  }: ApplicationFocusViewData,
  edgeType: EdgeType = 'smoothstep',
): Array<FlowElement> {
  const nodes: Array<FlowElement> = [];
  const leadApplicationIncomingChannels: string[] = [];
  const leadApplicationOutgoingChannels: string[] = [];

  if (asyncapi) {
    const createIncomingNodeFn = (data: IncomingNodeData) => {
      leadApplicationIncomingChannels.push(data.id);
      return createIncomingNode(data, edgeType);
    };
    const createOutgoingNodeFn = (data: OutgoingNodeData) => {
      leadApplicationOutgoingChannels.push(data.id);
      return createOutgoingNode(data, edgeType);
    };

    nodes.push(
      ...collectAsyncAPINodes(asyncapi, {
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

    external.forEach(externalApp => {
      if (externalApp.asyncapi) {
        nodes.push(
          ...collectAsyncAPINodes(externalApp.asyncapi, {
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

export function collectSystemNodes(
  { applications = [] }: SystemViewData,
  edgeType: EdgeType = 'floating',
): Array<FlowElement> {
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

  applications.forEach(app => {
    if (app.asyncapi) {
      collectAsyncAPINodes(app.asyncapi, {
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
  });

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
  { document, topExtended }: AsyncapiApplicationData,
  {
    createApplicationNodeFn = createApplicationNode,
    createIncomingNodeFn = createIncomingNode,
    createOutgoingNodeFn = createOutgoingNode,
    edgeType = 'floating',
  }: {
    createApplicationNodeFn?: typeof createApplicationNode;
    createIncomingNodeFn?: typeof createIncomingNode;
    createOutgoingNodeFn?: typeof createOutgoingNode;
    edgeType?: EdgeType;
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
    ...createAsyncAPIApplication(
      { document, topExtended },
      createApplicationNodeFn,
    ),
  );
  return nodes;
}

export function createAsyncAPIApplication(
  { document, topExtended }: AsyncapiApplicationData,
  createApplicationNodeFn: typeof createApplicationNode = createApplicationNode,
): Array<FlowElement> {
  const documentLicense = document.info().license();
  let license;
  if (documentLicense) {
    license = {
      name: documentLicense.name() ?? 'Not defined',
      url: documentLicense.url() ?? 'Not defined',
    };
  }

  const servers: ApplicationServerData[] = document
    .servers()
    .all()
    .map(server => {
      return {
        description: server.description() ?? 'No description',
        name: server.id(),
        protocol: server.protocol() ?? 'No protocol',
        protocolVersion: server.protocolVersion() ?? undefined,
        url: server.url(),
      };
    });

  const applicationNodeData: ApplicationNodeData = {
    id: document.info().title(),
    title: document.info().title(),
    version: document.info().version(),
    description: document.info().description() ?? 'No description',
    externalDocs:
      document
        .info()
        .externalDocs()
        ?.url() ?? undefined,
    defaultContentType: document.defaultContentType() ?? undefined,
    license,
    servers,
    topExtended,
  };
  return createApplicationNodeFn(applicationNodeData);
}

export function createApplicationNode(
  data: ApplicationNodeData,
): Array<FlowElement> {
  return [
    {
      id: data.id,
      type: 'applicationNode',
      data: { ...data, nodeWidth: 700, nodeHeight: 300 },
      position: { x: 0, y: 0 },
    },
  ] as Node[];
}

export function createExternalApplicationNode(
  data: ApplicationNodeData,
): Array<FlowElement> {
  const externalOutgoing = {
    id: `outgoing_external_${data.id}`,
    type: 'externalApplicationNode',
    data: { ...data, nodeWidth: 700, nodeHeight: 300, side: 'outgoing' },
    position: { x: 0, y: 0 },
  };
  const externalIncoming = {
    id: `incoming_external_${data.id}`,
    type: 'externalApplicationNode',
    data: { ...data, nodeWidth: 700, nodeHeight: 300, side: 'incoming' },
    position: { x: 0, y: 0 },
  };
  return [externalOutgoing, externalIncoming];
}

export function createIncomingNode(
  data: IncomingNodeData,
  edgeType: EdgeType,
): Array<FlowElement> {
  const appId = data.forApplication ?? '';
  const incomingNode: Node = {
    id: data.id,
    type: 'incomingNode',
    data: { ...data, nodeWidth: 650, nodeHeight: 380 },
    position: { x: 0, y: 0 },
  };
  const connectionEdge: Edge = {
    id: `incoming-${appId}-${data.id}`,
    ...(edgeType !== 'animated'
      ? { type: edgeType, animated: false }
      : { animated: true }),
    style: { stroke: '#7ee3be', strokeWidth: 4 },
    target: appId,
    source: data.id,
  };
  return [incomingNode, connectionEdge];
}

export function createExternalIncomingNode(
  data: IncomingNodeData,
  source: string,
): Array<FlowElement> {
  const appId = data.forApplication ?? '';
  return [
    {
      id: `incoming-${appId}-${data.id}`,
      type: 'default',
      style: { stroke: '#7ee3be', strokeWidth: 4 },
      target: `incoming_external_${appId}`,
      source,
    },
  ] as Edge[];
}

export function createOutgoingNode(
  data: OutgoingNodeData,
  edgeType: EdgeType,
): Array<FlowElement> {
  const appId = data.forApplication ?? '';
  const outgoingNode: Node = {
    id: data.id,
    type: 'outgoingNode',
    data: { ...data, nodeWidth: 650, nodeHeight: 380 },
    position: { x: 0, y: 0 },
  };
  const connectionEdge: Edge = {
    id: `outgoing-${appId}-${data.id}`,
    ...(edgeType !== 'animated'
      ? { type: edgeType, animated: false }
      : { animated: true }),
    style: { stroke: 'orange', strokeWidth: 4 },
    source: appId,
    target: data.id,
  };
  return [outgoingNode, connectionEdge];
}

export function createExternalOutgoingNode(
  data: OutgoingNodeData,
  target: string,
): Array<FlowElement> {
  const appId = data.forApplication ?? '';
  return [
    {
      id: `outgoing-${appId}-${data.id}`,
      type: 'default',
      style: { stroke: 'orange', strokeWidth: 4 },
      source: `outgoing_external_${appId}`,
      target,
    },
  ] as Edge[];
}
