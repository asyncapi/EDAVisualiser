import { marked } from 'marked';
import hljs from 'highlight.js';

const markedOptions: marked.MarkedOptions = {
  langPrefix: 'hljs language-',
  highlight: (code, language) => {
    if (!hljs.getLanguage(language)) {
      return code;
    }
    try {
      return hljs.highlight(code, { language }).value;
    } catch (e) {
      return code;
    }
  },
};

export function renderMarkdown(content: string): string {
  return marked(content, markedOptions);
}

export { hljs };
