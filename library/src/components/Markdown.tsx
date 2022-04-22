import React from 'react';

export const Markdown: React.FunctionComponent = ({ children }) => {
  if (!children) {
    return null;
  }
  if (typeof children !== 'string') {
    return <>{children}</>;
  }

  return <div className="prose max-w-none text-sm">children</div>;
};
