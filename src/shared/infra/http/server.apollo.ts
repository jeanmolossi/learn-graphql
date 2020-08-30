import 'dotenv/config';
import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import { buildSchemaSync } from 'type-graphql';
import { RedisCache } from 'apollo-server-cache-redis';
import { Container, Inject } from 'typedi';
import { useContainer } from 'typeorm';
import Redis, { Redis as RedisServerType } from 'ioredis';

import '@database/connection';

import { DefaultResolver } from '@shared/infra/graphql/resolvers';
import { UserResolver } from '@modules/users/infra/graphql/resolvers';
import { PostsResolver } from '@modules/posts/infra/graphql/resolvers';

import Routes from '@shared/infra/http/routes';
import CacheProvider from '../providers/CacheProvider';

interface ApiOptions {
  url: string;
  port: number | 3333;
  apolloConfig: ApolloServerExpressConfig;
}

export interface MyContext {
  request: Request;
  response: Response;
}

class Server {
  public app: Express;

  public apolloServer: ApolloServer;

  private apiOptions: ApiOptions = {
    url: '/api/v1',
    port: Number(process.env.PORT || 3333),
    apolloConfig: {} as ApolloServerExpressConfig,
  };

  constructor(options?: ApiOptions) {
    useContainer(Container);

    this.apolloServer = new ApolloServer({
      schema: buildSchemaSync({
        resolvers: [UserResolver, PostsResolver],
        container: Container,
      }),
      context: ({ req, res }): MyContext => {
        return {
          request: req,
          response: res,
        };
      },
      ...options?.apolloConfig,
    });

    return this;
  }

  middlewares() {
    this.apolloServer.applyMiddleware({ app: this.app });

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
          `Try: http://localhost:${this.apiOptions.port}${this.apolloServer.graphqlPath}?query=%7B%0A%20%20hello%0A%7D%0A`
        );
      }
    });
  }
}

const app = new Server();
app.run();
