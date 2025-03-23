import { Roles } from '../constant/roles';
import { DefaultAuthFallbackProps } from './types';

export const DefaultAuthFallback = (props: DefaultAuthFallbackProps) => {
  const { requiredRole } = props;

  const getRoleText = (role: Roles): string => {
    switch (role) {
      case Roles.Admin:
        return 'администратор';
      case Roles.Student:
        return 'студент';
      case Roles.Company:
        return 'компания';
      default:
        return 'администратор';
    }
  };

  const requiredRoleText = (): string => {
    if (Array.isArray(requiredRole)) {
      return requiredRole.map(role => getRoleText(role)).join(', ');
    }

    return getRoleText(requiredRole);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Доступ запрещен</h2>
        <p>
          Для доступа к этой странице необходимо авторизоваться как {requiredRoleText()}
        </p>
      </div>
    </div>
  );
};
