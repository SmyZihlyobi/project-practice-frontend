'use client';

import { observer } from 'mobx-react-lite';
import { useTeamStore } from '../store/team-store';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export const Filter = observer(() => {
  const teamStore = useTeamStore;

  const handleStudentCountChange = (value: string) => {
    switch (value) {
      case 'less-4-count':
        teamStore.sortByStudentCount(4, false, true);
        break;
      case '4-count':
        teamStore.sortByStudentCount(4, false, false);
        break;
      case '5-count':
        teamStore.sortByStudentCount(5, false, false);
        break;
      case '6-count':
        teamStore.sortByStudentCount(6, false, false);
        break;
      case 'more-6-count':
        teamStore.sortByStudentCount(6, true, false);
        break;
      default:
        teamStore.resetFilters();
        break;
    }
  };

  const handleCourseChange = (value: string) => {
    switch (value) {
      case '1-course':
        teamStore.sortByCourse(1);
        break;
      case '2-course':
        teamStore.sortByCourse(2);
        break;
      default:
        teamStore.resetFilters();
        break;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Фильтры</h2>
      <Card className="p-4">
        <p>Найдено команд: {String(teamStore.currentTeams.length)}</p>
      </Card>

      <Card className="p-4">
        <RadioGroup
          defaultValue="nevermind-count"
          onValueChange={handleStudentCountChange}
        >
          <p className="font-medium">Количество человек в команде</p>
          <div className="space-y-3 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nevermind-count" id="nevermind-count" />
              <Label htmlFor="nevermind-count">Неважно</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="less-4-count" id="less-4-count" />
              <Label htmlFor="less-4-count">Меньше 4</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4-count" id="4-count" />
              <Label htmlFor="4-count">4</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5-count" id="5-count" />
              <Label htmlFor="5-count">5</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="6-count" id="6-count" />
              <Label htmlFor="6-count">6</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="more-6-count" id="more-6-count" />
              <Label htmlFor="more-6-count">Больше 6</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>

      <Card className="p-4">
        <RadioGroup defaultValue="nevermind-course" onValueChange={handleCourseChange}>
          <p className="font-medium">Курс людей в команде</p>
          <div className="space-y-3 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nevermind-course" id="nevermind-course" />
              <Label htmlFor="nevermind-course">Неважно</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1-course" id="1-course" />
              <Label htmlFor="1-course">1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2-course" id="2-course" />
              <Label htmlFor="2-course">2</Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
});
