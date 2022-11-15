import { Component, ElementRef, OnDestroy, AfterViewInit, } from '@angular/core';
import StandaloneRenderer from "@asyncapi/edavisualiser/browser/standalone";

@Component({
  selector: 'app-root',
  template: `
    <div style="width:100vw;height:100vh;" id="asyncapi-doc"></div>
  `,
  styleUrls: ['../../node_modules/@asyncapi/edavisualiser/styles/default.min.css']
}) 
export class ApplicationViewComponent implements OnDestroy, AfterViewInit {
  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
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
    const container = this.element.nativeElement.querySelector('#asyncapi-doc');
    StandaloneRenderer.renderApplicationView(props, container);
  }

  ngOnDestroy(): void {
    this.element.nativeElement.querySelector('#asyncapi-doc').remove();
  }
}