'use client';
import { apolloClient } from './apollo-client';
import { ApolloProvider } from '@apollo/client';

export const ApolloWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
