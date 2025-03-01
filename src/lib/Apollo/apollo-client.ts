import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '../constant';

const httpLink = new HttpLink({ uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql` });

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = Cookies.get(JWT_COOKIE_NAME);

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link: concat(authMiddleware, httpLink),
});
