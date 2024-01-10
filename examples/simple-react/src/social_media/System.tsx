import { useState, useEffect } from 'react';
import { SystemView } from '@asyncapi/edavisualiser';
import { Menu } from './menu';
import { apps } from './apps';
import '@asyncapi/edavisualiser/styles/default.css';
const AsyncapiParser = require('@asyncapi/parser/browser');

function Asyncapi() {
  const [asyncapiDocuments, setAsyncapiDocuments] = useState<Array<{ parsedDoc: any, name: string }>>([]);

  useEffect(() => {
    const parser = new AsyncapiParser.Parser();
    const fetchData = async () => {
      const data = [];
      for (const [name, asyncapiUrl] of Object.entries(apps)) {
        const {document} = await parser.parse(asyncapiUrl);
        data.push({ parsedDoc: document, name });
      }
      setAsyncapiDocuments(data);
    };

    fetchData().catch(console.error);
  }, []);

  let node;
  if (asyncapiDocuments.length > 0) {
    node = (
      <SystemView 
        includeControls={true}
        sideMenu={() => <Menu/> as any}
        applications={asyncapiDocuments.map(({ parsedDoc, name }) => {
          return {
            asyncapi: {
              document: parsedDoc,
              topExtended: (
                <div className="flex justify-between mb-4">
                  <a
                    className="leading-6 text-gray-900 uppercase text-xs font-light"
                    href={'/EDAVisualiser/social-media/' + name}
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
