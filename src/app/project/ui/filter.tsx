'use client';
import { useEffect, useState } from 'react';
import { useProjectStore } from '../store/project-store';
import { observer } from 'mobx-react-lite';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const Filter = observer(() => {
  const store = useProjectStore;
  const [isToggledList, setIsToggledList] = useState(true);
  const [isFilteredByCompany, setIsFilteredByCompany] = useState(false);
  const [isFilteredByPresentation, setIsFilteredByPresentation] = useState(false);
  const [isFilteredByTechnicalSpecifications, setIsFilteredByTechnicalSpecifications] =
    useState(false);

  useEffect(() => {
    store.getStackItems();
  }, []);
  let stackItems = Array.from(store.stackItems).slice(0, 3);
  if (!isToggledList) {
    stackItems = Array.from(store.stackItems);
  }
  const handleResetFilters = () => {
    store.resetFilters();

    setIsFilteredByCompany(false);
    setIsFilteredByPresentation(false);
    setIsFilteredByTechnicalSpecifications(false);
  };

  return (
    <div className="mt-2">
      <h2 className="text-lg font-semibold mb-4">Фильтры</h2>
      <div className="w-full h-fit flex flex-col gap-2">
        <h2 className="text-lg">Технический стек </h2>

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
          onClick={() => {
            if (isToggledList) setIsToggledList(false);
            else setIsToggledList(true);
          }}
        >
          {isToggledList ? 'Посмотреть все' : 'Свернуть'}
        </span>
        <span className="flex items-center gap-3">
          <Checkbox
            checked={isFilteredByCompany}
            onCheckedChange={() => {
              store.filterByCompany(isFilteredByCompany);
              if (isFilteredByCompany) setIsFilteredByCompany(false);
              else setIsFilteredByCompany(true);
            }}
          />
          <h2>Проект от компании</h2>
        </span>
        <span className="flex items-center gap-3">
          <Checkbox
            checked={isFilteredByPresentation}
            onCheckedChange={() => {
              store.filterByPresentation(isFilteredByPresentation);
              if (isFilteredByPresentation) setIsFilteredByPresentation(false);
              else setIsFilteredByPresentation(true);
            }}
          />
          <h2>Презентация</h2>
        </span>
        <span className="flex items-center gap-3">
          <Checkbox
            checked={isFilteredByTechnicalSpecifications}
            onCheckedChange={() => {
              store.filterByTechnicalSpecifications(isFilteredByTechnicalSpecifications);
              if (isFilteredByPresentation) setIsFilteredByTechnicalSpecifications(false);
              else setIsFilteredByTechnicalSpecifications(true);
            }}
          />
          <h2>Техническое заданиe</h2>
        </span>
        <Button className="mt-3" onClick={() => handleResetFilters()}>
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );
});

export default Filter;
