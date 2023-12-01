import express, { Express } from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './datasource.config';
import { bookTypeDefs, bookResolvers } from './src/resolvers';
import cors from 'cors';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const startServer = async () => {

  const server = new ApolloServer({
    typeDefs: [bookTypeDefs], resolvers: [bookResolvers],
});

  await server.start();
  app.use(cors(), bodyParser.json(), expressMiddleware(server, {
    context: async ({ res }) => {
      return res;
    },
  }));

  app.listen(port, () => {
    AppDataSource.initialize()
      .then(() => {
        console.log("Config successfully");
      })
      .catch((error) => console.log(error));
  });
};

startServer();

