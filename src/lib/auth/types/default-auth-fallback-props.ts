import { Roles } from '@/lib/constant/roles';

export interface DefaultAuthFallbackProps {
  requiredRole: Roles | Roles[];
}
