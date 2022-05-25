import { useState, useEffect } from 'react';
import { SystemView } from '@lagoni/edavisualiser';
import { apps } from './apps';
import '@asyncapi/parser/dist/bundle';

import '@lagoni/edavisualiser/styles/default.css';

function Asyncapi() {
  const [asyncapiDocuments, setAsyncapiDocuments] = useState<Array<{ parsedDoc: any, name: string }>>([]);

  useEffect(() => {
    const parser = (window as any)['AsyncAPIParser'];
    const fetchData = async () => {
      const data = [];
      for (const [name, asyncapiUrl] of Object.entries(apps)) {
        const parsedDoc = await parser.parseFromUrl(asyncapiUrl);
        data.push({ parsedDoc, name });
      }
      setAsyncapiDocuments(data);
    };

    fetchData().catch(console.error);
  }, []);

  let node;
  if (asyncapiDocuments.length > 0) {
    node = (
      <SystemView 
        applications={asyncapiDocuments.map(({ parsedDoc, name }) => {
          return {
            asyncapi: {
              document: parsedDoc,
              topExtended: (
                <div className="flex justify-between mb-4">
                  <a
                    className="leading-6 text-gray-900 uppercase text-xs font-light"
                    href={'/social-media/application/' + name}
                  >
                    <button
                      style={{
                        backgroundColor: 'rgba(110, 231, 183, 1)',
                        padding: '0 10px',
                      }}
                    >
                      Focus application
                    </button>
                  </a>
                </div>
              )
            },
          }
        })}
      />
    );
  } else {
    node = <h1>Wait...</h1>;
  }
  return <div className="App">{node}</div>;
}

export default Asyncapi;
