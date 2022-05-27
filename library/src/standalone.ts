import {
  ApplicationFocusView,
  ApplicationFocusViewProps,
} from './visualiser/react-flow-renderer/ApplicationFocusView';
import {
  ApplicationView,
  ApplicationViewProps,
} from './visualiser/react-flow-renderer/ApplicationView';
import {
  SystemView,
  SystemViewProps,
} from './visualiser/react-flow-renderer/SystemView';
import { createRender, createHydrate } from './standalone-codebase';
import { hljs } from './helpers/marked';

/**
 * Standalone is for other frameworks then react, for example Vue, Angular, etc.
 */

export default {
  renderApplicationFocusView: createRender<ApplicationFocusViewProps>(
    ApplicationFocusView,
  ),
  hydrateApplicationFocusView: createHydrate<ApplicationFocusViewProps>(
    ApplicationFocusView,
  ),
  renderApplicationView: createRender<ApplicationViewProps>(ApplicationView),
  hydrateApplicationView: createHydrate<ApplicationViewProps>(ApplicationView),
  renderSystemViewProps: createRender<SystemViewProps>(SystemView),
  hydrateSystemViewProps: createHydrate<SystemViewProps>(SystemView),
  hljs,
};
