'use client';

import {
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  ApolloLink,
  Operation,
  Observable,
} from '@apollo/client';
import { IndexedDBService } from '../index-db/index-db-service';
import { nanoid } from 'nanoid';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '../constant';
import { toast } from 'sonner';
import { QueuedGraphQLRequest } from './types';

let indexedDb: IndexedDBService | null = null;
let userExpire: number = 0;

export const setApolloIndexDb = (indexDb: IndexedDBService) => {
  indexedDb = indexDb;
};

export const setUserExpire = (expire: number) => {
  userExpire = expire;
};
const generateRequestKey = (operation: Operation): string => {
  return `${operation.operationName}:${JSON.stringify(operation.variables)}`;
};

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

const offlineLink = new ApolloLink((operation, forward) => {
  if (typeof window !== undefined && !navigator.onLine) {
    const { operationName } = operation;

    if (operationName && operationName.startsWith('Mutation')) {
      if (indexedDb) {
        const requestKey = generateRequestKey(operation);

        indexedDb
          .getItemByField<QueuedGraphQLRequest>('requestKey', requestKey)
          .then(existingRequest => {
            if (!indexedDb) return;
            if (existingRequest) {
              return indexedDb.updateItem(existingRequest.id, {
                ...existingRequest,
                timestamp: Date.now(),
                priority: existingRequest.priority + 1,
              });
            } else {
              const requestToSave: QueuedGraphQLRequest = {
                id: nanoid(),
                operation: operation,
                timestamp: Date.now(),
                expiresAt: userExpire,
                requestKey: requestKey,
                priority: 1,
              };
              return indexedDb.addItem(requestToSave);
            }
          });

        return new Observable(observer => {
          observer.next({
            data: { message: 'Request queued offline' },
          });
          observer.complete();
        });
      }
    }

    throw new Error('No internet connection');
  }

  return forward(operation);
});

const errorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    if (response.errors) {
      response.errors.forEach(error => {
        if (error.message === 'Unauthenticated' || error.message === 'Unauthorized') {
          toast.error('У тебя здесь нет власти! 😈');
        }
        if (error.message.includes('NetworkError')) {
          throw error;
        }
      });
    }
    return response;
  });
});

const link = from([offlineLink, authLink, errorLink, httpLink]);

export const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

export const processApolloQueue = async () => {
  if (navigator.onLine && indexedDb) {
    const requests = await indexedDb.getAll<QueuedGraphQLRequest>();

    requests.sort((a, b) => b.priority - a.priority || b.timestamp - a.timestamp);

    for (const request of requests) {
      try {
        await apolloClient.mutate({
          mutation: request.operation.query,
          variables: request.operation.variables,
        });
        await indexedDb.deleteItem(request.id);
      } catch (error) {
        console.error('Failed to process queued request:', error);
      }
    }
  }
};
