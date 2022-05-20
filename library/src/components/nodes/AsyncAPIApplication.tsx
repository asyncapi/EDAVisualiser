import React, { ReactElement } from 'react';
import { ApplicationServerData, InternalProps, MessageData } from '../../types';
import { Application } from './Application';
import { Outgoing } from './Outgoing';
import { AsyncAPIDocument } from '@asyncapi/parser';
import { Incoming } from './Incoming';
type AsyncapiApplicationProps = {
  document: AsyncAPIDocument;
  topExtended?: ReactElement;
};

type ApplicationProps = AsyncapiApplicationProps & InternalProps;

/**
 * The Application component is a single instance of grouped outgoing and incoming channels.
 *
 * What you define as an instance can be application, grouped or single server less function, etc.
 */
export const AsyncAPIApplication: React.FunctionComponent<ApplicationProps> = props => {
  const outgoingNodes = [];
  const incomingNodes = [];
  for (const [channelPath, channel] of Object.entries(
    props.document.channels(),
  )) {
    if (channel.hasPublish()) {
      const channelId = `incoming_${props.document
        .info()
        .title()}_${channelPath}`;
      const messages: MessageData[] = channel
        .publish()
        .messages()
        .map(message => {
          return { title: message.name() || 'Unknown' };
        });
      incomingNodes.push(
        <Incoming
          key={channelId}
          channel={channelPath}
          description={channel.description() || 'No description'}
          id={channelId}
          messages={messages}
        />,
      );
    } else if (channel.hasSubscribe()) {
      const channelId = `outgoing_${props.document
        .info()
        .title()}_${channelPath}`;
      const messages: MessageData[] = channel
        .subscribe()
        .messages()
        .map(message => {
          return { title: message.name() || 'Unknown' };
        });
      outgoingNodes.push(
        <Outgoing
          key={channelId}
          channel={channelPath}
          description={channel.description() || 'No description'}
          id={channelId}
          messages={messages}
        />,
      );
    }
  }
  let license;
  if (props.document.info()?.license()) {
    license = {
      name:
        props.document
          .info()
          ?.license()
          ?.name() || 'Not defined',
      url:
        props.document
          .info()
          ?.license()
          ?.url() || 'Not defined',
    };
  }
  const servers: ApplicationServerData[] = Object.entries(
    props.document.servers(),
  ).map(([serverId, server]) => {
    return {
      description: server.description() || 'No description',
      name: serverId,
      protocol: server.protocol() || 'No protocol',
      protocolVersion: server.protocolVersion() || undefined,
      url: server.url(),
    };
  });
  return (
    <Application
      key={props.document.info().title()}
      topExtended={props.topExtended}
      internal={props.internal}
      defaultContentType={props.document.defaultContentType() || undefined}
      description={props.document.info().description() || 'No description'}
      id={props.document.info().title()}
      license={license}
      externalDocs={props.document.externalDocs()?.url() || undefined}
      servers={servers}
      title={props.document.info().title()}
      version={props.document.info().version()}
    >
      {incomingNodes}
      {outgoingNodes}
    </Application>
  );
};
