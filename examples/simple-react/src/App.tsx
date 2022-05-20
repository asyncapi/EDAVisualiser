import * as React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Simple from './simple';
import SimpleSystem from './simpleSystem';
import GamingapiSystem from './gamingapi';
import GamingapiApplication from './gamingapi/application';
import SocialMediaSystem from './social_media';
import SocialMediaApplication from './social_media/application';
import Asyncapi from './asyncapi';
export const App = () => {
  return (
    <div>
      <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '18px',
        }}>
        <h1>EDAVisualiser example playground</h1>
        <div style={{display:"inline-block", float: "right"}}>
          <div style={{display:"block", float: "right", margin: "0 10px"}}>
            <Link to="/">Simple application</Link>
          </div>
          <div style={{display:"block", float: "right", margin: "0 10px"}}>
            <Link to="/system">Simple system</Link>
          </div>
          <div style={{display:"block", float: "right", margin: "0 10px"}}>
            <Link to="/asyncapi">Simple AsyncAPI</Link>
          </div>
          <div style={{display:"block", float: "right", margin: "0 10px"}}>
            <Link to="/social-media">Social media example</Link>
          </div>
          <div style={{display:"block", float: "right", margin: "0 10px"}}>
            <Link to="/gamingapi">GamingAPI example</Link>
          </div>
        </div>
      </header>

      <Switch>
        <Route exact path="/">
          <Simple />
        </Route>
        <Route exact path="/system">
          <SimpleSystem />
        </Route>
        <Route exact path="/asyncapi">
          <Asyncapi />
        </Route>
        <Route exact path="/gamingapi/">
          <GamingapiSystem />
        </Route>
        <Route exact path="/gamingapi/application/:application">
          <GamingapiApplication />
        </Route>
        <Route exact path="/social-media/">
          <SocialMediaSystem />
        </Route>
        <Route exact path="/social-media/application/:application">
          <SocialMediaApplication />
        </Route>
      </Switch>
    </div>
  );
};