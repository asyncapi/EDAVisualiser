import { mount } from 'enzyme';
import { ApplicationView, Application } from '../..';
test('Link changes the class when hovered', () => {
  const component = mount(
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
      ></Application>
    </ApplicationView>,
  );
  expect(component.getElements()).toMatchSnapshot();
});
