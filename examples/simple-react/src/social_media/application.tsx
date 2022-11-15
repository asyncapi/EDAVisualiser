import { useState, useEffect } from 'react';
import { Menu } from './menu';
import { useParams } from 'react-router-dom';
import { ApplicationFocusView } from '@asyncapi/edavisualiser';
import { apps } from './apps';
import '@asyncapi/parser/dist/bundle';

import '@asyncapi/edavisualiser/styles/default.css';

function Asyncapi() {
  const [externalApplications, setAsyncapiDocuments] = useState<Array<{ parsedDoc: any, name: string }>>([]);
  const [focusedApplication, setFocusedApplication] = useState<{ parsedDoc: any, name: string }>();
  let { application } = useParams<{ application: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      const parser = (window as any)['AsyncAPIParser'];
      for (const [name, asyncapi] of Object.entries(apps)) {
        if (application === name) {
          const parsedDoc = await parser.parse(asyncapi);
          setFocusedApplication({ parsedDoc, name });
        } else {
          const parsedDoc = await parser.parse(asyncapi);
          data.push({ parsedDoc, name });
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
        sideMenu={() => <Menu/> as any}
        asyncapi={{ document: focusedApplication.parsedDoc }}
        external={externalApplications.map(({ parsedDoc, name }) => {
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
