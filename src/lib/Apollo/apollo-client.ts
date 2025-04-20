'use client';

import { ApolloClient, InMemoryCache, from, HttpLink, ApolloLink } from '@apollo/client';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '../constant';
import { toast } from 'sonner';
import { onError } from '@apollo/client/link/error';
import { navigateToLogin } from '../utils';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_BACKEND_URL + '/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = Cookies.get(JWT_COOKIE_NAME);
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  console.log('Apollo error:', {
    operation: operation.operationName,
    graphQLErrors,
    networkError,
  });

  if (graphQLErrors) {
    graphQLErrors.forEach(error => {
      const { message, extensions } = error;
      const errorCode = extensions?.code || '';

      const isAuthError =
        errorCode === 'UNAUTHENTICATED' ||
        errorCode === 'UNAUTHORIZED' ||
        message.includes('Unauthenticated') ||
        message.includes('Unauthorized') ||
        message.includes('401') ||
        message.includes('403') ||
        message.includes('Invalid token') ||
        message.includes('Authentication failed');

      if (isAuthError) {
        toast.error('У тебя здесь нет власти! 😈');
        navigateToLogin();
      }

      if (message.includes('NetworkError')) {
        throw error;
      }
    });
  }

  if (networkError && 'statusCode' in networkError) {
    if (networkError.statusCode === 401 || networkError.statusCode === 403) {
      toast.error('У тебя здесь нет власти! 😈');
      navigateToLogin();
    }
  }
});

const link = from([authLink, errorLink, httpLink]);

export const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});
