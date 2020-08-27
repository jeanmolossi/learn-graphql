import 'dotenv/config';
import express, { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { buildSchemaSync, BuildSchemaOptions } from 'type-graphql';

import '@database/connection';

import { DefaultResolver } from '@shared/infra/graphql/resolvers';
import Routes from '@shared/infra/http/routes';

interface ApiOptions {
  url: string;
  port: number | 3333;
}

class Server {
  private app: Express;

  private apiOptions: ApiOptions;

  private schema: GraphQLSchema = buildSchemaSync({
    resolvers: [DefaultResolver],
  });

  constructor(options?: BuildSchemaOptions, api?: ApiOptions) {
    if (options)
      this.schema = buildSchemaSync({
        ...options,
      });

    this.apiOptions = {
      url: '/api/v1',
      port: Number(process.env.PORT || 3333),
      ...api,
    };

    return this;
  }

  middlewares() {
    this.app.use(
      this.apiOptions.url,
      graphqlHTTP({
        schema: this.schema,
        graphiql: true,
      })
    );

    this.app.use(express.json());
  }

  routes() {
    this.app.use(Routes);
  }

  run() {
    this.app = express();

    this.middlewares();
    this.routes();

    this.app.listen(this.apiOptions.port, () => {
      console.log(`\n\n🚀 >> Server started at: ${this.apiOptions.port}`);
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `Try: http://localhost:${this.apiOptions.port}${this.apiOptions.url}?query=%7B%0A%20%20hello%0A%7D%0A`
        );
      }
    });
  }
}

const app = new Server();
app.run();
