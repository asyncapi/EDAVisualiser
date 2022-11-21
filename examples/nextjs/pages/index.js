import { ApplicationView } from '@asyncapi/edavisualiser';

function App() {
  // Render on the browser only
  if (typeof navigator === 'undefined') return null;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ApplicationView 
        application={
          {
            id: "string",
            defaultContentType: "string",
            description: "string",
            title: "string",
            version: "string",
            license: {
              name: 'string',
              url: 'string',
            },
            externalDocs: "string",
            servers: [
              {
                name: 'string',
                url: 'string',
                description: 'string',
                protocol: 'string',
                protocolVersion: 'string',
              },
            ],
          }
        }
        incomingOperations={[
          {
            channel: "Test/test/",
            description: "Test description",
            id: "testid",
            messages: [{ title: 'test' }],
            forApplication: 'string',
          }
        ]}
        outgoingOperations={[
          {
            channel: "Test/test/test",
            description: "Test description",
            id: "testid2",
            messages: [{ title: 'test' }],
            forApplication: 'string',
          }
        ]}
      />
    </div>
  );
}

export default App;
