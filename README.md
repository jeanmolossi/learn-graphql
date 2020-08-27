# Learn a little bit of GraphQL

I made this project like a playground, used to myself learn how to use the GraphQL and i have tryied implements this with Typeorm and express and I like the results.

# :pushpin: Table of Contents

- [Screens](#point_right-screens)
- [Features](#rocket-features)
- [Installation](#construction_worker-installation)
- [Getting Started](#runner-getting-started)
- [Found a bug? Missing a specific feature?](#bug-issues)
- [Contributing](#tada-contributing)
- [License](#closed_book-license)

# :construction_worker: Installation

**You need to install [Node.js](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/) first and then, in order to clone the project via HTTPS, run this command:**

`git clone https://github.com/jeanmolossi/learn-graphql.git`

**Install dependencies**

`yarn install`

**Setup the API**

`yarn typeorm migration:run`

# :runner: Getting Started

Run the following command **on project root folder** in order to start the application in a development environment:

```
  // Run server API
  yarn start
```

## :eyes: Lookup at the structures folder

```
src/
  database/
    migrations/
    connection.ts
    database.sqlite
  modules/
    module_name/
      infra/
        graphql/
          entities/
          inputs/
          resolvers/
        repositories/
        typeorm/
          repositories/
  shared/
    infra/
      http/
        server.ts
      graphql/
        resolvers/
          helloworld.ts
          index.ts
.editorconfig
.env
.gitignore
ormconfig.json
package.json
README.md
tsconfig.json
yarn.lock
LICENSE.md
```

### :man_teacher: Explaining folders

- `shared/` are the folders with the content that will be shared in all application
  - Inside that we have `infra/http/`. That are the http layer of the application
  - We have too `infra/graphql/`. That are the graphql layer, all the contents depends of the graphql should be inside that layer
- `modules/` are the folders/layers from a specific module of the application.
  - Inside that we have the specific module like `users/` that have:
    - `infra/` which contains:
      - `graphql/`. That are the graphql layer, all the contents of a specific module depends of the graphql should be inside that folder
      - `repositories/`. That contains de model of the repositories should be implements
    - Inside `graphql/`
      - `entities/` GraphQL entities from specific module;
      - `inputs/` GraphQL inputs to do the query;
      - `resolvers/` GraphQL resolvers;
    - Inside `typeorm/`
      - `repositories/` Typeorm repositories. That should be implements the models are inside the `/infra/repositories/`

# :bug: Issues

Feel free to **file a new issue** with a respective title and description on the the [Gympoint Mobile](https://github.com/jeanmolossi/learn-graphql/issues) repository. If you already found a solution to your problem, **i would love to review your pull request**! Have a look at our [contribution guidelines](https://github.com/jeanmolossi/learn-graphql/blob/master/CONTRIBUTING.md) to find out about the coding standards.

# :closed_book: License

Released in 2020.
This project is under the [MIT license](https://github.com/jeanmolossi/learn-graphql/master/LICENSE).

Made by [Jean Molossi](https://github.com/jeanmolossi) 🚀
