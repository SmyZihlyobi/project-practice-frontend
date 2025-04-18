import { Operation } from '@apollo/client';

export interface QueuedGraphQLRequest {
  id: string;
  operation: Operation;
  timestamp: number;
  expiresAt: number;
  requestKey: string;
  priority: number;
}
