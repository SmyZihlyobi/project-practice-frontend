'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { observer } from 'mobx-react-lite';
import { useProjectStore } from '@/store';
import { StackSearch } from './stack-search';

const Filter = observer(() => {
  const store = useProjectStore;

  const [isToggledList, setIsToggledList] = useState<boolean>(true);
  const [isFilteredByCompany, setIsFilteredByCompany] = useState<boolean>(false);
  const [isFilteredByPresentation, setIsFilteredByPresentation] =
    useState<boolean>(false);
  const [isFilteredByTechnicalSpecifications, setIsFilteredByTechnicalSpecifications] =
    useState<boolean>(false);
  const [isFilteredByActive, setIsFilteredByActive] = useState<boolean>(true);
  const [isFilteredByFavorite, setIsFilteredByFavorite] = useState<boolean>(false);

  useEffect(() => {
    store.getStackItems();
  }, [store]);

  let stackItems = Array.from(store.currentStackItems).slice(0, 3);
  if (!isToggledList) {
    stackItems = Array.from(store.currentStackItems);
  }

  const handleResetFilters = () => {
    store.resetFilters();
    setIsFilteredByCompany(false);
    setIsFilteredByPresentation(false);
    setIsFilteredByTechnicalSpecifications(false);
    setIsFilteredByFavorite(false);
    setIsFilteredByActive(true);
  };

  const renderCheckbox = (
    label: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
  ) => (
    <span className="flex items-center gap-3">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <h2>{label}</h2>
    </span>
  );

  return (
    <div className="mt-2">
      <h2 className="text-lg font-semibold mb-4">Фильтры</h2>
      <div className="w-full h-fit flex flex-col gap-2">
        <h2 className="text-lg">Технический стек</h2>
        <StackSearch />

        {stackItems.map((item, index) => (
          <div className="w-full flex items-center gap-3" key={index}>
            <Checkbox
              id={`stack-${index}`}
              checked={store.selectedStackItems.has(item)}
              onCheckedChange={() => store.toggleStackItem(item)}
            />
            <Label htmlFor={`stack-${index}`}>{item}</Label>
          </div>
        ))}

        <span
          className="cursor-pointer text-muted-foreground"
          onClick={() => setIsToggledList(!isToggledList)}
        >
          {isToggledList ? 'Посмотреть все' : 'Свернуть'}
        </span>

        {renderCheckbox('Избранное', isFilteredByFavorite, () => {
          const newValue = !isFilteredByFavorite;
          setIsFilteredByFavorite(newValue);
          store.filterByFavorite(!newValue);
        })}

        {renderCheckbox('Проект от компании', isFilteredByCompany, () => {
          const newValue = !isFilteredByCompany;
          setIsFilteredByCompany(newValue);
          store.filterByCompany(!newValue);
        })}

        {renderCheckbox('Скрыть архивные', isFilteredByActive, (checked: boolean) => {
          const newValue = Boolean(checked);
          setIsFilteredByActive(newValue);
          store.filterByActive(newValue);
        })}

        {renderCheckbox('Презентация', isFilteredByPresentation, () => {
          const newValue = !isFilteredByPresentation;
          setIsFilteredByPresentation(newValue);
          store.filterByPresentation(!newValue);
        })}

        {renderCheckbox(
          'Техническое задание',
          isFilteredByTechnicalSpecifications,
          () => {
            const newValue = !isFilteredByTechnicalSpecifications;
            setIsFilteredByTechnicalSpecifications(newValue);
            store.filterByTechnicalSpecifications(!newValue);
          },
        )}

        <Button className="mt-3" onClick={handleResetFilters}>
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );
});
export default Filter;
