import { IncomingNodeData, OutgoingNodeData } from '../../types';

export const getUniqueConnectionId = (
  node: OutgoingNodeData | IncomingNodeData,
) => {
  return node.channel;
};
