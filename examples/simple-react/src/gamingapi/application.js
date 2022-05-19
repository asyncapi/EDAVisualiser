import React, { useState, useEffect } from 'react';
import {
  ApplicationView,
  AsyncAPIApplication,
  SystemView,
} from '@lagoni/edavisualiser';
import '@lagoni/edavisualiser/styles/default.css';
import '../App.css';
import '@asyncapi/parser/dist/bundle';
import { useParams } from 'react-router-dom';
import { apps } from './apps';

const parser = window['AsyncAPIParser'];
function Asyncapi() {
  let { application } = useParams();
  const [asyncapiDocument, setAsyncapiDocument] = useState(undefined);

  useEffect(() => {
    // declare the async data fetching function
    const fetchData = async () => {
      const appLink = apps[application];
      if (appLink !== undefined) {
        const doc = await parser.parseFromUrl(appLink);
        setAsyncapiDocument(doc);
      }
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);
  let something;
  if (asyncapiDocument !== undefined) {
    something = (
      <ApplicationView>
        <AsyncAPIApplication document={asyncapiDocument} />
      </ApplicationView>
    );
  } else {
    something = <h1>Not loaded</h1>;
  }
  return <div className="App">{something}</div>;
}

export default Asyncapi;
