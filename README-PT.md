# Repositório playground - Estudos em GraphQL

Eu fiz este repositorio como um playground, usado por mim mesmo pra aprender como usar GrahQL e eu tentei implementar isso com Typeorm e Expres. Eu gostei do resultado.

# :pushpin: Table of Contents

- [Instalação](#construction_worker-instalação)
- [Primeiros passos](#runner-primeiros-passos)
- [Encountrou um bug? Faltando alguma funcionalidade?](#bug-issues)
- [Contribuindo](#tada-contributing)
- [Licença](#closed_book-license)

# :construction_worker: Instalação

**Você precisa instalar [Node.js](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/), [Docker](https://docs.docker.com/get-docker/) primeiro e então, clonar este repositorio via HTTPS, rode o comando:**

`git clone https://github.com/jeanmolossi/learn-graphql.git`

**Instale as dependencias**

`yarn install`

**Instale a API**

`yarn typeorm migration:run`

**Instale o Container de Cache com Redis**

`yarn docker:install`

# :runner: Primeiros passos

Rode o seguinte comando **na pasta raiz do projeto** em ordem, para initalizar a applicação em ambiente de desenvolvimento:

`yarn docker:up`

E então:

```
  // Run server API
  yarn start
```

## :open_file_folder: Visualização da estrutura de pastas

```
src/
  @types/
    index.d.ts
  database/
    migrations/
    connection.ts
    database.sqlite
  modules/
    module_name/
      infra/
        repositories/
  shared/
    infra/
      http/
        server.ts
      graphql/
        entities/
        inputs/
        resolvers/
          helloworld.ts
          index.ts
      typeorm/
        entities/
        repositories/
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

### :man_teacher: Explicando estrutura de pastas

- `@types/` Tem o arquivo principal de definição de tipos. Esse adiciona o User a estrutura de request do Express.
- `shared/` São as pastas com o conteúdo que será compartilhado entre toda a aplicação.

  - Dentro de `shared/` temos `infra/http/`. É a pasta com os arquivos responsáveis pela camada http da aplicação
  - `infra/graphql/`. A camada referente ao GraphQL, todos as dependencias relacionadas ao GraphQL devem estar dentro desta pasta

    - Dentro de `graphql/`
      - `entities/` as Entidades GraphQL da aplicação - **Cada uma cria uma interface para as Entidades no Typeorm**;
      - `inputs/` São os objetos de Input do GraphQL para realização das querys;
      - `resolvers/` são os endpoints do GraphQL;

  - Dentro de `infra/typeorm/` são os repositorios e as entidades da aplicação:
    - `entities/` Entidades do Typeorm da aplicação - **Essas entidades devem implementas as entidades do GraphQL**;
    - `repositories/` Repositorios do Typeorm. Estes devem implementar os módulos dentro de `modules/{ module_name }/infra/repositories/`

- `modules/` são as pastas responsáveis por cada módulo específico da aplicação.
  - Dentro de cada módulo possuimos um módulo específico como `users/` que contém:
    - `infra/` que contém:
      - `repositories/`. Aqui estão contidos os modelos de repositórios que implementamos dentro de `shared/infra/typeorm/repositories/`

# :bug: Issues

Feel free to **file a new issue** with a respective title and description on the the [Gympoint Mobile](https://github.com/jeanmolossi/learn-graphql/issues) repository. If you already found a solution to your problem, **i would love to review your pull request**! Have a look at our [contribution guidelines](https://github.com/jeanmolossi/learn-graphql/blob/master/CONTRIBUTING.md) to find out about the coding standards.

# :closed_book: License

Released in 2020.
This project is under the [MIT license](https://github.com/jeanmolossi/learn-graphql/master/LICENSE).

Made by [Jean Molossi](https://github.com/jeanmolossi) 🚀
