import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_BACKEND_URL,
  }),
});
