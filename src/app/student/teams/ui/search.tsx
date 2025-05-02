'use client';

import { useCallback, useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { debounce } from '@/lib/utils';
import { observer } from 'mobx-react-lite';

import { SEARCH_DELAY } from '../lib/constant';
import { useTeamsStore } from '@/store';

export const Search = observer(() => {
  const teamStore = useTeamsStore;
  const [searchType, setSearchType] = useState<
    'team' | 'lastName' | 'firstName' | 'patronymic'
  >('team');
  const [searchValue, setSearchValue] = useState('');

  const debouncedFindByName = useMemo(
    () => debounce((value: string) => teamStore.findByName(value), SEARCH_DELAY),
    [teamStore],
  );

  const debouncedFindByLastName = useMemo(
    () =>
      debounce((value: string) => teamStore.findByStudentLastName(value), SEARCH_DELAY),
    [teamStore],
  );

  const debouncedFindByFirstName = useMemo(
    () =>
      debounce((value: string) => teamStore.findByStudentFirstName(value), SEARCH_DELAY),
    [teamStore],
  );

  const debouncedFindByPatronymic = useMemo(
    () => debounce((value: string) => teamStore.findByPatronymic(value), SEARCH_DELAY),
    [teamStore],
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      switch (searchType) {
        case 'team':
          debouncedFindByName(value);
          break;
        case 'lastName':
          debouncedFindByLastName(value);
          break;
        case 'firstName':
          debouncedFindByFirstName(value);
          break;
        case 'patronymic':
          debouncedFindByPatronymic(value);
          break;
        default:
          debouncedFindByName(value);
      }
    },
    [
      searchType,
      debouncedFindByName,
      debouncedFindByLastName,
      debouncedFindByFirstName,
      debouncedFindByPatronymic,
    ],
  );

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value as 'team' | 'lastName' | 'firstName' | 'patronymic');
    if (searchValue) {
      handleSearch(searchValue);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Select value={searchType} onValueChange={handleSearchTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Тип поиска" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="team">По названию команды</SelectItem>
          <SelectItem value="lastName">По фамилии студента</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder={
          searchType === 'team'
            ? 'Найти команду'
            : searchType === 'lastName'
              ? 'Поиск по фамилии'
              : searchType === 'firstName'
                ? 'Поиск по имени'
                : 'Поиск по отчеству'
        }
        value={searchValue}
        onChange={e => handleSearch(e.target.value)}
      />
    </div>
  );
});
