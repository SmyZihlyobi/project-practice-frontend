'use client';

import { Star } from 'lucide-react';
import { FavoriteToggleProps } from '../types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/use-auth';
import { observer } from 'mobx-react-lite';
import { Roles } from '@/lib/constant/roles';
import { isArray } from '@apollo/client/utilities';
import { useProjectStore } from '@/store';

export const FavoriteToggle = observer((props: FavoriteToggleProps) => {
  const { projectId } = props;

  const { user } = useAuth();

  const projectStore = useProjectStore;
  const { isFavoriteProject } = projectStore;
  const isThisFavoriteProject = isFavoriteProject(projectId);

  if (!user) {
    return null;
  }

  if (isArray(user.roles)) {
    if (!user.roles.includes(Roles.Student)) {
      return null;
    }
  } else {
    if (user.roles !== Roles.Student) {
      return null;
    }
  }

  const favoriteToggleHandler = () => {
    if (isThisFavoriteProject) {
      projectStore.setUnfavoriteProject(projectId, user.id);
      return;
    }
    projectStore.setFavoriteProject(projectId, user.id);
  };

  return (
    <Button
      variant="ghost"
      className="flex items-start pt-1"
      onClick={favoriteToggleHandler}
    >
      <Star
        className={
          isThisFavoriteProject ? 'text-amber-400 fill-amber-400' : 'text-current'
        }
        fill={isThisFavoriteProject ? 'currentColor' : 'none'}
      />
    </Button>
  );
});
