<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div style="width: 100vw;height: 100vh;" ref="asyncapi"></div>
</template>

<script>
import StandaloneRenderer from '@lagoni/edavisualiser/browser/standalone'
const props = {
  application: {
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
  },
  incomingOperations:[
    {
      channel: "Test/test/",
      description: "Test description",
      id: "testid",
      messages: [{ title: 'test' }],
      forApplication: 'string',
    }
  ],
  outgoingOperations:[
    {
      channel: "Test/test/test",
      description: "Test description",
      id: "testid2",
      messages: [{ title: 'test' }],
      forApplication: 'string',
    }
  ]
};
export default {
  name: 'App',
  mounted() {
    const container = this.$refs.asyncapi;
    StandaloneRenderer.renderApplicationView({ ...props }, container);
  }
}
</script>

<style scope src="@/assets/edavisualiser.min.css"></style>
