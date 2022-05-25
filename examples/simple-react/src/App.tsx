import { Switch, Route, Link } from 'react-router-dom';
import SimpleApp from './SimpleApp';
import SimpleSystem from './SimpleSystem';
import SimpleAsyncapi from './SimpleAsyncapi';
import GamingapiSystem from './gamingapi/System';
import GamingapiApplication from './gamingapi/Application';
import SocialMediaSystem from './social_media/System';
import SocialMediaApplication from './social_media/Application';

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

      <div style={{ position: 'relative' }}>
        <Switch>
          <Route exact path="/">
            <SimpleApp />
          </Route>
          <Route exact path="/system">
            <SimpleSystem />
          </Route>
          <Route exact path="/asyncapi">
            <SimpleAsyncapi />
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
    </div>
  );
};