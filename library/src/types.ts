import { FlowElement } from 'react-flow-renderer';

export interface SizeData {
  nodeWidth: number;
  nodeHeight: number;
}
export interface ApplicationLicenseData {
  name: string;
  url: string;
}
export interface ApplicationServerData {
  name: string;
  url: string;
  description: string;
  protocol: string;
  protocolVersion: string;
}
export interface ApplicationNodeData {
  id: string;
  defaultContentType: string;
  description: string;
  title: string;
  version: string;
  license: ApplicationLicenseData;
  externalDocs: string;
  servers: ApplicationServerData[];
}

export interface ApplicationNodeProps {
  data: ApplicationNodeData;
}
export interface MessageData {
  title: string;
}
export interface IncomingNodeData {
  id: string;
  description: string;
  channel: string;
  messages: MessageData[];
}
export interface IncomingNodeProps {
  data: IncomingNodeData;
}
export interface OutgoingNodeData {
  id: string;
  description: string;
  channel: string;
  messages: MessageData[];
}
export interface OutgoingNodeProps {
  data: OutgoingNodeData;
}
export interface LayoutProps {
  elementsToRender: FlowElement[];
}
