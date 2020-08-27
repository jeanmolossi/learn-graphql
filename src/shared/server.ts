import 'dotenv/config';
import express, { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchemaSync } from 'type-graphql';
import { GraphQLSchema } from 'graphql';

import '@database/connection';

class ServerRunner {
  private app: Express;

  private schema: GraphQLSchema;

  constructor(schema = []) {
    this.app = express();

    this.middlewares();

    return this;
  }

  middlewares() {
    this.app.use(express.json());

    this.app.use(
      '/api/v1',
      graphqlHTTP({
        schema: this.schema,
        graphiql: process.env.NODE_ENV === 'development',
      })
    );
  }

  run() {
    this.app.listen(process.env.PORT || 3333, () =>
      console.log(`🚀 >> Server started at: ${process.env.PORT}`)
    );
  }
}

const app = new ServerRunner();
app.run();
