[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
![Maintenance score](https://img.shields.io/npms-io/maintenance-score/@asyncapi/modelina)
[![Npm latest version](https://img.shields.io/npm/v/@lagoni/edavisualiser)](https://www.npmjs.com/package/@lagoni/edavisualiser)
[![License](https://img.shields.io/github/license/jonaslagoni/EDAVisualiser)](https://github.com/asyncapi/modelina/blob/master/LICENSE)
[![last commit](https://img.shields.io/github/last-commit/jonaslagoni/EDAVisualiser)](https://github.com/asyncapi/modelina/commits/master)
[![Playground](https://img.shields.io/website?label=playground&url=https%3A%2F%2Fjonaslagoni.github.io%2FEDAVisualiser)](https://jonaslagoni.github.io/EDAVisualiser) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

---

## :loudspeaker: ATTENTION:

This package is still under development and has not reached version 1.0.0 yet. This means that its API may contain breaking changes until we're able to deploy the first stable version and begin semantic versioning. Please use tests to ensure expected outputs or to hardcode the version.

https://user-images.githubusercontent.com/13396189/169362612-0b6129b6-09b6-4807-aff9-8b545bcbc5dc.mp4

---

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [:loudspeaker: ATTENTION:](#loudspeaker-attention)
- [EDAVisualiser](#edavisualiser)
- [Inputs](#inputs)
- [Views](#views)
- [Installation](#installation)
- [Contributors ✨](#contributors-)

<!-- tocstop -->

## EDAVisualiser
EDAVisualiser is a visualization library to show various views revolving around your application. An Application is seen something that communicate with others through incoming and outgoing connections. This is what makes up the foundation for the views.  

It is written in React, however, it also supports the most used frameworks such as [Vue](./examples/vue/) and [Angular](./examples/angular/), check out the [examples](./examples/) for concrete code examples.

## Inputs
The library uses a domain driven approach, meaning we don't assume one or the other input but build on top of a domain model that is specific for this problem we are trying to solve.

| Input | Example | Description|
|:---:|:---:|:---:|
| [**AsyncAPI**](asyncapi.com/) | <a href="https://jonaslagoni.github.io/EDAVisualiser/asyncapi">Preview</a>, <a href="https://github.com/jonaslagoni/EDAVisualiser/blob/main/examples/simple-react/src/SimpleAsyncapi.tsx">code</a> | *Allows you to reuse pre-parsed AsyncAPI documents from the [official AsyncAPI parser](github.com/asyncapi/parser-js), underneath it splits up the AsyncAPI document into the core building blocks.* |
| **Core building blocks** | <a href="https://jonaslagoni.github.io/EDAVisualiser/asyncapi">Preview</a>, <a href="https://github.com/jonaslagoni/EDAVisualiser/blob/main/examples/simple-react/src/SimpleApp.tsx">code</a> | *The core building blocks that is the domain abstraction for inputs, is what any other input type is converted to.* |


## Views

A view could for example be how a ["system" of applications are related](https://jonaslagoni.github.io/EDAVisualiser/social-media), [how a single application relate to others](https://jonaslagoni.github.io/EDAVisualiser/social-media/application/notification_service), only the fantasy sets the limitations, and [feel free to propose new ideas](https://github.com/jonaslagoni/EDAVisualiser/issues/new)!

| View | Example | Description|
|:---:|:---:|:---:|
| **ApplicationFocusView** | <a href="https://jonaslagoni.github.io/EDAVisualiser/social-media/application/notification_service"><img src="./docs/img/applicationFocusView.png" /></a> | *Puts a single application in focus as part of a larger system. Used to figure out who are "connected" to the application* |
| **ApplicationView** | <a href="https://jonaslagoni.github.io/EDAVisualiser/"><img src="./docs/img/applicationView.png" /></a> | *Puts a single application is focus.* |
| **SystemView** | <a href="https://jonaslagoni.github.io/EDAVisualiser/social-media"><img src="./docs/img/systemView.png" /></a> | *Puts the system/collection of application in focus to figure out how they are all connected.* |

## Installation

Run this command to install the visualiser in your project:

```bash
npm install @lagoni/edavisualiser
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/jonaslagoni"><img src="https://avatars.githubusercontent.com/u/13396189?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonas Lagoni</b></sub></a><br /><a href="https://github.com/jonaslagoni/EDAVisualiser/commits?author=jonaslagoni" title="Code">💻</a> <a href="#ideas-jonaslagoni" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-jonaslagoni" title="Maintenance">🚧</a> <a href="https://github.com/jonaslagoni/EDAVisualiser/commits?author=jonaslagoni" title="Documentation">📖</a> <a href="#example-jonaslagoni" title="Examples">💡</a></td>
    <td align="center"><a href="https://github.com/magicmatatjahu"><img src="https://avatars.githubusercontent.com/u/20404945?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maciej Urbańczyk</b></sub></a><br /><a href="https://github.com/jonaslagoni/EDAVisualiser/commits?author=magicmatatjahu" title="Code">💻</a> <a href="#ideas-magicmatatjahu" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-magicmatatjahu" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://boyney.io/"><img src="https://avatars.githubusercontent.com/u/3268013?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Boyne</b></sub></a><br /><a href="https://github.com/jonaslagoni/EDAVisualiser/commits?author=boyney123" title="Code">💻</a> <a href="#ideas-boyney123" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

Special thanks to [@magicmatatjahu](https://github.com/magicmatatjahu) for the react setup that allows the library to be offered to all frontend frameworks, and to [boyney123](https://github.com/boyney123) for the initial visualization code that [first appeared in the AsyncAPI studio](https://github.com/asyncapi/studio/issues/261).