import { ApplicationView, Application, Outgoing } from '@lagoni/edavisualiser';
import '@lagoni/edavisualiser/styles/default.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <ApplicationView>
        <Application
          id="string"
          defaultContentType="string"
          description="string"
          title="string"
          version="string"
          license={{
            name: 'string',
            url: 'string',
          }}
          externalDocs="string"
          servers={[
            {
              name: 'string',
              url: 'string',
              description: 'string',
              protocol: 'string',
              protocolVersion: 'string',
            },
          ]}
        >
          <Outgoing
            channel="Test/test/"
            description="Test description"
            id="testid"
            messages={[{ title: 'test' }]}
          ></Outgoing>
        </Application>
      </ApplicationView>
    </div>
  );
}

export default App;
