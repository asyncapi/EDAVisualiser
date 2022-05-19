export const apps = {
  frontend: {
    asyncapi: '2.2.0',
    info: { title: 'Website WebSocket Client', version: '1.0.0' },
    servers: {
      websiteWebSocketServer: { url: 'ws://mycompany.com/ws', protocol: 'ws' },
    },
    channels: {
      'like/comment': {
        description: 'Notify the backend that a comment has been liked.',
        subscribe: {
          message: {
            description:
              'Message that is being sent when someone wants to like a comment.',
            payload: {
              type: 'object',
              title: 'likeCommentPayload',
              additionalProperties: false,
              properties: {
                commentId: {
                  allOf: [
                    { type: 'string' },
                    { description: 'Id of the comment that should be liked' },
                  ],
                },
                likedBy: {
                  allOf: [
                    { type: 'string' },
                    {
                      description:
                        'The id of the user that have liked the comment',
                    },
                  ],
                },
              },
            },
          },
        },
      },
      'update/comment/likes': {
        description: 'Update the UI when the comment likes count is updated.',
        publish: {
          message: {
            description:
              'Message that is being sent when a comment have been updated.',
            payload: {
              type: 'object',
              title: 'updateCommentLikesPayload',
              additionalProperties: false,
              properties: {
                commentId: {
                  allOf: [
                    { type: 'string' },
                    {
                      description:
                        'Id of the comment that was changed, such as when someone liked it.',
                    },
                  ],
                },
                likeCount: {
                  type: 'integer',
                  description:
                    'The new like count of how many have liked the comment.',
                },
              },
            },
          },
        },
      },
    },
  },
  backend: {
    asyncapi: '2.2.0',
    info: { title: 'Website Backend', version: '1.0.0' },
    servers: {
      websiteWebSocketServer: { url: 'ws://mycompany.com/ws', protocol: 'ws' },
      mosquitto: {
        url: 'mqtt://test.mosquitto.org',
        protocol: 'mqtt',
        bindings: { mqtt: { clientId: 'websocketServer' } },
      },
    },
    channels: {
      'comment/liked': {
        description: 'Notify all the services that a comment has been liked.',
        servers: ['mosquitto'],
        subscribe: {
          message: {
            description:
              'Message that is being sent when a comment has been liked by someone.',
            payload: {
              type: 'object',
              title: 'commentLikedPayload',
              additionalProperties: false,
              properties: {
                commentId: {
                  allOf: [
                    { type: 'string' },
                    { description: 'Id of the comment that was liked' },
                  ],
                },
              },
            },
          },
        },
      },
      'like/comment': {
        description: 'When a comment like is received from the frontend.',
        servers: ['websiteWebSocketServer'],
        publish: {
          message: {
            description:
              'Message that is being sent when someone wants to like a comment.',
            payload: {
              type: 'object',
              title: 'likeCommentPayload',
              additionalProperties: false,
              properties: {
                commentId: {
                  allOf: [
                    { type: 'string' },
                    { description: 'Id of the comment that should be liked' },
                  ],
                },
                likedBy: {
                  allOf: [
                    { type: 'string' },
                    {
                      description:
                        'The id of the user that have liked the comment',
                    },
                  ],
                },
              },
            },
          },
        },
      },
      'comment/{commentId}/changed': {
        description:
          'When an event from the broker arrives telling us to update the comment likes count on the frontend.',
        parameters: { commentId: { schema: { type: 'string' } } },
        servers: ['mosquitto'],
        publish: {
          message: {
            description:
              'Message that is being sent when a comment have been updated.',
            payload: {
              type: 'object',
              title: 'commentChangedPayload',
              additionalProperties: false,
              properties: {
                commentId: {
                  allOf: [
                    { type: 'string' },
                    {
                      description:
                        'Id of the comment that was changed, such as when someone liked it.',
                    },
                  ],
                },
                likeCount: {
                  type: 'integer',
                  description:
                    'The new like count of how many have liked the comment.',
                },
              },
            },
          },
        },
      },
      'update/comment/likes': {
        description: 'Update comment likes count in the frontend.',
        servers: ['websiteWebSocketServer'],
        subscribe: {
          message: {
            description:
              'Message that is being sent when a comment have been updated.',
            payload: {
              type: 'object',
              title: 'updateCommentLikesPayload',
              additionalProperties: false,
              properties: {
                commentId: {
                  allOf: [
                    { type: 'string' },
                    {
                      description:
                        'Id of the comment that was changed, such as when someone liked it.',
                    },
                  ],
                },
                likeCount: {
                  type: 'integer',
                  description:
                    'The new like count of how many have liked the comment.',
                },
              },
            },
          },
        },
      },
    },
  },
  comments_service: {
    asyncapi: '2.2.0',
    info: {
      title: 'Comments Service',
      version: '1.0.0',
      description:
        'This service is in charge of processing all the events related to comments.',
    },
    servers: {
      mosquitto: {
        url: 'mqtt://test.mosquitto.org',
        protocol: 'mqtt',
        bindings: { mqtt: { clientId: 'comment-service' } },
      },
    },
    channels: {
      'comment/liked': {
        description:
          'Updates the likes count in the database and sends the new count to the broker.',
        publish: {
          message: {
            description:
              'Message that is being sent when a comment has been liked by someone.',
            payload: {
              type: 'object',
              title: 'commentLikedPayload',
              additionalProperties: false,
              properties: {
                commentId: {
                  allOf: [
                    { type: 'string' },
                    { description: 'Id of the comment that was liked' },
                  ],
                },
              },
            },
          },
        },
      },
      'comment/{commentId}/changed': {
        description:
          'Sends the new count to the broker after it has been updated in the database.',
        parameters: { commentId: { schema: { type: 'string' } } },
        subscribe: {
          message: {
            description:
              'Message that is being sent when a comment have been updated.',
            payload: {
              type: 'object',
              title: 'commentChangedPayload',
              additionalProperties: false,
              properties: {
                commentId: {
                  allOf: [
                    { type: 'string' },
                    {
                      description:
                        'Id of the comment that was changed, such as when someone liked it.',
                    },
                  ],
                },
                likeCount: {
                  type: 'integer',
                  description:
                    'The new like count of how many have liked the comment.',
                },
              },
            },
          },
        },
      },
    },
  },
  notification_service: {
    asyncapi: '2.2.0',
    info: { title: 'Notifications Service', version: '1.0.0' },
    servers: {
      mosquitto: {
        url: 'mqtt://test.mosquitto.org',
        protocol: 'mqtt',
        bindings: { mqtt: { clientId: 'notification-service' } },
      },
    },
    channels: {
      'comment/liked': {
        description:
          'When a "comment has been liked" message is received, it sends an SMS or push notification to the author.',
        publish: {
          message: {
            description:
              'Message that is being sent when a comment has been liked by someone.',
            payload: {
              type: 'object',
              title: 'commentLikedPayload',
              additionalProperties: false,
              properties: {
                commentId: {
                  allOf: [
                    { type: 'string' },
                    { description: 'Id of the comment that was liked' },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
  public_api: {
    asyncapi: '2.2.0',
    info: {
      title: 'Public API',
      description: 'Public API for others to interact with the system',
      version: '1.0.0',
    },
    servers: {
      mosquitto: {
        url: 'mqtt://test.mosquitto.org',
        protocol: 'mqtt',
        bindings: { mqtt: { clientId: 'public-api' } },
      },
    },
    channels: {
      'comment/liked': {
        description:
          'Others are publishing to you, whenever a comment is liked, for you to do react to such an event.',
        publish: {
          message: {
            description:
              'Message that is being sent when a comment has been liked by someone.',
            payload: {
              type: 'object',
              title: 'commentLikedPayload',
              additionalProperties: false,
              properties: {
                commentId: {
                  allOf: [
                    { type: 'string' },
                    { description: 'Id of the comment that was liked' },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
};
