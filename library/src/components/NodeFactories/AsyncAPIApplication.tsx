import React from 'react';
import { ApplicationLicenseData, ApplicationNodeData, ApplicationServerData, MessageData } from '../../types';
import { Application } from './Application';
import { Outgoing } from './Outgoing';
import {AsyncAPIDocument} from '@asyncapi/parser';
import { Incoming } from './Incoming';
type InternalApplicationProps = {
  internal?: {
    addElementCallback?: any;
  };
  document: AsyncAPIDocument
};

type ApplicationProps = ApplicationNodeData & InternalApplicationProps;

/**
 * The Application component is a single instance of grouped outgoing and incoming channels.
 *
 * What you define as an instance can be application, grouped or single server less function, etc.
 */
export const AsyncAPIApplication: React.FunctionComponent<ApplicationProps> = props => {
  const outgoingNodes = [];
  const incomingNodes = [];
  for (const [channelPath, channel] of Object.entries(props.document.channels())) {
    if(channel.hasPublish()) {
      const channelId = props.document.info().title() + channelPath;
      const messages: MessageData[] = channel.publish().messages().map((message) => {
        return {title: message.name() || 'Unknown'}
      });
      incomingNodes.push(<Incoming 
        internal={{addElementCallback: props.internal?.addElementCallback}}
        channel={channelPath} 
        description={channel.description() || 'No description'} 
        id={channelId} 
        messages={messages}></Incoming>);
    } else if (channel.hasSubscribe()) {
      const channelId = props.document.info().title() + channelPath;
      const messages: MessageData[] = channel.subscribe().messages().map((message) => {
        return {title: message.name() || 'Unknown'}
      });
      outgoingNodes.push(<Outgoing 
        internal={{addElementCallback: props.internal?.addElementCallback}} 
        channel={channelPath} 
        description={channel.description() || 'No description'} 
        id={channelId} 
        messages={messages}></Outgoing>);
    }
  }
  const license: ApplicationLicenseData = {
    name: props.document.info()?.license()?.name() || 'Not defined',
    url: props.document.info()?.license()?.url() || 'Not defined'
  }
  const servers: ApplicationServerData[] = Object.entries(props.document.servers()).map(([serverId, server]) => {
    return {
      description: server.description() || 'No description',
      name: serverId,
      protocol: server.protocol() || 'No protocol',
      protocolVersion: server.protocolVersion() || 'No protocol version',
      url: server.url()
    }
  })
  return <Application
    internal={{addElementCallback: props.internal?.addElementCallback}} 
    defaultContentType={props.document.defaultContentType() || 'Undefined'} 
    description={props.document.info().description() || 'No description'}
    id={props.document.info().title()} 
    license={license} 
    externalDocs={props.document.externalDocs()?.url() || 'No external docs'} 
    servers={servers} 
    title={props.document.info().title()} 
    version={props.document.info().version()}>
    {incomingNodes}
    {outgoingNodes}
  </Application>
};
