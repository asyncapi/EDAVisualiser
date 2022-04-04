import logo from './logo.svg';
import {ApplicationView, Application} from '@lagoni/edavisualiser'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ApplicationView>
          <Application id='string'
          defaultContentType='string'
          description='string'
          title='string'
          version='string'
          license={{
            name:'string',
            url:'string'
          }}
          externalDocs='string'
          servers={[{
              name:'string',
              url:'string',
              description:'string',
              protocol:'string',
              protocolVersion:'string'
          }]}></Application>
        </ApplicationView>
      </header>
    </div>
  );
}

export default App;
