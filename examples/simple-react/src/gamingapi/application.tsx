import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ApplicationFocusView } from '@asyncapi/edavisualiser';
import { apps } from './apps';
import '@asyncapi/edavisualiser/styles/default.css';
const AsyncapiParser = require('@asyncapi/parser/browser');

function Asyncapi() {
  const [externalApplications, setAsyncapiDocuments] = useState<Array<{ parsedDoc: any, name: string }>>([]);
  const [focusedApplication, setFocusedApplication] = useState<{ parsedDoc: any, name: string }>();
  let { application } = useParams<{ application: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      const parser = new AsyncapiParser.Parser();
      for (const [name, asyncapiUrl] of Object.entries(apps)) {
        if (application === name) {
          const result = AsyncapiParser.fromURL(parser, asyncapiUrl);
          const {document} = await result.parse();
          if(document === undefined) {
            return;
          }
          setFocusedApplication({ parsedDoc: document, name });
        } else {
          const result = AsyncapiParser.fromURL(parser, asyncapiUrl);
          const {document} = await result.parse();
          data.push({ parsedDoc: document, name });
        }
      }
      setAsyncapiDocuments(data);
    };

    fetchData().catch(console.error);
  }, [application]);

  let node;
  if (externalApplications.length > 0 && focusedApplication !== undefined) {
    node = (
      <ApplicationFocusView
        asyncapi={{ document: focusedApplication.parsedDoc }}
        external={externalApplications.map(({ parsedDoc, name }) => {
          return {
            asyncapi: {
              document: parsedDoc,
              topExtended: (<div className="flex justify-between mb-4">
                  <a
                    className="leading-6 text-gray-900 uppercase text-xs font-light"
                    href={'/EDAVisualiser/gamingapi/' + name}
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
                </div>)
            }
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
