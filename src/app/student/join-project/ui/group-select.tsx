import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ANOTHER_GROUP, GROUPS } from '../lib/constant';
import { Input } from '@/components/ui/input';

export const GroupSelect = ({
  value,
  onChange,
  ...props
}: React.ComponentProps<typeof Input>) => {
  const [isOtherSelected, setIsOtherSelected] = useState(value === ANOTHER_GROUP);
  const groupsWithOther = [...GROUPS, ANOTHER_GROUP];

  const handleSelectChange = (val: string) => {
    if (val === ANOTHER_GROUP) {
      setIsOtherSelected(true);
      if (onChange) {
        onChange('' as never);
      }
    } else {
      setIsOtherSelected(false);
      if (onChange) {
        onChange(val as never);
      }
    }
  };

  if (isOtherSelected) {
    return (
      <Input
        value={value}
        onChange={e => {
          if (onChange) {
            onChange(e.target.value as never);
          }
        }}
        placeholder="Введите группу"
        {...props}
      />
    );
  }

  return (
    <Select value={String(value)} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите группу" />
      </SelectTrigger>
      <SelectContent>
        {groupsWithOther.map(group => (
          <SelectItem key={group} value={group}>
            {group}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
