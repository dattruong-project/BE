import OktaJwtVerifier from "@okta/jwt-verifier";
import { getAllBooks } from "../controllers/book.controller";
import { AuthenticationError, gql } from 'apollo-server-express';

enum AppRole {
    admin = "admin",
    user = "user"
}

const getUserRole = async (token: string): Promise<[string]> => {
    const oktaJwtVerifier = new OktaJwtVerifier({
        issuer: process.env.OKTA_ISSUER!,
        clientId: process.env.OKTA_CLIENT_ID,
    });

    try {
        console.log(token)
        const replaceToken = token.replace('Bearer ', '');
        const decodedToken = await oktaJwtVerifier.verifyAccessToken(replaceToken, "api://default");
        return decodedToken.claims.groups as [string];
    } catch (error) {
        throw new Error('Unauthorized: Unable to decode token.');
    }
};

export const bookTypeDefs = gql`
  type Book {
    id: Int!
    name: String!
  }

  type Query {
    books: [Book!]!
  }
`;

export const bookResolvers = {
    Query: {
        books: async (_: any, __: any, context: any) => {
            try {
                const userRole: [string] = await getUserRole(context.req.headers.authorization || '');
                if (!userRole.some(role => role == AppRole.admin)) {
                    return new AuthenticationError("Not Have Permission");
                }
                const books = await getAllBooks();
                return books;
            } catch (error) {
                return new AuthenticationError("Not Have Permission");
            }
        },
    },
};
