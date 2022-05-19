import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SystemView from './SystemView';
import GamingapiSystem from './gamingapi/system';
import GamingapiApplication from './gamingapi/application';
import SocialMediaSystem from './social_media/system';
import SocialMediaApplication from './social_media/application';
import Asyncapi from './Asyncapi';
import { Route, BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route exact path="/">
        <App />
      </Route>
      <Route exact path="/system">
        <SystemView />
      </Route>
      <Route exact path="/asyncapi">
        <Asyncapi />
      </Route>
      <Route exact path="/gamingapi/system">
        <GamingapiSystem />
      </Route>
      <Route exact path="/gamingapi/application/:application">
        <GamingapiApplication />
      </Route>
      <Route exact path="/social-media/system">
        <SocialMediaSystem />
      </Route>
      <Route exact path="/social-media/application/:application">
        <SocialMediaApplication />
      </Route>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
