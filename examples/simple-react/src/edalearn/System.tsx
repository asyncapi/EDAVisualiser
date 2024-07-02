import { useState, useEffect } from 'react';
import { SystemView, fromURL} from '@asyncapi/edavisualiser';
import { apps } from './apps';
import '@asyncapi/edavisualiser/styles/default.css';
const AsyncapiParser = require('@asyncapi/parser/browser');

function Asyncapi() {
  const [asyncapiDocuments, setAsyncapiDocuments] = useState<Array<{ parsedDoc: any, name: string }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      const parser = new AsyncapiParser.Parser({
        ruleset: { core:false, recommended:false }
        });
      for (const [name, asyncapiUrl] of Object.entries(apps)) {
        const result = fromURL(parser, asyncapiUrl);
        const {document, diagnostics} = await result.parse();
        console.log(diagnostics)
        if(document)
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
        applications={asyncapiDocuments.map(({ parsedDoc, name }) => {
          return {
            asyncapi: {
              document: parsedDoc,
              topExtended: (
                <div className="flex justify-between mb-4">
                  <a
                    className="leading-6 text-gray-900 uppercase text-xs font-light"
                    href={'/EDAVisualiser/edalearn/' + name}
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
