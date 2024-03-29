# CloudStack Primate

A modern role-based progressive CloudStack UI based on VueJS and Ant Design.

![Primate Screenshot](docs/screenshot-dashboard.png)

## Env and dependencies

- node
- webpack
- eslint
- @vue/cli ~3

Install tools and dependencies:

    sudo apt-get install npm
    sudo npm i -g npm@next
    sudo npm i -g npm-check-updates
    ncu -u # optional: upgrade dependencies
    npm install

## Developing against CloudStack Env

Override the default `API_URL` to a running CloudStack management server:

    cp .env.local.example .env.local
    Change the `API_URL` in the `.env.local` file

Build and run:

    npm start
    or
    npm run serve

Production Build:

    npm run build

Upgrade dependencies:

    ncu -u

Run Tests:

    npm run test
    npm run lint
    npm run test:unit

Fix issues and vulnerabilities:

    npm audit

### Customisation

- Theme:  `vue.config.js`
eg: 
```ecmascript 6
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* Less variables, required modifyVars*/

          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
```

### Attributions

- [VueJS](https://vuejs.org/)
- [Ant Design Spec](https://ant.design/docs/spec/introduce)
- [Ant Design Vue](https://vue.ant.design/)
- [Ant Design Pro Vue](https://github.com/sendya/ant-design-pro-vue) template
- [Fontawesome](https://github.com/FortAwesome/vue-fontawesome)
- [ViserJS](https://viserjs.github.io/docs.html#/viser/guide/installation)
- [Icons](https://www.iconfinder.com/iconsets/cat-force) by [Iconka](https://iconka.com/en/downloads/cat-power/)

### History

The project was created by [Rohit Yadav](rohityadav.cloud) over several weekends
during late 2018 and early 2019. During ApacheCon CCCUS19, on 9th September
2019, Primate was introduced and demoed as part of the talk [Modern UI for
CloudStack](https://rohityadav.cloud/files/talks/cccna19-primate.pdf)
([video](https://www.youtube.com/watch?v=F2KwZhechzs)).

### License

Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
