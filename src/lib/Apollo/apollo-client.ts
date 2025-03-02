import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '../constant';
import { loginPageMigration } from '../utils';

const httpLink = new HttpLink({ uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql` });

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = Cookies.get(JWT_COOKIE_NAME);

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    connectToDevTools: false,
  });

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (
        err.extensions?.code === 'UNAUTHENTICATED' ||
        err.extensions?.code === 'FORBIDDEN' ||
        err.message.includes('401') ||
        err.message.includes('Unauthorized')
      ) {
        Cookies.remove(JWT_COOKIE_NAME);
        loginPageMigration();

        return new Observable(observer => {
          observer.complete();
        });
      }
    }
  }

  if (networkError && 'statusCode' in networkError && networkError.statusCode === 401) {
    Cookies.remove(JWT_COOKIE_NAME);

    loginPageMigration();

    return new Observable(observer => {
      observer.complete();
    });
  }
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link: ApolloLink.from([errorLink, authMiddleware, httpLink]),
});
