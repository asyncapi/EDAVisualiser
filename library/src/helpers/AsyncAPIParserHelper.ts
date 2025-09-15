import {
  ParseOptions,
  ParseOutput,
  ValidateOptions,
  Input,
  Diagnostic,
  AsyncAPIDocumentInterface,
} from '@asyncapi/parser';
import AsyncAPIParser from '@asyncapi/parser/browser';
import { AsyncapiApplicationData } from '../types';

/**
 * Functionality taken from the AsyncAPI parser
 */

export interface FromResult {
  parse: (options?: ParseOptions) => Promise<ParseOutput>;
  validate: (options?: ValidateOptions) => Promise<Diagnostic[]>;
}

export function fromURL(
  parser: any,
  source: string,
  options?: RequestInit,
): FromResult {
  async function fetchUrl(): Promise<Input> {
    const fetchFn = await getFetch();
    return (await fetchFn(source, options as any)).text();
  }
  return {
    async parse(options: ParseOptions = {}) {
      const schema = await fetchUrl();
      return parser.parse(schema, { ...options, source });
    },
    async validate(options: ValidateOptions = {}) {
      const schema = await fetchUrl();
      return parser.validate(schema, { ...options, source });
    },
  };
}
export async function getDocument({
  document,
  documentUrl,
  rawDocument,
}: AsyncapiApplicationData): Promise<AsyncAPIDocumentInterface> {
  if (document) {
    return Promise.resolve(document);
  }
  let output: ParseOutput | undefined;
  const parserOptions = { ruleset: {} };
  const parser = new (AsyncAPIParser as any).Parser(parserOptions);
  if (documentUrl) {
    output = await fromURL(parser, documentUrl).parse();
  }
  if (rawDocument) {
    output = await parser.parse(rawDocument);
  }
  if (!output) {
    return Promise.reject('Could not resolve document');
  }
  if (output.document === undefined) {
    return Promise.reject(output.diagnostics);
  }
  return Promise.resolve(output.document);
}

let __fetchFn: typeof fetch | undefined;
async function getFetch(): Promise<typeof fetch> {
  if (__fetchFn) {
    return __fetchFn;
  }

  if (typeof fetch === 'undefined') {
    return (__fetchFn = ((await import('node-fetch'))
      .default as unknown) as typeof fetch);
  }
  return (__fetchFn = fetch);
}
