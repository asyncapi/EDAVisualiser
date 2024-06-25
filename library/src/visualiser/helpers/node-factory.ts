import { Node, Edge, FlowElement } from 'react-flow-renderer';
import {
  ApplicationNodeData,
  IncomingNodeData,
  OutgoingNodeData,
  ApplicationServerData,
  EdgeType,
} from '../../types';
import { AsyncAPIDocumentInterface } from '@asyncapi/parser';

export function createAsyncAPIApplication({
  document,
  topExtended,
  createApplicationNodeFn = createApplicationNode,
}: {
  document: AsyncAPIDocumentInterface;
  topExtended?: JSX.Element;
  createApplicationNodeFn: typeof createApplicationNode;
}): Array<FlowElement> {
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
