import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Markdown } from '../Markdown';
import { ExternalApplicationNodeProps } from '../../types';

export const ExternalApplicationNode: React.FunctionComponent<ExternalApplicationNodeProps> = ({
  data: {
    description,
    title,
    version,
    license,
    externalDocs,
    defaultContentType,
    side,
    topExtended,
  },
}) => {
  return (
    <div className="bg-gray-300 shadow sm:rounded-lg border-2 border-white flex">
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      {side === 'incoming' && (
        <div className="flex justify-center items-center border-r border-gray-200">
          <span className="block transform -rotate-90 uppercase text-green-500 w-full font-bold tracking-widest px-2 ">
            In
          </span>
        </div>
      )}

      <div>
        <div className="px-4 py-5 sm:px-6">
          {topExtended !== undefined && topExtended}
          <div className="flex justify-between mb-4">
            <span className="block leading-6 text-gray-900 uppercase text-xs font-light">
              application
            </span>
          </div>

          <div className="flex space-x-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h3>
            <span className="block leading-6 px-1.5  rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              v{version}
            </span>
          </div>
          {description && (
            <div className="mt-2 text-sm text-gray-500 max-w-xl">
              <Markdown>{description}</Markdown>
            </div>
          )}
          {defaultContentType && (
            <p className="mt-5 text-xs text-gray-500 ">
              Default ContentType:{' '}
              <span className="bg-gray-100 text-gray-500 py-0.5 px-0.5 rounded-md">
                {defaultContentType}
              </span>
            </p>
          )}
        </div>

        <div className="text-right text-xs mt-10 space-y-2 italic py-5 sm:px-6">
          {externalDocs && (
            <a
              href={externalDocs}
              target="_blank"
              className="underline  text-blue-400"
              rel="noreferrer"
            >
              {externalDocs}
            </a>
          )}
          {license && (
            <a
              href={license.url}
              target="_blank"
              className="block text-gray-400 underline"
              rel="noreferrer"
            >
              License: {license.name}
            </a>
          )}
        </div>
      </div>
      {side === 'outgoing' && (
        <div className="flex justify-center items-center border-l border-gray-2">
          <span className="block transform -rotate-90 uppercase text-yellow-500 w-full font-bold tracking-widest">
            Out
          </span>
        </div>
      )}

      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};

export default ExternalApplicationNode;
