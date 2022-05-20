import {
  Application,
  Outgoing,
  Incoming,
  SystemView,
} from '@lagoni/edavisualiser';
import '@lagoni/edavisualiser/styles/default.css';
import './simple.css';

function App() {
  return (
    <div className="App">
      <SystemView>
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
            channel="Test/test/test"
            description="Test description"
            id="testid2"
            messages={[{ title: 'test' }]}
          />
          <Incoming
            channel="Test/test/"
            description="Test description"
            id="testid"
            messages={[{ title: 'test' }]}
          />
        </Application>

        <Application
          id="string2"
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
          <Incoming
            channel="Test/test/test"
            description="Test description"
            id="testid2"
            messages={[{ title: 'test' }]}
          />
          <Outgoing
            channel="Test/test/"
            description="Test description"
            id="testid"
            messages={[{ title: 'test' }]}
          />
        </Application>
      </SystemView>
    </div>
  );
}

export default App;
