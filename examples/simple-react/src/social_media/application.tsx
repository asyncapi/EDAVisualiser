import React, { useState, useEffect } from 'react';
import {
  ApplicationFocusView,
  AsyncAPIApplication,
} from '@lagoni/edavisualiser';
import '@lagoni/edavisualiser/styles/default.css';
import '../simple.css';
import '@asyncapi/parser/dist/bundle';
import { apps } from './apps';
import { useParams } from 'react-router-dom';
import { Menu } from './menu';

const parser = (window as any)['AsyncAPIParser'];
function Asyncapi() {
  let { application } = useParams<any>();
  const [externalApplications, setAsyncapiDocuments] = useState<any>([]);
  const [focusedApplication, setFocusedApplication] = useState<any>(undefined);

  useEffect(() => {
    // declare the async data fetching function
    const fetchData = async () => {
      const data = [];
      for (const [name, asyncapiUrl] of Object.entries(apps)) {
        if (application === name) {
          const parsedDoc = await parser.parse(asyncapiUrl);
          setFocusedApplication({ parsedDoc, name });
        } else {
          const parsedDoc = await parser.parse(asyncapiUrl);
          data.push({ parsedDoc, name });
        }
      }
      setAsyncapiDocuments(data);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);
  let something;
  if (externalApplications.length > 0 && focusedApplication !== undefined) {
    something = (
      <ApplicationFocusView sideMenu={(Menu as any)}>
        <AsyncAPIApplication key={focusedApplication.parsedDoc.info().title()} document={focusedApplication.parsedDoc} />
        {externalApplications.map(({ parsedDoc, name }: any) => {
          return (
            <AsyncAPIApplication
              key={parsedDoc.info().title()}
              document={parsedDoc}
              topExtended={
                <div className="flex justify-between mb-4">
                  <a
                    className="leading-6 text-gray-900 uppercase text-xs font-light"
                    href={process.env.PUBLIC_URL + '/social-media/application/' + name}
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
      </ApplicationFocusView>
    );
  } else {
    something = <h1>Not loaded</h1>;
  }
  return <div className="App">{something}</div>;
}

export default Asyncapi;
