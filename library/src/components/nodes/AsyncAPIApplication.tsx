import React, { ReactElement } from 'react';
import { ApplicationServerData, InternalProps, MessageData } from '../../types';
import { Application } from './Application';
import { Outgoing } from './Outgoing';
import { AsyncAPIDocumentInterface } from '@asyncapi/parser';
import { Incoming } from './Incoming';
type AsyncapiApplicationProps = {
  document: AsyncAPIDocumentInterface;
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
  for (const channel of props.document.channels().all()) {
    for (const operation of channel.operations().all()) {
      if (operation.isReceive()) {
        const uniqueChannelId = `incoming_${props.document
          .info()
          .title()}_${channel.id()}_${operation.id()}`;
        const messages: MessageData[] = channel
          .messages()
          .all()
          .map(message => {
            return { title: message.name() ?? 'Unknown' };
          });
        incomingNodes.push(
          <Incoming
            key={uniqueChannelId}
            channel={channel.address() ?? ''}
            description={channel.description() ?? 'No description'}
            id={uniqueChannelId}
            messages={messages}
          />,
        );
      } else if (operation.isSend()) {
        const uniqueChannelId = `outgoing_${props.document
          .info()
          .title()}_${channel.id()}_${operation.id()}`;
        const messages: MessageData[] = channel
          .messages()
          .all()
          .map(message => {
            return { title: message.name() ?? 'Unknown' };
          });
        outgoingNodes.push(
          <Outgoing
            key={uniqueChannelId}
            channel={channel.address() ?? ''}
            description={channel.description() ?? 'No description'}
            id={uniqueChannelId}
            messages={messages}
          />,
        );
      }
    }
  }
  let license;
  if (props.document.info()?.license()) {
    license = {
      name:
        props.document
          .info()
          ?.license()
          ?.name() ?? 'Not defined',
      url:
        props.document
          .info()
          ?.license()
          ?.url() ?? 'Not defined',
    };
  }
  const servers: ApplicationServerData[] = Object.entries(
    props.document.servers(),
  ).map(([serverId, server]) => {
    return {
      description: server.description() ?? 'No description',
      name: serverId,
      protocol: server.protocol() ?? 'No protocol',
      protocolVersion: server.protocolVersion() ?? undefined,
      url: server.url(),
    };
  });
  return (
    <Application
      key={props.document.info().title()}
      topExtended={props.topExtended}
      internal={props.internal}
      defaultContentType={props.document.defaultContentType() ?? undefined}
      description={props.document.info().description() ?? 'No description'}
      id={props.document.info().title()}
      license={license}
      externalDocs={
        props.document
          .info()
          ?.externalDocs()
          ?.url() ?? undefined
      }
      servers={servers}
      title={props.document.info().title()}
      version={props.document.info().version()}
    >
      {incomingNodes}
      {outgoingNodes}
    </Application>
  );
};
