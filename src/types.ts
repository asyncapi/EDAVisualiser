export interface ApplicationNodeData {
  id: string,
  defaultContentType: string,
  description: string,
  title: string,
  version: string,
  license: {
    name: string,
    url: string,
  },
  externalDocs: string,
  servers: {
      name: string,
      url: string,
      description: string,
      protocol: string,
      protocolVersion: string,
  }[],
}

export interface ApplicationNodeProps {
  data: ApplicationNodeData
}

export interface IncomingNodeData {
  id: string,
  description: string,
  channel: string,
  messages: {
    title: string
  }[]
}
export interface IncomingNodeProps {
  data: IncomingNodeData
}
export interface OutgoingNodeData {
  id: string,
  description: string,
  channel: string,
  messages: {
    title: string
  }[]
}
export interface OutgoingNodeProps {
  data: OutgoingNodeData
}