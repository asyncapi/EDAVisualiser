import React, { useState, useEffect } from 'react';
import { AsyncAPIApplication, SystemView } from '@lagoni/edavisualiser';
import '@lagoni/edavisualiser/styles/default.css';
import '../App.css';
import '@asyncapi/parser/dist/bundle';
import { apps } from './apps';
const parser = window['AsyncAPIParser'];

function Asyncapi() {
  const [asyncapiDocuments, setAsyncapiDocuments] = useState([]);
  useEffect(() => {
    // declare the async data fetching function
    const fetchData = async () => {
      const data = [];
      for (const [name, asyncapiUrl] of Object.entries(apps)) {
        const parsedDoc = await parser.parse(asyncapiUrl);
        data.push({ parsedDoc, name });
      }
      setAsyncapiDocuments(data);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);
  let something;
  if (asyncapiDocuments.length > 0) {
    something = (
      <SystemView>
        {asyncapiDocuments.map(({ parsedDoc, name }) => {
          return (
            <AsyncAPIApplication
              document={parsedDoc}
              topExtended={
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
              }
            />
          );
        })}
      </SystemView>
    );
  } else {
    something = <h1>Not loaded</h1>;
  }
  return <div className="App">{something}</div>;
}

export default Asyncapi;
